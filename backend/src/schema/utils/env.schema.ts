import z from 'zod';

const envSchema = z.object({
    PORT: z.string().nonoptional(),
    DATABASE_URL: z.string().nonoptional(),
    JWT_SECRET: z.string().nonoptional(),
    JWT_REFRESH_SECRET: z.string().nonoptional()
})

export const env = envSchema.parse(process.env)