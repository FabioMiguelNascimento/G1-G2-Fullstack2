import { ConflictError, NotFoundError } from "@/error/httpErros.js";
import AuthRepository from "@/http/repository/auth.repo.js";
import { LoginInput, RegisterInput } from "@/schema/auth.schema.js";
import { decodePassword, encodePassword } from "@/utils/bcrypt.js";
import { NextFunction, Request, Response } from "express";
import AuthResponse from "../views/auth.view.js";
import { signToken } from "@/utils/jwt.js";

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
            const token = signToken(tokenPayload)

            res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
            
            res.status(200).json(new AuthResponse().login(user));
        } catch (err) {
            next(err)
        }
    }
}