import { describe, it, expect, vi, beforeEach } from "vitest";

describe("credential-issuer env validation", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.unstubAllEnvs();
  });

  it("throws when ISSUER_PRIVATE_KEY is missing", async () => {
    vi.stubEnv("ISSUER_PRIVATE_KEY", "");
    const mod = await import("./credential-issuer");
    await expect(
      mod.issueDiploma({
        userId: "u1",
        diplomaId: "python-fundamentals",
        recipientAddress: "0x0000000000000000000000000000000000000001",
      }),
    ).rejects.toThrow(/ISSUER_PRIVATE_KEY/);
  });

  it("exports the deployed SBT registry address by default", async () => {
    const mod = await import("./credential-issuer");
    expect(mod.SBT_REGISTRY_ADDRESS.toLowerCase()).toBe(
      "0xdaa100ee3cbaaf192183b74eb5b9a42cbeeabe5d",
    );
  });
});
