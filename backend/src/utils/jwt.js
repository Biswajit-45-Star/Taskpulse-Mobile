import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || process.env.JWT_SECRET;
const ACCESS_TOKEN_EXPIRE_MINUTES = Number(
  process.env.JWT_ACCESS_TOKEN_EXPIRE_MINUTES ?? 15
);
const REFRESH_TOKEN_EXPIRE_DAYS = Number(
  process.env.JWT_REFRESH_TOKEN_EXPIRE_DAYS ?? 7
);
const REFRESH_TOKEN_HASH_ROUNDS = Number(
  process.env.REFRESH_TOKEN_HASH_ROUNDS ?? 10
);

if (!JWT_SECRET_KEY) {
  throw new Error(
    "Missing JWT_SECRET_KEY or JWT_SECRET environment variable"
  );
}

export const signAccessToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET_KEY, {
    expiresIn: `${ACCESS_TOKEN_EXPIRE_MINUTES}m`,
  });
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, JWT_SECRET_KEY);
};

export const createRefreshTokenHash = async () => {
  const plainToken = crypto.randomBytes(64).toString("hex");
  const tokenHash = await bcrypt.hash(plainToken, REFRESH_TOKEN_HASH_ROUNDS);

  return { plainToken, tokenHash };
};

export const verifyRefreshTokenHash = async (plainToken, tokenHash) => {
  return bcrypt.compare(plainToken, tokenHash);
};

export const getRefreshTokenExpiry = () => {
  return new Date(
    Date.now() + REFRESH_TOKEN_EXPIRE_DAYS * 24 * 60 * 60 * 1000
  );
};
