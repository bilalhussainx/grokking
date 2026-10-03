// @vitest-environment node
// src/lib/cc/agent/__tests__/probe.test.ts
import {it,expect,vi} from "vitest";
import {probeModelCapabilities,fetchProbePricing,prepareProbe} from "../probe";
const env=()=>({OPENROUTER_API_KEY:"test",OPENROUTER_AGENT_ROUTINE_MODEL:"fixture",OPENROUTER_AGENT_PLANNER_MODEL:"fixture",OPENROUTER_AGENT_CHECK_MODEL:"fixture",OPENROUTER_AGENT_ESCALATION_MODEL:"fixture",OPENROUTER_AGENT_PRICING_JSON:JSON.stringify({fixture:{inputPerMillion:0.04,outputPerMillion:0.14,fixedPerRequest:0,verifiedAt:new Date().toISOString()}})});
const response=(json:boolean,cost:unknown=0.000001)=>({choices:[{message:json?{content:'{"ok":true}'}:{content:null,tool_calls:[{id:"1",type:"function",function:{name:"ping",arguments:"{}"}}]}}],usage:{cost}});
it("uses four calls maximum and keeps independent observed dimensions",async()=>{
 const fetcher=vi.fn().mockImplementation(async(_url,init)=>({ok:true,json:async()=>response(!!JSON.parse(init.body).response_format)}));
 const report=await probeModelCapabilities(["routine","planner","check","escalation","routine"],fetcher,env());
 expect(fetcher).toHaveBeenCalledTimes(4);expect(report.totalReservedUsd).toBeLessThan(0.05);
 const bodies=fetcher.mock.calls.map(call=>JSON.parse(call[1].body));
 expect(bodies[0].response_format).toBeUndefined();expect(bodies[2].tools).toBeUndefined();
 expect(bodies.every(body=>body.max_tokens===256&&body.usage.include===true)).toBe(true);
 expect(report.results[0].toolCalling).toBe(true);expect(report.results[0].jsonMode).toBe("unknown");
 expect(report.results[2].jsonMode).toBe(true);expect(report.results[2].toolCalling).toBe("unknown");
 expect(report.allPassed).toBe(true);
});
it("rejects unknown pricing before spending",async()=>{
 const fetcher=vi.fn();
 const outcome=await probeModelCapabilities(["routine"],fetcher,{...env(),OPENROUTER_AGENT_PRICING_JSON:"{}"}).then(report=>({report}),(e:Error)=>({error:e.message}));
 expect(outcome).toEqual({error:"pricing_unverified"});expect(fetcher).not.toHaveBeenCalled();
});
it("refuses a blank API key before any request",async()=>{
 const fetcher=vi.fn();
 await expect(probeModelCapabilities(["routine"],fetcher,{...env(),OPENROUTER_API_KEY:"  "})).rejects.toThrow(/^probe_key_missing$/);
 expect(fetcher).not.toHaveBeenCalled();
});
it("a receipt above the reserved bound is an anomaly that stops later roles",async()=>{
 const fetcher=vi.fn().mockResolvedValue({ok:true,json:async()=>response(false,0.01)});
 const report=await probeModelCapabilities(["routine","planner"],fetcher,env());
 expect(fetcher).toHaveBeenCalledTimes(1);
 expect(report.results[0]).toMatchObject({error:"probe_cost_bound_anomaly",costReceiptUsd:0.01,reachable:false});
 expect(report.results[1].error).toBe("probe_not_run_after_unknown_cost");
 expect(report.totalReceiptUsd).toBeNull();expect(report.allPassed).toBe(false);
});
it("a transport throw stops later roles and never reports its message",async()=>{
 const fetcher=vi.fn().mockRejectedValue(new Error("socket reset SECRET"));
 const report=await probeModelCapabilities(["routine","planner"],fetcher,env());
 expect(fetcher).toHaveBeenCalledTimes(1);
 expect(report.results[0].error).toBe("probe_transport_or_receipt_unknown");expect(report.results[1].error).toBe("probe_not_run_after_unknown_cost");
 expect(report.totalReceiptUsd).toBeNull();expect(JSON.stringify(report)).not.toContain("SECRET");
});
it.each([
 [{prompt:null,completion:"0.0000044",request:"0"},"probe_slug_or_price_unverified"],
 [{prompt:"0.0000014",completion:"",request:"0"},"probe_slug_or_price_unverified"],
 [{prompt:"0.0000014",completion:"0.0000044",request:"  "},"probe_slug_or_price_unverified"],
 [{prompt:"0.0000014",completion:"0.0000044",request:"0",input_cache_read:""},"pricing_extra_dimension_unverified"],
 [{prompt:"0.0000014",completion:"0.0000044",request:"0",internal_reasoning:null},"pricing_extra_dimension_unverified"],
])("a null or blank catalog price %j fails closed instead of reading as zero",async(pricing,code)=>{
 const fetcher=vi.fn().mockResolvedValue({ok:true,json:async()=>({data:[{id:"fixture",pricing}]})});
 await expect(fetchProbePricing(env(),fetcher)).rejects.toThrow(new RegExp(`^${code}$`));
});
it("unknown actual cost stops further calls and is never zero",async()=>{
 const fetcher=vi.fn().mockResolvedValue({ok:true,json:async()=>response(false,null)});
 const report=await probeModelCapabilities(["routine","planner"],fetcher,env());
 expect(fetcher).toHaveBeenCalledTimes(1);expect(report.totalReceiptUsd).toBeNull();expect(report.allPassed).toBe(false);
});
it.each([400,404,429])("continues after HTTP %s without usage and reports unknown receipt honestly",async status=>{
 const fetcher=vi.fn().mockResolvedValueOnce({ok:false,status,json:async()=>({error:{message:"PRIVATE provider text"}})})
  .mockResolvedValueOnce({ok:true,json:async()=>response(false)});
 const report=await probeModelCapabilities(["routine","planner"],fetcher,env());
 expect(fetcher).toHaveBeenCalledTimes(2);expect(report.results[0]).toMatchObject({error:"probe_http_failure",costReceiptUsd:null});
 expect(report.results[1].toolCalling).toBe(true);expect(report.totalReceiptUsd).toBeNull();
 expect(report.totalReservedUsd).toBeLessThan(.05);expect(JSON.stringify(report)).not.toContain("PRIVATE");
});
it("a complete tool name with invalid argument JSON is not a capability pass",async()=>{
 const fetcher=vi.fn().mockResolvedValue({ok:true,json:async()=>({choices:[{message:{content:null,tool_calls:[{id:"1",type:"function",function:{name:"ping",arguments:"not json"}}]}}]})});
 expect((await probeModelCapabilities(["routine"],fetcher,env())).allPassed).toBe(false);
});

it("continues after a length stop with known cost and never logs model text",async()=>{
 const fetcher=vi.fn().mockResolvedValueOnce({ok:true,json:async()=>({choices:[{finish_reason:"length",message:{content:"SECRET"}}],usage:{cost:0.000001}})})
  .mockResolvedValueOnce({ok:true,json:async()=>response(false)});
 const report=await probeModelCapabilities(["routine","planner"],fetcher,env());
 expect(fetcher).toHaveBeenCalledTimes(2);expect(report.results[1].toolCalling).toBe(true);
 expect(JSON.stringify(report)).not.toContain("SECRET");expect(report.totalReceiptUsd).toBe(0.000002);
});
it("does not leak JSON parser errors containing model text",async()=>{
 const fetcher=vi.fn().mockResolvedValue({ok:true,json:async()=>({choices:[{message:{content:"SECRET NOT JSON"}}],usage:{cost:0.000001}})});
 const report=await probeModelCapabilities(["check"],fetcher,env());
 expect(report.results[0].error).toBe("probe_invalid_payload");expect(JSON.stringify(report)).not.toContain("SECRET");
});
it("prevalidates every role and the total bound without a paid request",async()=>{
 const fetcher=vi.fn();
 await expect(probeModelCapabilities(["routine","planner"],fetcher,{...env(),OPENROUTER_AGENT_PLANNER_MODEL:""})).rejects.toThrow("probe_model_missing");
 const costly={...env(),OPENROUTER_AGENT_PRICING_JSON:JSON.stringify({fixture:{inputPerMillion:0,outputPerMillion:100,fixedPerRequest:0,verifiedAt:new Date().toISOString()}})};
 await expect(probeModelCapabilities(["routine"],fetcher,costly)).rejects.toThrow("probe_budget_exceeded");
 expect(fetcher).not.toHaveBeenCalled();
});

it("fetches catalog prices without a key and prevalidates a text-only cached-price entry",async()=>{
 const fetcher=vi.fn().mockResolvedValue({ok:true,json:async()=>({data:[{id:"fixture",pricing:{prompt:"0.0000014",completion:"0.0000044",request:"0",input_cache_read:"0.0000001",image:"0.01",web_search:"0.02"}}]})});
 const config=await fetchProbePricing(env(),fetcher);
 expect(fetcher.mock.calls[0][0]).toBe("https://openrouter.ai/api/v1/models");
 expect(fetcher.mock.calls[0][1]).not.toHaveProperty("headers");
 expect(prepareProbe(["routine","planner","check","escalation"],config).totalUpper).toBeLessThan(0.05);
});
