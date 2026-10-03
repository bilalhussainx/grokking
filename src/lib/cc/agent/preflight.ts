// src/lib/cc/agent/preflight.ts
import {execFile} from "node:child_process";
import {promisify} from "node:util";
const execFileAsync=promisify(execFile);
export interface PreflightCheckResult {ok:boolean;dockerAvailable:boolean;dockerVersion:string|null;stopReason?:string}
export async function checkLocalDatabaseTooling(execFileCmd?:(file:string,args:readonly string[])=>Promise<{stdout:string;stderr:string}>):Promise<PreflightCheckResult>{
 const runner=execFileCmd??(async(file:string,args:readonly string[])=>{const r=await execFileAsync(file,[...args],{timeout:10000});return{stdout:r.stdout.toString(),stderr:r.stderr.toString()};});
 try {
  const r=await runner("docker",["info","--format","{{.ServerVersion}}"]);
  if(!r.stdout.trim())throw Error("engine_unavailable");
  return {ok:true,dockerAvailable:true,dockerVersion:r.stdout.trim()};
 }catch{return{ok:false,dockerAvailable:false,dockerVersion:null,stopReason:"Docker engine unavailable: stop for founder to start Docker. No production fallback."};}
}
