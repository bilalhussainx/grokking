// scripts/agent-compatibility-probe.ts
import {mkdir,writeFile} from "node:fs/promises";
import {fetchProbePricing,prepareProbe,runPreparedProbe} from "../src/lib/cc/agent/probe";
async function main(){
 // Node loads ONLY the founder-created .env.agent-probe; never import dotenv or .env.local.
 const env=await fetchProbePricing(process.env);
 const prepared=prepareProbe(["routine","planner","check","escalation"],env);
 const directory="docs/evidence/agent/a1";await mkdir(directory,{recursive:true});
 // Missing key/model/catalog prices/budget fail BEFORE consuming this one-run fence.
 await writeFile(directory+"/probe-admitted.json",JSON.stringify({startedAt:new Date().toISOString(),maximumUsd:0.05,reservedUpperUsd:prepared.totalUpper}),{flag:"wx"});
 const report=await runPreparedProbe(prepared);
 await writeFile(directory+"/compatibility.json",JSON.stringify({...report,pricing:JSON.parse(env.OPENROUTER_AGENT_PRICING_JSON!)},null,2),{flag:"wx"});
 console.log(JSON.stringify({report:directory+"/compatibility.json",allPassed:report.allPassed,reservedUpperUsd:report.totalReservedUsd,receiptUsd:report.totalReceiptUsd}));
 if(!report.allPassed)process.exitCode=1;
}
main().catch(()=>{console.error("Probe stopped; inspect the safe report/run fence. No automatic retry is authorized.");process.exitCode=1;});
