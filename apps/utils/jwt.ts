import crypto from "crypto";
import { userToken } from "./types";

function signHS256(data: string) {
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  return crypto
    .createHmac("sha256", JWT_SECRET)
    .update(data)
    .digest("base64url");
}

export function generateAccessToken(id: string, email: string): string {
  const header = {
    alg: "HS256",
    typ: "JWT",
  };
  const encodedHeader = Buffer.from(JSON.stringify(header)).toString(
    "base64url"
  );
  const iat = Math.floor(Date.now() / 1000);
  const claim = {
    sub: id,
    email,
    iat,
    exp: iat + 9000,
  };
  const encodedClaim = Buffer.from(JSON.stringify(claim)).toString("base64url");
  const signature = signHS256(encodedHeader + "." + encodedClaim);
  return `${encodedHeader}.${encodedClaim}.${signature}`;
}

export function verifyAccessToken(token: string): userToken {
  const [header, payload, signature] = token.split(".");
  if (signHS256(header + "." + payload) != signature)
    throw new Error("Invalid token");
  const claim: userToken = JSON.parse(
    Buffer.from(payload, "base64url").toString()
  );
  if (claim["exp"] < Math.floor(Date.now() / 1000))
    throw new Error("Token expired");
  return claim;
}
