import pinataSDK from "@pinata/sdk";

export interface DiplomaMetadata {
  name: string;
  description: string;
  image: string;
  external_url?: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  properties?: Record<string, unknown>;
}

export interface PinResult {
  cid: string;
  uri: string;
  gatewayUrl: string;
}

function normalizeGatewayHost(raw: string | undefined): string {
  const fallback = "gateway.pinata.cloud";
  if (!raw) return fallback;
  let host = raw.trim();
  if (!host) return fallback;
  host = host.replace(/^https?:\/\//i, "");
  host = host.replace(/\/+$/, "");
  return host || fallback;
}

type PinataClient = {
  pinJSONToIPFS: (
    body: unknown,
    options?: { pinataMetadata?: { name?: string } },
  ) => Promise<{ IpfsHash: string; PinSize: number; Timestamp: string }>;
};

function getPinataClient(): PinataClient {
  const jwt = process.env.PINATA_JWT;
  if (!jwt) {
    throw new Error("PINATA_JWT missing");
  }
  // @pinata/sdk v2 exports a class; must be instantiated with `new`.
  const PinataCtor = pinataSDK as unknown as new (opts: {
    pinataJWTKey: string;
  }) => PinataClient;
  return new PinataCtor({ pinataJWTKey: jwt });
}

export async function pinJson(
  json: unknown,
  filename?: string,
): Promise<PinResult> {
  const client = getPinataClient();
  const result = await client.pinJSONToIPFS(json, {
    pinataMetadata: { name: filename ?? "diploma.json" },
  });

  const cid = result.IpfsHash;
  const gateway = normalizeGatewayHost(process.env.PINATA_GATEWAY);
  return {
    cid,
    uri: `ipfs://${cid}`,
    gatewayUrl: `https://${gateway}/ipfs/${cid}`,
  };
}

export async function pinDiplomaMetadata(
  metadata: DiplomaMetadata,
  filename?: string,
): Promise<PinResult> {
  if (typeof metadata.name !== "string" || metadata.name.trim() === "") {
    throw new Error("DiplomaMetadata.name must be a non-empty string");
  }
  if (
    typeof metadata.description !== "string" ||
    metadata.description.trim() === ""
  ) {
    throw new Error("DiplomaMetadata.description must be a non-empty string");
  }
  if (typeof metadata.image !== "string" || metadata.image.trim() === "") {
    throw new Error("DiplomaMetadata.image must be a non-empty string");
  }
  return pinJson(metadata, filename ?? `${metadata.name}.json`);
}
