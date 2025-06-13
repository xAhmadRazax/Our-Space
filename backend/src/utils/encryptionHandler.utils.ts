import crypto from "crypto";
import bcrypt from "bcryptjs";

export function cryptoEncryption(
  algo: "sha256" | "sha512",
  data: string
): string {
  return crypto.createHash(algo).update(data).digest("hex");
}

export async function bcryptEncryption(
  salt: number,
  data: string
): Promise<string> {
  return await bcrypt.hash(data, salt);
}

export async function bcryptCompareData(
  candidateToken: string,
  hashToken: string
) {
  return await bcrypt.compare(candidateToken, hashToken);
}
