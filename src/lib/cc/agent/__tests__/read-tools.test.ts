// @vitest-environment node
// src/lib/cc/agent/__tests__/read-tools.test.ts
import {it,expect,vi} from "vitest";
import {makeReadTools,validateToolArgs} from "../read-tools";
import {studentWorld,asDb,ALICE,ALICE_PROFILE,ALICE_ESSAY,BOB_ESSAY} from "../../__tests__/helpers/fixtures";
import {createFakeSupabase,type FakeQuery,type FakeSupabase} from "../../__tests__/helpers/fake-supabase";
const scope={userId:ALICE,profileIds:[ALICE_PROFILE]};
// Runs `beforeResult` as each query is awaited; offers .abortSignal() only when `bind` is given.
function instrumented(beforeResult:()=>void,bind?:(signal:AbortSignal)=>void):FakeSupabase {
 const fake=studentWorld();
 fake.tables.cc_counselor_comments=[{id:"1",artifact_type:"essay",artifact_id:ALICE_ESSAY,student_user_id:ALICE,status:"shipped",body:"Published critique"}];
 return {tables:fake.tables,from:(table:string)=>{
  const q=fake.from(table) as FakeQuery&{abortSignal?:(s:AbortSignal)=>FakeQuery};
  const then=q.then.bind(q);
  q.then=((ok,err)=>{beforeResult();return then(ok,err);}) as typeof q.then;
  if(bind) q.abortSignal=s=>{bind(s);return q;};
  return q;
 }};
}
const calls=[["read_context",{}],["read_essay",{essayId:ALICE_ESSAY,versionNumber:1}],["read_published_feedback",{essayId:ALICE_ESSAY}]] as const;
it("an already aborted signal makes no query",async()=>{
 const fake=studentWorld();const from=vi.spyOn(fake,"from"),tools=makeReadTools(asDb(fake),scope);
 for(const [name,args] of calls) await expect(tools(name,args,AbortSignal.abort(new Error("operation_timeout")))).rejects.toThrow(/^operation_timeout$/);
 expect(from).not.toHaveBeenCalled();
});
it("binds the call signal to every query when the client supports abortSignal",async()=>{
 for(const [name,args] of calls) {
  const bound:AbortSignal[]=[],signal=new AbortController().signal;
  const reply=await makeReadTools(asDb(instrumented(()=>{},s=>bound.push(s))),scope)(name,args,signal);
  expect(reply.status).not.toBe("retryable_error");expect(bound.length).toBeGreaterThan(0);expect(bound.every(s=>s===signal)).toBe(true);
 }
});
it("a signal aborted while a query is in flight discards the result",async()=>{
 for(const [name,args] of calls) {
  const controller=new AbortController();
  const tools=makeReadTools(asDb(instrumented(()=>controller.abort(new Error("operation_timeout")))),scope);
  await expect(tools(name,args,controller.signal)).rejects.toThrow(/^operation_timeout$/);
 }
});
it("rejects unknown tools, extra properties and malformed arguments before any query",async()=>{
 const fake=studentWorld();const from=vi.spyOn(fake,"from"),tools=makeReadTools(asDb(fake),scope);
 for(const [name,args] of [["read_context",{userId:ALICE}],["read_context",{domains:"profile"}],["read_essay",{essayId:ALICE_ESSAY,versionNumber:1.5}],["sql",{}]] as const) expect((await tools(name,args)).status).toBe("denied");
 expect(from).not.toHaveBeenCalled();expect(validateToolArgs("read_context",{})).toEqual({});
});
it("preserves every owned profile deterministically; missing is explicit",async()=>{
 const fake=studentWorld();const second="a11ce000-1111-4000-8000-000000000003";
 fake.tables.cc_student_profiles.unshift({id:second,user_id:ALICE,grade_level:11});
 const tools=makeReadTools(asDb(fake),{userId:ALICE,profileIds:[second,ALICE_PROFILE]});
 const reply=await tools("read_context",{});
 expect(reply.status).toBe("ok");expect(reply.data).toMatchObject({profile:{records:[{id:ALICE_PROFILE},{id:second}],reconciliationRequired:true},academic:{records:[],state:"missing"},financial:{records:[],state:"missing"}});
});
it("database errors are retryable and never a successful missing domain",async()=>{
 const fake=createFakeSupabase(studentWorld().tables,{columns:{cc_student_profiles:["id","user_id"]}});
 const reply=await makeReadTools(asDb(fake),scope)("read_context",{domains:["profile"]});
 expect(reply).toEqual({status:"retryable_error",data:null,evidence:[]});
});
it("an owned essay is allowed, another owner is denied, missing history stays unknown",async()=>{
 const tools=makeReadTools(asDb(studentWorld()),scope);
 expect((await tools("read_essay",{essayId:ALICE_ESSAY})).data).toMatchObject({essay:{current_draft:"Alice wrote this."}});
 expect((await tools("read_essay",{essayId:BOB_ESSAY})).status).toBe("denied");
 expect((await tools("read_essay",{essayId:ALICE_ESSAY,versionNumber:9})).status).toBe("unknown");
});
it("reads only shipped comments bound to the authenticated subject",async()=>{
 const fake=studentWorld();
 fake.tables.cc_counselor_comments=[
 {id:"1",artifact_type:"essay",artifact_id:ALICE_ESSAY,student_user_id:ALICE,status:"shipped",body:"Published critique"},
 {id:"2",artifact_type:"essay",artifact_id:ALICE_ESSAY,student_user_id:ALICE,status:"draft",body:"Private draft"},
 {id:"3",artifact_type:"essay",artifact_id:ALICE_ESSAY,student_user_id:"other",status:"shipped",body:"Different subject"}
 ];
 const reply=await makeReadTools(asDb(fake),scope)("read_published_feedback",{essayId:ALICE_ESSAY});
 expect(reply.status).toBe("ok");expect(reply.data).toMatchObject({comments:[{id:"1",body:"Published critique"}]});
 expect(JSON.stringify(reply)).not.toContain("Private draft");
});
