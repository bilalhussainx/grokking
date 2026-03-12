import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

export interface UserSession {
  userId: string;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin";
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-dev-secret");

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signToken(payload: UserSession): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return {
      userId: payload.userId as string,
      name: payload.name as string,
      email: payload.email as string,
      role: payload.role as UserSession["role"],
    };
  } catch {
    return null;
  }
}
