import { UnauthorizedError } from "@/error/httpErros.js";
import AuthRepository from "@/http/repository/auth.repo.js";
import { env } from "@/schema/utils/env.schema.js";
import { SignTokenData, signToken, verifyRefreshToken } from "@/utils/jwt.js";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const repo = new AuthRepository();

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const SECRET = env.JWT_SECRET
    const token = req.cookies?.token;
    const refreshToken = req.cookies?.refreshToken;

    if (!token) {
        return res.status(401).json({ code: 401, message: "Sem token! Não autorizado." });
    }

    try {
        const decoded = jwt.verify(token, SECRET) as SignTokenData

        req.userId = decoded.id;
        req.userRole = decoded.role;

        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError && refreshToken) {
            try {
                const refreshDecoded = verifyRefreshToken(refreshToken);
                
                const user = await repo.findUserByRefreshToken(refreshToken);

                if (!user || user.id !== refreshDecoded.id) {
                    throw new UnauthorizedError("Refresh token inválido");
                }

                const tokenPayload = { id: user.id, role: user.role }
                const newAccessToken = signToken(tokenPayload)

                res.cookie('token', newAccessToken, { 
                    httpOnly: true, 
                    secure: process.env.NODE_ENV === 'production', 
                    sameSite: 'strict',
                    maxAge: 15 * 60 * 1000
                });

                req.userId = user.id;
                req.userRole = user.role;

                next();
            } catch (refreshError) {
                throw new UnauthorizedError("Token expirado e refresh falhou");
            }
        } else {
            if(error instanceof jwt.TokenExpiredError) {
                throw new UnauthorizedError("Token expirado");
            }
            throw new UnauthorizedError("Error ao autenticar")
        }
    }
}
