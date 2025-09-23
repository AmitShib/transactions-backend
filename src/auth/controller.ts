import type { FastifyReply, FastifyRequest } from "fastify";
import type { LoginInputDto, SignupInputDTO } from "./schemas/user-zod.js";
import { IncorrectPasswordError, login, signup, UsernameTakenError, UserNotExistError } from "./service.js";

export const signupController = async (
    req: FastifyRequest<{ Body: SignupInputDTO }>,
    reply: FastifyReply
): Promise<FastifyReply> => {
    try {
        const user = await signup(req.server, req.body);
        return reply.code(201).send(user);
    } catch (err) {
        if (err instanceof UsernameTakenError) {
            return reply.code(409).send({ error: "username_taken" });
        }
        req.log.error({ err }, "signup failed");
        return reply.code(500).send({ error: "internal_error" });
    }
}

export const loginController = async (
    req: FastifyRequest<{ Params: LoginInputDto }>,
    reply: FastifyReply): Promise<FastifyReply> => {
    try {
        const user = await login(req.server, req.params);
        return reply.code(200).send("OK");
    } catch (err) {
        if (err instanceof UserNotExistError)
            return reply.code(404).send({ error: "user do not exist" });
        if (err instanceof IncorrectPasswordError)
            return reply.code(401).send({ error: "incorrect password" });
        return reply.code(500).send({ error: "internal_error" });
    }
}

