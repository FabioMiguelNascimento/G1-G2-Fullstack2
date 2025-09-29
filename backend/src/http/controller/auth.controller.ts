import { ConflictError, NotFoundError } from "@/error/httpErros.js";
import AuthRepository from "@/http/repository/auth.repo.js";
import { LoginInput, RegisterInput } from "@/schema/auth.schema.js";
import { decodePassword, encodePassword } from "@/utils/bcrypt.js";
import { signRefreshToken, signToken } from "@/utils/jwt.js";
import { NextFunction, Request, Response } from "express";
import AuthResponse from "../views/auth.view.js";

const repo = new AuthRepository()
export default class AuthController{
    register = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let userInput: RegisterInput = req.validatedData

            const existingUser = await repo.findUserByEmail(userInput.email)

            if (existingUser) {
                throw new ConflictError("Usuario ja cadastrado com esse email, que tal fazer login?")
            }   

            const hashedPassword = encodePassword(userInput.password)

            userInput = {...userInput, password: hashedPassword}

            let newUser = await repo.register(userInput)

            res.status(200).json( new AuthResponse().register(newUser) )
        } catch (err) {
            next(err)
        }
    }

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            let userInput: LoginInput = req.validatedData

            const user = await repo.findUserByEmail(userInput.email)

            if(!user) {
                throw new NotFoundError("Email ou senha incorreto")
            }

            const decodedPassword = decodePassword(user?.password, userInput.password) 

            if(userInput.email !== user.email) {
                throw new NotFoundError("Email ou senha incorreto")
            }

            if(!decodedPassword) {
                throw new NotFoundError("Email ou senha incorreto")
            }

            const tokenPayload = { id: user.id, role: user.role }
            const accessToken = signToken(tokenPayload)
            const refreshToken = signRefreshToken({ id: user.id })

            await repo.updateRefreshToken(user.id, refreshToken)

            res.cookie('token', accessToken, { 
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production', 
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000
            });
            
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });
            
            res.status(200).json(new AuthResponse().login(user));
        } catch (err) {
            next(err)
        }
    }

    refresh = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const refreshToken = req.cookies?.refreshToken;

            if (!refreshToken) {
                throw new NotFoundError("Refresh token não encontrado")
            }

            const user = await repo.findUserByRefreshToken(refreshToken)
            if (!user) {
                throw new NotFoundError("Refresh token inválido")
            }

            const tokenPayload = { id: user.id, role: user.role }
            const newAccessToken = signToken(tokenPayload)
            const newRefreshToken = signRefreshToken({ id: user.id })

            await repo.updateRefreshToken(user.id, newRefreshToken)

            res.cookie('token', newAccessToken, { 
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production', 
                sameSite: 'strict',
                maxAge: 15 * 60 * 1000
            });
            
            res.cookie('refreshToken', newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000
            });

            res.status(200).json({ message: "Tokens renovados com sucesso" });
        } catch (err) {
            next(err)
        }
    }

    logout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const refreshToken = req.cookies?.refreshToken;

            if (refreshToken) {
                await repo.updateRefreshToken(req.userId!, null)
            }

            res.clearCookie('token');
            res.clearCookie('refreshToken');

            res.status(200).json({ message: "Logout realizado com sucesso" });
        } catch (err) {
            next(err)
        }
    }
}