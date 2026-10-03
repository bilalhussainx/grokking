// @vitest-environment node
// src/lib/cc/agent/__tests__/integration-a1.test.ts
import {it,expect,vi} from "vitest";
import {runAgent} from "../loop";
import {makeReadTools} from "../read-tools";
import {denyAllCheck,type ChatMessage,type OutputCheck,type Provider} from "../contracts";
import {encodeEvent,decodeEvents} from "../sse";
import {studentWorld,asDb,ALICE,ALICE_PROFILE,ALICE_ESSAY,BOB_ESSAY} from "../../__tests__/helpers/fixtures";
const scope={userId:ALICE,profileIds:[ALICE_PROFILE]};
const readEssay=(essayId:string)=>({content:null,calls:[{id:"1",name:"read_essay",arguments:JSON.stringify({essayId})}]});
it("a real scoped tool loop reaches deny-all without emitting candidate bytes",async()=>{
 const tools=makeReadTools(asDb(studentWorld()),scope);
 const provider=vi.fn<Provider>().mockResolvedValueOnce(readEssay(ALICE_ESSAY)).mockResolvedValueOnce({content:"UNSAFE",calls:[]});
 const emitted:Uint8Array[]=[];
 await expect(runAgent({message:"Critique",essayId:ALICE_ESSAY,locale:"en"},{provider,tools,check:denyAllCheck,signal:new AbortController().signal,priorReleased:[]}).then(result=>{emitted.push(encodeEvent(1,"text.delta",{text:result.text}));})).rejects.toThrow("output_check_failed");
 expect(emitted).toHaveLength(0);
 // The loop really ran the scoped tool and fed its reply back before the held-back candidate.
 expect(provider).toHaveBeenCalledTimes(2);
 const second=provider.mock.calls[1][0] as ChatMessage[];
 expect(second.some(m=>m.role==="tool"&&m.content?.includes("Alice wrote this."))).toBe(true);
});
it("a cross-student essay read is denied by the real tools and never reaches the model",async()=>{
 const tools=makeReadTools(asDb(studentWorld()),scope);
 const provider=vi.fn<Provider>().mockResolvedValueOnce(readEssay(BOB_ESSAY)).mockResolvedValueOnce({content:"Fine critique",calls:[]});
 const check:OutputCheck=async c=>({decision:"allow",result:{...c,policyVersion:"test-only"}});
 await runAgent({message:"Critique",essayId:BOB_ESSAY,locale:"en"},{provider,tools,check,signal:new AbortController().signal,priorReleased:[]});
 const second=JSON.stringify(provider.mock.calls[1][0]);
 expect(second).not.toContain("Bob wrote this.");
 expect(second).not.toContain("bob-secret-token");
});
it("an allowed checked result is released exactly as the checked candidate",async()=>{
 const tools=makeReadTools(asDb(studentWorld()),scope);
 const provider=vi.fn<Provider>().mockResolvedValueOnce(readEssay(ALICE_ESSAY)).mockResolvedValueOnce({content:"Which moment shaped you most?",calls:[]});
 const check:OutputCheck=async c=>({decision:"allow",result:{...c,policyVersion:"test-only"}});
 const result=await runAgent({message:"Critique",essayId:ALICE_ESSAY,locale:"en"},{provider,tools,check,signal:new AbortController().signal,priorReleased:[]});
 expect(result).toEqual({text:"Which moment shaped you most?",cards:[],policyVersion:"test-only"});
});
it("checked result framing survives every UTF-8 split point",async()=>{
 const payload={text:"اردو 🧭"},bytes=encodeEvent(1,"text.delta",payload);
 let splits=0,midCharacter=0;
 for(let split=1;split<bytes.length;split++) {
  splits++;
  // A continuation byte (10xxxxxx) at the split proves this boundary lands inside a multi-byte character.
  if((bytes[split]&0xc0)===0x80)midCharacter++;
  async function* chunks(){yield bytes.slice(0,split);yield bytes.slice(split);}
  const results=[];for await(const event of decodeEvents(chunks()))results.push(event);
  expect(results).toEqual([{seq:1,type:"text.delta",data:payload}]);
 }
 expect(splits).toBe(bytes.length-1);
 expect(midCharacter).toBeGreaterThan(0);
});
it("byte-at-a-time delivery of back-to-back events reconstructs both in order",async()=>{
 const a={text:"اردو 🧭"},b={text:"مشورہ 🎓"};
 const all=new Uint8Array([...encodeEvent(1,"text.delta",a),...encodeEvent(2,"text.delta",b)]);
 async function* chunks(){for(let i=0;i<all.length;i++)yield all.slice(i,i+1);}
 const results=[];for await(const event of decodeEvents(chunks()))results.push(event);
 expect(results).toEqual([{seq:1,type:"text.delta",data:a},{seq:2,type:"text.delta",data:b}]);
});
