// src/auth/service.ts
import type { FastifyInstance } from "fastify";
import argon2 from "argon2";
import * as repo from "./dal.js";
import { type UserPublicDTO, type SignupInputDTO, UserPublic, type LoginInputDto } from "./schemas/user-zod.js";

export class UsernameTakenError extends Error {
    constructor() { super("USERNAME_TAKEN"); }
}

export class UserNotExistError extends Error {
    constructor() { super("USERNAME_NOT_EXIST"); }
}

export class IncorrectPasswordError extends Error {
    constructor() { super("WRONG_PASSWORD"); }
}

export const signup = async (app: FastifyInstance, dto: SignupInputDTO): Promise<UserPublicDTO> => {
    const { username, name, email, password } = dto;

    const existing = await repo.findByUsername(app, username);
    if (existing) throw new UsernameTakenError();

    const passwordHash = await argon2.hash(password, { type: argon2.argon2id });

    const row = await repo.insertUser(app, { username, name, email, passwordHash });

    return UserPublic.parse(row);
}

export const login = async (app: FastifyInstance, dto: LoginInputDto): Promise<UserPublicDTO> => {
    const { username, password } = dto;

    const user = await repo.findByUsername(app, username);
    if (!user) throw new UserNotExistError();

    const valid = await argon2.verify(user.passwordHash, password);
    if (!valid)
        throw new IncorrectPasswordError();

    return UserPublic.parse({
        username: user.username,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
    });
}
