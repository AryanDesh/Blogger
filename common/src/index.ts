import { z } from 'zod'

export const UserSignupSchema = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
});

export const UserSigninSchema = z.object({
    username: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
});

export const BlogSchema = z.object({
    title: z.string(),
    content: z.string(),
});

export const BlogUpdateSchema = z.object({
    title: z.string(),
    content: z.string(),
    id : z.string() || z.number()
});

export type UserSignupData = z.infer<typeof UserSignupSchema>;
export type UserSigninData = z.infer<typeof UserSigninSchema>;
export type BlogData = z.infer<typeof BlogSchema>;
export type BlogUpdateData = z.infer<typeof BlogUpdateSchema>;