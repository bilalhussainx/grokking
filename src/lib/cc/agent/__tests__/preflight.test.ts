// @vitest-environment node
// src/lib/cc/agent/__tests__/preflight.test.ts
import {it,expect,vi} from "vitest";
import {checkLocalDatabaseTooling} from "../preflight";
it("requires only a reachable Docker engine",async()=>{
 const run=vi.fn().mockResolvedValue({stdout:"27.0.3",stderr:""});
 expect(await checkLocalDatabaseTooling(run)).toEqual({ok:true,dockerAvailable:true,dockerVersion:"27.0.3"});
 expect(run).toHaveBeenCalledTimes(1);
 expect(run).toHaveBeenCalledWith("docker",["info","--format","{{.ServerVersion}}"]);
});
it("stops on missing or stopped Docker",async()=>{
 const result=await checkLocalDatabaseTooling(async()=>{throw Error("engine stopped");});
 expect(result.ok).toBe(false);expect(result.stopReason).toContain("founder");
});
