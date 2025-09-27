import cookieParser from "cookie-parser";
import cors from 'cors';
import express, { json } from 'express';
import { errorHandler, requestNotFound } from './error/errorHandler.js';
import authRoute from './http/route/auth.route.js';
import productRoute from './http/route/product.route.js';
import userRoute from './http/route/user.route.js';
import { env } from './schema/utils/env.schema.js';

const PORT = env.PORT
const app = express()

app.use(json())
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use('/api/auth', authRoute)
app.use('/api/user', userRoute)
app.use('/api/product', productRoute)

app.use(errorHandler);
app.use(requestNotFound);

app.listen(PORT, () => {
    console.log('Servidor escutando na porta ', PORT)
})