// @vitest-environment node
// src/lib/cc/agent/__tests__/loop.test.ts
import {it,expect,vi} from "vitest";
import {runAgent,runAgentWithPolicy} from "../loop";
import {denyAllCheck,type AgentInput,type OutputCheck,type Provider,type ReadTools} from "../contracts";
const input:AgentInput={message:"Help me revise",essayId:"a11ce000-2222-4000-8000-000000000001",locale:"en"};
const allow:OutputCheck=async candidate=>({decision:"allow",result:{...candidate,policyVersion:"test-only"}});
const reply={status:"unknown" as const,data:{reason:"missing"},evidence:[]};
it("provides the active essay and complete tool status to the next step",async()=>{
 const provider=vi.fn<Provider>().mockResolvedValueOnce({content:null,calls:[{id:"1",name:"read_context",arguments:"{}"}]}).mockResolvedValueOnce({content:"What changed in your decision?",calls:[]});
 const tools=vi.fn<ReadTools>().mockResolvedValue(reply);
 const answer=await runAgent(input,{provider,tools,check:allow,signal:new AbortController().signal,priorReleased:[]});
 expect(answer.policyVersion).toBe("test-only");
 expect(provider.mock.calls[0][0][1].content).toContain(input.essayId);
 const tool=provider.mock.calls[1][0].find(m=>m.role==="tool");expect(JSON.parse(tool!.content!)).toEqual({status:reply.status,data:reply.data});expect(JSON.parse(tool!.content!)).not.toHaveProperty("evidence");
});
it("passes the once-summarized history through unchanged",async()=>{
 const priorReleased=["[PRIOR_CONTEXT_TRUNCATED: omitted history]","retained tail"];
 const check=vi.fn<OutputCheck>().mockImplementation(allow);
 await runAgent(input,{provider:async()=>({content:"What changed?",calls:[]}),tools:vi.fn(),check,signal:new AbortController().signal,priorReleased});
 expect(check.mock.calls[0][1].priorReleased).toBe(priorReleased);
});
it("evaluation policy permits slower generation and check while runtime defaults remain bounded",async()=>{
 vi.useFakeTimers();
 try{
  const provider:Provider=()=>new Promise(resolve=>setTimeout(()=>resolve({content:"What changed?",calls:[]}),30000));
  const check:OutputCheck=candidate=>new Promise(resolve=>setTimeout(()=>resolve({decision:"allow",result:{...candidate,policyVersion:"test-only"}}),12000));
  const deps={provider,tools:vi.fn(),check,signal:new AbortController().signal,priorReleased:[]};
  const runtime=expect(runAgent(input,deps)).rejects.toThrow("operation_aborted_or_timeout");
  await vi.advanceTimersByTimeAsync(20001);await runtime;
  const evaluation=runAgentWithPolicy(input,deps,{generationMs:45000,checkerMs:20000,turnMs:240000});
  await vi.advanceTimersByTimeAsync(42001);expect((await evaluation).policyVersion).toBe("test-only");
  await expect(runAgentWithPolicy(input,deps,{generationMs:45001,checkerMs:20000,turnMs:240000})).rejects.toThrow("invalid_run_policy");
 }finally{vi.useRealTimers();}
});
it.each(["block","uncertain"] as const)("returns no candidate for %s",async decision=>{
 const provider=vi.fn<Provider>().mockResolvedValue({content:"UNSAFE",calls:[]});
 const check:OutputCheck=async()=>({decision,reason:"blocked"});
 await expect(runAgent(input,{provider,tools:vi.fn(),check,signal:new AbortController().signal,priorReleased:[]})).rejects.toThrow("output_check_failed");
});
it("rejects malformed or unregistered tool batches before a read",async()=>{
 for(const call of [{id:"1",name:"read_context",arguments:"bad json"},{id:"1",name:"sql",arguments:"{}"}]) {
  const tools=vi.fn();const provider=vi.fn<Provider>().mockResolvedValue({content:null,calls:[call]});
  await expect(runAgent(input,{provider,tools,check:allow,signal:new AbortController().signal,priorReleased:[]})).rejects.toThrow();expect(tools).not.toHaveBeenCalled();
 }
});
it("does not exceed four model calls or eight tool calls",async()=>{
 const provider=vi.fn<Provider>().mockResolvedValue({content:null,calls:[{id:"1",name:"read_context",arguments:"{}"},{id:"2",name:"read_context",arguments:"{}"}]});
 const tools=vi.fn<ReadTools>().mockResolvedValue(reply);
 await expect(runAgent(input,{provider,tools,check:allow,signal:new AbortController().signal,priorReleased:[]})).rejects.toThrow("generation_budget_exceeded");
 expect(provider).toHaveBeenCalledTimes(4);expect(tools).toHaveBeenCalledTimes(8);
});
it("a checker that ignores its AbortSignal still cannot hang release",async()=>{
 vi.useFakeTimers();
 try {
  const work=runAgent(input,{provider:async()=>({content:"Candidate",calls:[]}),tools:vi.fn(),check:()=>new Promise(()=>{}),signal:new AbortController().signal,priorReleased:[]});
  const assertion=expect(work).rejects.toThrow("operation_aborted_or_timeout");
  await vi.advanceTimersByTimeAsync(8001);await assertion;
 }finally{vi.useRealTimers();}
});
it("an already aborted caller does not invoke provider",async()=>{
 const signal=AbortSignal.abort(),provider=vi.fn();
 await expect(runAgent(input,{provider,tools:vi.fn(),check:denyAllCheck,signal,priorReleased:[]})).rejects.toThrow();expect(provider).not.toHaveBeenCalled();
});

it("passes every structured card field through the same output checker",async()=>{
 const candidate={text:"One priority",cards:[{title:"Develop reflection",question:"What changed?"}]};
 const check=vi.fn<OutputCheck>().mockImplementation(allow);
 const result=await runAgent(input,{provider:async()=>({content:JSON.stringify(candidate),calls:[]}),tools:vi.fn(),check,signal:new AbortController().signal,priorReleased:[]});
 expect(result.cards).toEqual(candidate.cards);expect(check.mock.calls[0][0]).toEqual(candidate);
});
it.each(['{"text":"x","cards":{},"extra":true}','{"text":"x","cards":[],"extra":true}','{"text":'])('rejects malformed structured candidate %s before checking',async content=>{
 const check=vi.fn<OutputCheck>();
 await expect(runAgent(input,{provider:async()=>({content,calls:[]}),tools:vi.fn(),check,signal:new AbortController().signal,priorReleased:[]})).rejects.toThrow();
 expect(check).not.toHaveBeenCalled();
});

it("keeps evidence server-side rather than duplicating it in tool messages",async()=>{
 const tools=vi.fn<ReadTools>().mockResolvedValue({status:"ok",data:{text:"essay body"},evidence:[{sourceId:"essay",text:"essay body"}]});
 const provider=vi.fn<Provider>().mockResolvedValueOnce({content:null,calls:[{id:"1",name:"read_context",arguments:"{}"}]})
 .mockResolvedValueOnce({content:"What changed?",calls:[]});
 await runAgent(input,{provider,tools,check:allow,signal:new AbortController().signal,priorReleased:[]});
 const tool=provider.mock.calls[1][0].find(message=>message.role==="tool");
 expect(tool?.content).toBe(JSON.stringify({status:"ok",data:{text:"essay body"}}));
});

it.each([
 ["altered text",async(c:{text:string;cards:never[]})=>({decision:"allow",result:{...c,text:"rewritten",policyVersion:"p"}})],
 ["altered cards",async(c:{text:string;cards:never[]})=>({decision:"allow",result:{...c,cards:[{x:1}],policyVersion:"p"}})],
 ["missing result",async()=>({decision:"allow"})],
 ["empty policyVersion",async(c:{text:string;cards:never[]})=>({decision:"allow",result:{...c,policyVersion:""}})],
])("releases nothing when an allowing checker returns %s",async(_n,fn)=>{
 const check=fn as unknown as OutputCheck;
 await expect(runAgent(input,{provider:async()=>({content:"What changed?",calls:[]}),tools:vi.fn(),check,signal:new AbortController().signal,priorReleased:[]})).rejects.toThrow("output_check_failed");
});
it("releases exactly the checked candidate with the checker's policyVersion",async()=>{
 const result=await runAgent(input,{provider:async()=>({content:"What changed?",calls:[]}),tools:vi.fn(),check:async c=>({decision:"allow",result:{...c,policyVersion:"v9",extra:"leak"} as never}),signal:new AbortController().signal,priorReleased:[]});
 expect(result).toEqual({text:"What changed?",cards:[],policyVersion:"v9"});
});
