"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogUpdateSchema = exports.BlogSchema = exports.UserSigninSchema = exports.UserSignupSchema = void 0;
const zod_1 = require("zod");
exports.UserSignupSchema = zod_1.z.object({
    username: zod_1.z.string(),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
exports.UserSigninSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
exports.BlogSchema = zod_1.z.object({
    title: zod_1.z.string(),
    content: zod_1.z.string(),
});
exports.BlogUpdateSchema = zod_1.z.object({
    title: zod_1.z.string(),
    content: zod_1.z.string(),
    id: zod_1.z.string() || zod_1.z.number()
});
