// src/lib/cc/agent/sse.ts
import type {Json} from "./contracts";
export interface SseEvent {seq:number;type:string;data:Json}
const encoder=new TextEncoder();
export function encodeEvent(seq:number,type:string,data:Json):Uint8Array {
 if(!Number.isSafeInteger(seq)||seq<1||!/^[a-zA-Z][a-zA-Z0-9._-]*$/.test(type))throw Error("invalid_sse_header");
 return encoder.encode("id: "+seq+"\nevent: "+type+"\ndata: "+JSON.stringify(data)+"\n\n");
}
export async function* decodeEvents(chunks:AsyncIterable<Uint8Array>):AsyncGenerator<SseEvent>{
 const decoder=new TextDecoder("utf-8",{fatal:true});let buffer="";
 for await(const chunk of chunks){
  buffer+=decoder.decode(chunk,{stream:true});
  let boundary:number;
  while((boundary=buffer.indexOf("\n\n"))>=0){
   const frame=buffer.slice(0,boundary);buffer=buffer.slice(boundary+2);
   if(frame.split("\n").every(line=>line.startsWith(":")))continue; // Comment-only heartbeat frames carry no event.
   const match=/^id: ([1-9][0-9]*)\nevent: ([a-zA-Z][a-zA-Z0-9._-]*)\ndata: ([^\n]+)$/.exec(frame);
   if(!match||!Number.isSafeInteger(Number(match[1])))throw Error("malformed_sse_frame");
   let data:Json;try{data=JSON.parse(match[3]) as Json;}catch{throw Error("malformed_sse_data");}
   yield {seq:Number(match[1]),type:match[2],data};
  }
 }
 buffer+=decoder.decode();
 if(buffer.length)throw Error("trailing_sse_frame");
}
