import { UnauthorizedError } from "@/error/httpErros.js";
import { env } from "@/schema/utils/env.schema.js";
import { SignTokenData } from "@/utils/jwt.js";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const SECRET = env.JWT_SECRET
    const token = req.cookies?.token;

    if (!token) {
        return res.status(401).json({ code: 401, message: "Sem token! Não autorizado." });
    }

    try {
        const decoded = jwt.verify(token, SECRET) as SignTokenData

        req.userId = decoded.id;
        req.userRole = decoded.role;

        next();
    } catch (error) {
        if(error instanceof jwt.TokenExpiredError) {
            throw new UnauthorizedError("Token expirado");
        }

        throw new UnauthorizedError("Error ao autenticar")
    }
}
