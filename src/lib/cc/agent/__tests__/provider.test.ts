// @vitest-environment node
// src/lib/cc/agent/__tests__/provider.test.ts
import {describe,it,expect,vi} from "vitest";
import {makeProvider,ratesFor} from "../provider";
import {estimateTokens,summarizePriorReleased} from "../context-budget";
import {ENGLISH_650,URDU_650} from "./long-essay-fixtures";
function env() {return {OPENROUTER_API_KEY:"test",OPENROUTER_AGENT_ROUTINE_MODEL:"fixture",OPENROUTER_AGENT_CHECK_MODEL:"fixture",
  OPENROUTER_AGENT_PRICING_JSON:JSON.stringify({fixture:{inputPerMillion:0.04,outputPerMillion:0.14,fixedPerRequest:0,verifiedAt:new Date().toISOString()}}),
  OPENROUTER_AGENT_CAPABILITIES_JSON:JSON.stringify([{role:"routine",model:"fixture",reachable:true,costReceiptUsd:0.000001,toolCalling:true,jsonMode:"unknown"},{role:"check",model:"fixture",reachable:true,costReceiptUsd:0.000001,toolCalling:"unknown",jsonMode:true}])};}
describe("openrouter provider adapter",()=>{
it("fails closed without model, capability observation or verified pricing",()=>{
 expect(()=>makeProvider("routine",vi.fn(),{})).toThrow("OPENROUTER_API_KEY");
 expect(()=>makeProvider("routine",vi.fn(),{...env(),OPENROUTER_AGENT_CAPABILITIES_JSON:"[]"})).toThrow("capability_unverified");
 expect(()=>makeProvider("routine",vi.fn(),{...env(),OPENROUTER_AGENT_PRICING_JSON:"{}"})).toThrow("pricing_unverified");
});
it("sends exactly three schemas and parses a structured call",async()=>{
 const fetcher=vi.fn().mockResolvedValue({ok:true,json:async()=>({usage:{cost:0.000001},choices:[{message:{content:null,tool_calls:[{id:"1",type:"function",function:{name:"read_context",arguments:"{}"}}]}}]})});
 const answer=await makeProvider("routine",fetcher,env())([{role:"user",content:"Help"}],new AbortController().signal);
 const body=JSON.parse(fetcher.mock.calls[0][1].body);
 expect(body.tools.map((t:{function:{name:string}})=>t.function.name)).toEqual(["read_context","read_essay","read_published_feedback"]);
 expect(body.tools.every((t:{function:{parameters:{additionalProperties:boolean}}})=>t.function.parameters.additionalProperties===false)).toBe(true);
 expect(answer.calls).toEqual([{id:"1",name:"read_context",arguments:"{}"}]);
});
it("checker requests JSON with no callable tools",async()=>{
 const fetcher=vi.fn().mockResolvedValue({ok:true,json:async()=>({usage:{cost:0.000001},choices:[{message:{content:'{"decision":"uncertain"}'}}]})});
 await makeProvider("check",fetcher,env())([{role:"user",content:"Return JSON."}],new AbortController().signal);
 const body=JSON.parse(fetcher.mock.calls[0][1].body);
 expect(body.response_format).toEqual({type:"json_object"});expect(body.tools).toBeUndefined();
});
it("never puts provider response bodies in thrown errors",async()=>{
 const fetcher=vi.fn().mockResolvedValue({ok:false,status:401,text:async()=>"private candidate"});
 await expect(makeProvider("routine",fetcher,env())([{role:"user",content:"Help"}],new AbortController().signal)).rejects.toThrow("provider_http_401");
 expect(fetcher).toHaveBeenCalledTimes(1);
});

it("unknown-cost failed calls retain reservation and disable the instance",async()=>{
 const fetcher=vi.fn().mockResolvedValue({ok:false,status:503});
 const config={...env(),OPENROUTER_AGENT_PRICING_JSON:JSON.stringify({fixture:{inputPerMillion:0,outputPerMillion:0,fixedPerRequest:0.07,verifiedAt:new Date().toISOString()}})};
 const provider=makeProvider("routine",fetcher,config);
 await expect(provider([{role:"user",content:"Hi"}],new AbortController().signal)).rejects.toThrow("provider_http_503");
 await expect(provider([{role:"user",content:"Hi"}],new AbortController().signal)).rejects.toThrow("provider_stopped_after_unknown_cost");
 expect(fetcher).toHaveBeenCalledTimes(1);
});
it("accepts a tool-only response with omitted content",async()=>{
 const fetcher=vi.fn().mockResolvedValue({ok:true,json:async()=>({usage:{cost:0.000001},choices:[{message:{tool_calls:[{id:"1",type:"function",function:{name:"read_context",arguments:"{}"}}]}}]})});
 expect((await makeProvider("routine",fetcher,env())([{role:"user",content:"Help"}],new AbortController().signal)).content).toBeNull();
});

it.each([ENGLISH_650,URDU_650])("admits a full 650-word essay through generation context gate",async essay=>{
 expect(essay.trim().split(/\s+/u)).toHaveLength(650);
 const fetcher=vi.fn().mockResolvedValue({ok:true,json:async()=>({usage:{cost:0.000001},choices:[{message:{content:"What changed?",tool_calls:[]}}]})});
 const messages=[{role:"system" as const,content:"Critique only."},{role:"tool" as const,tool_call_id:"essay",content:JSON.stringify({status:"ok",data:{content:essay}})}];
 expect(estimateTokens(JSON.stringify(messages))+256).toBeLessThan(12000);
 await makeProvider("routine",fetcher,env())(messages,new AbortController().signal);
 expect(fetcher).toHaveBeenCalledTimes(1);
});
it("summarizes released history within 512 estimated tokens with explicit omission",()=>{
 const summary=summarizePriorReleased([ENGLISH_650,URDU_650]);
 expect(estimateTokens(JSON.stringify(summary))).toBeLessThanOrEqual(512);
 expect(summary.join(" ")).toContain("PRIOR_CONTEXT_TRUNCATED");
});
it("keeps verified catalog prices usable for 30 days, configurable downward",()=>{
 const config=env();const prices=JSON.parse(config.OPENROUTER_AGENT_PRICING_JSON);
 prices.fixture.verifiedAt=new Date(Date.now()-29*86400000).toISOString();
 const updated={...config,OPENROUTER_AGENT_PRICING_JSON:JSON.stringify(prices)};
 expect(ratesFor("fixture",updated).inputPerMillion).toBe(0.04);
 expect(()=>ratesFor("fixture",{...updated,OPENROUTER_AGENT_PRICING_MAX_AGE_DAYS:"7"})).toThrow("pricing_unverified");
 prices.fixture.verifiedAt=new Date(Date.now()-31*86400000).toISOString();
 expect(()=>ratesFor("fixture",{...updated,OPENROUTER_AGENT_PRICING_JSON:JSON.stringify(prices)})).toThrow("pricing_unverified");
});

it.each([ENGLISH_650,URDU_650])("admits representative Sonnet/GLM essay calls and reconciles receipts",async essay=>{
 const base=env();
 const prices={fixture:{inputPerMillion:3,outputPerMillion:15,fixedPerRequest:0,verifiedAt:new Date().toISOString()}};
 const generationFetch=vi.fn().mockResolvedValue({ok:true,json:async()=>({usage:{cost:0.008},choices:[{message:{content:"What changed?"}}]})});
 const generation=makeProvider("routine",generationFetch,{...base,OPENROUTER_AGENT_PRICING_JSON:JSON.stringify(prices)});
 const messages=[{role:"user" as const,content:JSON.stringify({request:"Critique only",essay})}];
 await generation(messages,new AbortController().signal);await generation(messages,new AbortController().signal);
 expect(generationFetch).toHaveBeenCalledTimes(2);
 const checkFetch=vi.fn().mockResolvedValue({ok:true,json:async()=>({usage:{cost:0.005},choices:[{message:{content:'{"decision":"uncertain"}'}}]})});
 const checkPrices={fixture:{...prices.fixture,inputPerMillion:1.4,outputPerMillion:4.4}};
 const checker=makeProvider("check",checkFetch,{...base,OPENROUTER_AGENT_PRICING_JSON:JSON.stringify(checkPrices)});
 await checker(messages,new AbortController().signal);expect(checkFetch).toHaveBeenCalledTimes(1);
});
it("a missing receipt prevents further calls on the same instance",async()=>{
 const fetcher=vi.fn().mockResolvedValue({ok:true,json:async()=>({choices:[{message:{content:"Hello"}}]})});
 const provider=makeProvider("routine",fetcher,env());
 await expect(provider([{role:"user",content:"Hi"}],new AbortController().signal)).rejects.toThrow("provider_receipt_anomaly");
 await expect(provider([{role:"user",content:"Hi"}],new AbortController().signal)).rejects.toThrow("provider_stopped");
 expect(fetcher).toHaveBeenCalledTimes(1);
});

it("an excess receipt disables the adapter before another request",async()=>{
 const fetcher=vi.fn().mockResolvedValue({ok:true,json:async()=>({usage:{cost:99},choices:[{message:{content:"hello"}}]})});
 const provider=makeProvider("routine",fetcher,env());
 await expect(provider([{role:"user",content:"Hi"}],new AbortController().signal)).rejects.toThrow("provider_receipt_anomaly");
 await expect(provider([{role:"user",content:"Hi"}],new AbortController().signal)).rejects.toThrow("provider_stopped");
 expect(fetcher).toHaveBeenCalledTimes(1);
});
});
