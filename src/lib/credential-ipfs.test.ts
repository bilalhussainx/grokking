import { describe, it, expect, beforeEach, vi } from "vitest";
import { pinDiplomaMetadata, pinJson } from "./credential-ipfs";

describe("credential-ipfs", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.stubEnv("PINATA_JWT", "");
  });

  it("pinJson throws when PINATA_JWT is missing", async () => {
    await expect(pinJson({ hello: "world" })).rejects.toThrow(/PINATA_JWT/);
  });

  it("pinDiplomaMetadata throws on empty name", async () => {
    vi.stubEnv("PINATA_JWT", "test-jwt");
    await expect(
      pinDiplomaMetadata({
        name: "",
        description: "x",
        image: "ipfs://x",
        attributes: [],
      }),
    ).rejects.toThrow(/name/i);
  });
});
