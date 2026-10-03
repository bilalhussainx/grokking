// src/lib/cc/agent/probe.ts
import {ROLE_ENV_VARS,ratesFor,upperCost,outputMultiplier,bounded,type AgentRole,type Rates} from "./provider";
type ProbeMessage={content?:unknown;tool_calls?:Array<{id?:unknown;type?:unknown;function?:{name?:unknown;arguments?:unknown}}>};
type ProbeResponse={choices?:Array<{finish_reason?:string;message?:ProbeMessage}>;usage?:{cost?:unknown}};
export interface RoleProbeResult {
 role:AgentRole;model:string;reachable:boolean;latencyMs:number;toolCalling:boolean|"unknown";jsonMode:boolean|"unknown";
 costReceiptUsd:number|null;reservedUpperUsd:number;error?:string;
}
export interface ProbeSuiteResult {results:RoleProbeResult[];totalReservedUsd:number;totalReceiptUsd:number|null;allPassed:boolean}
export type PreparedProbe={env:Record<string,string|undefined>;requests:Array<{role:AgentRole;model:string;body:unknown;upper:number}>;totalUpper:number};
export function prepareProbe(roles:AgentRole[],env:Record<string,string|undefined>):PreparedProbe {
 if(!env.OPENROUTER_API_KEY?.trim())throw Error("probe_key_missing");
 const requested=[...new Set(roles)];
 if(requested.length>4||requested.some(role=>!Object.hasOwn(ROLE_ENV_VARS,role)))throw Error("probe_roles_invalid");
 const multiplier=outputMultiplier(env);
 const requests=requested.map(role=>{
  const model=env[ROLE_ENV_VARS[role]]?.trim();
  if(!model)throw Error("probe_model_missing");
  const body={model,messages:[{role:"user",content:role==="check"?'Return only the JSON object {"ok":true}.':"Call ping once with an empty argument object."}],
   ...(role==="check"?{response_format:{type:"json_object"}}:{
    tools:[{type:"function",function:{name:"ping",description:"Ping",parameters:{type:"object",properties:{},additionalProperties:false}}}],
    tool_choice:{type:"function",function:{name:"ping"}}}),
   provider:{require_parameters:true},usage:{include:true},max_tokens:256,temperature:0};
  return {role,model,body,upper:upperCost(body,256*multiplier,ratesFor(model,env))};
 });
 const totalUpper=requests.reduce((sum,r)=>sum+r.upper,0);
 if(totalUpper>=0.05)throw Error("probe_budget_exceeded");
 return {env:{...env},requests,totalUpper};
}
// Free catalog lookup: no completion call and no authorization header/key in this request.
export async function fetchProbePricing(env:Record<string,string|undefined>,transport:typeof fetch=fetch):Promise<Record<string,string|undefined>> {
 const response=await transport("https://openrouter.ai/api/v1/models",{signal:AbortSignal.timeout(10000)});
 if(!response.ok)throw Error("pricing_catalog_unavailable");
 const payload=await response.json() as {data?:Array<{id?:string;pricing?:Record<string,string|number>}>};
 if(!Array.isArray(payload.data))throw Error("pricing_catalog_invalid");
 const prices:Record<string,Rates>={};
 for(const role of Object.keys(ROLE_ENV_VARS) as AgentRole[]){
  const model=env[ROLE_ENV_VARS[role]]?.trim();if(!model)throw Error("probe_model_missing");
  const entry=payload.data.find(row=>row.id===model),p=entry?.pricing;
  if(!p||p.prompt===undefined||p.completion===undefined||p.request===undefined)throw Error("probe_slug_or_price_unverified");
  const input=Number(p.prompt),output=Number(p.completion),fixed=Number(p.request);
  if(![input,output,fixed].every(n=>Number.isFinite(n)&&n>=0))throw Error("pricing_catalog_invalid");
  // Images/search are not requested; cached input is accepted only at or below prompt price.
  const irrelevant=new Set(["image","image_token","web_search"]);
  if(Object.entries(p).some(([k,v])=>{if(["prompt","completion","request"].includes(k)||irrelevant.has(k))return false;if(["input_cache_read","input_cache_write"].includes(k))return !Number.isFinite(Number(v))||Number(v)<0||Number(v)>input;return Number(v)!==0;}))throw Error("pricing_extra_dimension_unverified");
  prices[model]={inputPerMillion:input*1e6,outputPerMillion:output*1e6,fixedPerRequest:fixed,verifiedAt:new Date().toISOString()};
 }
 return {...env,OPENROUTER_AGENT_PRICING_JSON:JSON.stringify(prices)};
}
export async function runPreparedProbe(prepared:PreparedProbe,transport:typeof fetch=fetch):Promise<ProbeSuiteResult>{
 const results:RoleProbeResult[]=[];let totalReceiptUsd:number|null=0,totalReservedUsd=0,stop=false;
 for(const request of prepared.requests){
  const result:RoleProbeResult={role:request.role,model:request.model,reachable:false,latencyMs:0,toolCalling:"unknown",jsonMode:"unknown",costReceiptUsd:null,reservedUpperUsd:0};
  if(stop){result.error="probe_not_run_after_unknown_cost";results.push(result);continue;}
  const start=Date.now();result.reservedUpperUsd=request.upper;totalReservedUsd+=request.upper;
  try {
   const {response,data}=await bounded(async signal=>{
    const response=await transport("https://openrouter.ai/api/v1/chat/completions",{
     method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+prepared.env.OPENROUTER_API_KEY},body:JSON.stringify(request.body),signal});
    let data:ProbeResponse;
    try{data=await response.json() as ProbeResponse;}catch{if(response.ok)throw Error("probe_invalid_response");data={};}
    return{response,data};
   },new AbortController().signal,10000);
   const cost=data?.usage?.cost;
   if(!response.ok){
    result.error="probe_http_failure";
    if(typeof cost==="number"&&Number.isFinite(cost)&&cost>=0){result.costReceiptUsd=cost;if(totalReceiptUsd!==null)totalReceiptUsd+=cost;}
    else totalReceiptUsd=null; // Non-2xx with no receipt continues under the already-admitted total bound.
   }
   else if(typeof cost!=="number"||!Number.isFinite(cost)||cost<0){result.error="probe_cost_unknown";totalReceiptUsd=null;stop=true;}
   else if(cost>request.upper){result.costReceiptUsd=cost;result.error="probe_cost_bound_anomaly";totalReceiptUsd=null;stop=true;}
   else {
    result.costReceiptUsd=cost;if(totalReceiptUsd!==null)totalReceiptUsd+=cost;result.reachable=true;
    const choice=data.choices?.[0],message=choice?.message;
    if(!message||choice?.finish_reason==="length")result.error="probe_incomplete_response";
    else {
     try{
      if(request.role!=="check"){
       const call=message.tool_calls?.length===1?message.tool_calls[0]:undefined;
       if(call?.type==="function"&&typeof call.id==="string"&&call.function?.name==="ping"&&typeof call.function.arguments==="string"){
        const args:unknown=JSON.parse(call.function.arguments);
        result.toolCalling=!!args&&typeof args==="object"&&!Array.isArray(args)&&Object.keys(args).length===0;
       }else result.toolCalling=false;
      }else if(!message.tool_calls?.length&&typeof message.content==="string"){
       const value:unknown=JSON.parse(message.content);
       result.jsonMode=!!value&&typeof value==="object"&&!Array.isArray(value);
      }else result.jsonMode=false;
     }catch{result.error="probe_invalid_payload";} // Never expose parser messages containing model text.
     if(!result.error&&(request.role==="check"?result.jsonMode!==true:result.toolCalling!==true))result.error="probe_capability_unobserved";
    }
   }
  }catch{result.error="probe_transport_or_receipt_unknown";totalReceiptUsd=null;stop=true;}
  result.latencyMs=Date.now()-start;results.push(result);
  // HTTP failure does not block later admitted roles; a 2xx invalid receipt or dropped transport does.
 }
 return{results,totalReservedUsd,totalReceiptUsd,allPassed:results.every(r=>r.reachable&&!r.error&&(r.role==="check"?r.jsonMode===true:r.toolCalling===true))};
}
export async function probeModelCapabilities(roles:AgentRole[],customFetch?:typeof fetch,envOverride?:Record<string,string|undefined>):Promise<ProbeSuiteResult>{
 return runPreparedProbe(prepareProbe(roles,envOverride??process.env),customFetch);
}
