import { env } from "@/schema/utils/env.schema.js";
import { UserRole } from "@prisma/client";
import jwt from "jsonwebtoken";

export interface SignTokenData {
    id: string,
    role: UserRole
}

export interface RefreshTokenData {
    id: string
}

export const signToken = (tokenPayload: SignTokenData) => {
  return jwt.sign(tokenPayload, env.JWT_SECRET , {expiresIn: '15m'})
}

export const signRefreshToken = (tokenPayload: RefreshTokenData) => {
  return jwt.sign(tokenPayload, env.JWT_REFRESH_SECRET, {expiresIn: '7d'})
}

export const verifyRefreshToken = (token: string): RefreshTokenData => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenData
}