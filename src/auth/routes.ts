import type { FastifyPluginAsync } from "fastify";
import { loginController, signupController } from "./controller.js";
import { LoginInput, SignupInput, statusCodeOk, UserPublic } from "./schemas/user-zod.js";
import { z } from "zod";

export const ErrorResponse = z.object({
    error: z.string(),
});

export const errResponseObject = {
    400: ErrorResponse, 409: ErrorResponse, 500: ErrorResponse
}
/** Auth routes: register /auth/signup */
export const authRoutes: FastifyPluginAsync = async (app) => {
    app.post("/signup", {
        schema: {
            body: SignupInput,
            response: { 201: UserPublic, ...errResponseObject }
        }
    }, signupController);

    app.get("/login/:username/:password", {
        schema: {
            params: LoginInput,
            response: { 200: statusCodeOk, ...errResponseObject }
        }
    },loginController);
};