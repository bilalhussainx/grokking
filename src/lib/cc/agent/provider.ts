// src/lib/cc/agent/provider.ts
import { estimateTokens } from "./context-budget";
import { READ_TOOL_DEFINITIONS } from "./read-tools";
import type { ChatMessage, ModelReply, Provider } from "./contracts";
export type AgentRole = "routine" | "planner" | "check" | "escalation";
export const ROLE_ENV_VARS: Record<AgentRole, string> = {
  routine: "OPENROUTER_AGENT_ROUTINE_MODEL", planner: "OPENROUTER_AGENT_PLANNER_MODEL",
  check: "OPENROUTER_AGENT_CHECK_MODEL", escalation: "OPENROUTER_AGENT_ESCALATION_MODEL"
};
export type Rates = { inputPerMillion: number; outputPerMillion: number; fixedPerRequest: number; verifiedAt: string };
// Parser messages quote the input, so config JSON failures surface only as a fixed code.
function parseConfig(text: string, code: string): unknown {
  try { return JSON.parse(text); } catch { throw new Error(code); }
}
export function ratesFor(model: string, env: Record<string,string|undefined>): Rates {
  const ageDays=Number(env.OPENROUTER_AGENT_PRICING_MAX_AGE_DAYS??"30");
  if(!Number.isFinite(ageDays)||ageDays<=0||ageDays>30)throw new Error("pricing_age_invalid");
  const table=parseConfig(env.OPENROUTER_AGENT_PRICING_JSON ?? "{}","pricing_config_invalid");
  if(!table || typeof table!=="object" || Array.isArray(table)) throw new Error("pricing_config_invalid");
  const rates = (table as Record<string, Rates | undefined>)[model];
  const verifiedAt = rates ? Date.parse(rates.verifiedAt) : NaN, now = Date.now();
  // A future timestamp beyond clock skew (e.g. a typo'd year) must not keep prices "fresh" indefinitely.
  if (!rates || ![rates.inputPerMillion,rates.outputPerMillion,rates.fixedPerRequest].every(v => Number.isFinite(v) && v >= 0) || !Number.isFinite(verifiedAt) || verifiedAt-now > 5*60000 || now-verifiedAt > ageDays*86400000) throw new Error("pricing_unverified");
  return rates;
}
// Monetary reservations deliberately remain separate from approximate context gates.
// UTF-8 bytes + framing pessimistically reserve input; the caller passes its output-token bound
// (the runtime adapter a flat 1,500; the probe 256 x outputMultiplier for reasoning tokens).
// Receipts reconcile actual spend. A pricing/receipt anomaly stops further paid calls.
export function upperCost(body: unknown, output: number, rates: Rates): number {
  return (new TextEncoder().encode(JSON.stringify(body)).length + 1024) * rates.inputPerMillion / 1e6 + output * rates.outputPerMillion / 1e6 + rates.fixedPerRequest;
}
export function outputMultiplier(env:Record<string,string|undefined>):number {
  const n=Number(env.OPENROUTER_AGENT_OUTPUT_TOKEN_MULTIPLIER??"4");
  if(!Number.isInteger(n)||n<4||n>32)throw new Error("output_multiplier_invalid");
  return n;
}
export async function bounded<T>(work: (signal: AbortSignal) => Promise<T>, parent: AbortSignal, ms: number): Promise<T> {
  if(parent.aborted) throw new Error("operation_aborted"); // A fixed code, not the caller's arbitrary abort reason.
  const controller = new AbortController();
  const abort = () => controller.abort(new Error("operation_aborted"));
  parent.addEventListener("abort",abort,{once:true});
  const timer = setTimeout(() => controller.abort(new Error("operation_timeout")),ms);
  let rejectAbort: () => void = () => {};
  try {
    return await Promise.race([work(controller.signal),new Promise<T>((_,reject) => {
      rejectAbort=()=>reject(new Error("operation_aborted_or_timeout"));
      controller.signal.addEventListener("abort",rejectAbort,{once:true});
      if(controller.signal.aborted) rejectAbort();
    })]);
  } finally { clearTimeout(timer); parent.removeEventListener("abort",abort); controller.signal.removeEventListener("abort",rejectAbort); }
}
export function makeProvider(role: AgentRole, customFetch?: typeof fetch, envOverride?: Record<string,string|undefined>): Provider {
  const env=envOverride ?? process.env;
  const apiKey=env.OPENROUTER_API_KEY?.trim(), model=env[ROLE_ENV_VARS[role]]?.trim();
  if(!apiKey) throw new Error("provider_key_missing");
  if(!model) throw new Error("provider_model_missing");
  const approvals=parseConfig(env.OPENROUTER_AGENT_CAPABILITIES_JSON ?? "[]","capability_config_invalid");
  if(!Array.isArray(approvals)) throw new Error("capability_config_invalid");
  const approval=(approvals as Array<{role:string;model:string;toolCalling:unknown;jsonMode:unknown;reachable:boolean;error?:string;costReceiptUsd?:number|null}|null>)
    .find(a=>a?.role===role && a?.model===model);
  if(!approval?.reachable || approval.error || typeof approval.costReceiptUsd!=="number" || (role==="check" ? approval.jsonMode!==true : approval.toolCalling!==true)) throw new Error("capability_unverified");
  const rates=ratesFor(model,env);
  // One fresh adapter instance per role per turn; never reset or switch roles to evade this budget.
  let reservedUsd=0,calls=0,stopped=false;
  const ceiling=role==="check"?0.03:0.12,maximumCalls=role==="check"?2:4;
  return async (messages: ChatMessage[],signal: AbortSignal) => {
    if(stopped)throw new Error("provider_stopped_after_unknown_cost");
    const body={ model, messages, max_tokens:1500, temperature:0.2, provider:{require_parameters:true},usage:{include:true},
      ...(role==="check" ? {response_format:{type:"json_object"}} : {tools:READ_TOOL_DEFINITIONS,tool_choice:"auto"}) };
    if(estimateTokens(JSON.stringify(body))+256>(role==="check"?6000:12000)) throw new Error("context_budget_exceeded");
    // Reserve before dispatch; failed/aborted calls consume the bound too.
    const reserve=upperCost(body,1500,rates); // Runtime allowance; the separate probe uses its reasoning multiplier.
    if(calls>=maximumCalls || reservedUsd+reserve>ceiling) throw new Error("call_budget_exceeded");
    calls++; reservedUsd+=reserve;
    let accounted=false;
    try { return await bounded(async callSignal => {
      const res=await (customFetch??fetch)("https://openrouter.ai/api/v1/chat/completions",{
        method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${apiKey}`},body:JSON.stringify(body),signal:callSignal
      });
      if(!res.ok) throw new Error(`provider_http_${res.status}`);
      let raw:unknown;
      try { raw=await res.json(); } catch { throw new Error("provider_invalid_response"); } // Never rethrow body excerpts.
      if(!raw || typeof raw!=="object") throw new Error("provider_invalid_response");
      const data=raw as {usage?:{cost?:unknown};choices?:Array<{finish_reason?:string;message?:{content?:unknown;tool_calls?:unknown}}>};
      const cost=data?.usage?.cost;
      if(typeof cost!=="number"||!Number.isFinite(cost)||cost<0||cost>reserve)throw new Error("provider_receipt_anomaly");
      reservedUsd+=cost-reserve;accounted=true; // Release unused allowance only on a trustworthy receipt.
      const choice=data.choices?.[0],message=choice?.message;
      if(!message || choice?.finish_reason==="length" || (message.content!=null && typeof message.content!=="string")) throw new Error("provider_invalid_response");
      if(message.tool_calls!=null && !Array.isArray(message.tool_calls)) throw new Error("provider_invalid_tools");
      const toolCalls=(message.tool_calls??[]) as Array<{id?:unknown;type?:unknown;function?:{name?:unknown;arguments?:unknown}}>;
      if(toolCalls.length>8 || toolCalls.some(c=>typeof c.id!=="string" || c.type!=="function" || typeof c.function?.name!=="string" || typeof c.function?.arguments!=="string")) throw new Error("provider_invalid_tools");
      if(role==="check" && toolCalls.length) throw new Error("checker_tool_call_denied");
      if(typeof message.content==="string" && estimateTokens(message.content)>1400) throw new Error("candidate_too_large");
      callSignal.throwIfAborted();
      return {content:(message.content??null) as string|null,calls:toolCalls.map(c=>({id:c.id as string,name:c.function!.name as string,arguments:c.function!.arguments as string}))} satisfies ModelReply;
    },signal,role==="check"?8000:20000); }
    catch(error){if(!accounted)stopped=true;throw error;}
  };
}
