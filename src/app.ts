import Fastify from "fastify";
import envPlugin from "./plugin/env.js";
import dbPlugin from "./plugin/db.js";
import { serializerCompiler, validatorCompiler } from 'fastify-type-provider-zod';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';


export const buildApp = async () => {
    const app = Fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();
    app.setValidatorCompiler(validatorCompiler);
    app.setSerializerCompiler(serializerCompiler);
    
    await app.register(envPlugin);
    await app.register(dbPlugin);

    app.get("/", (req, res) => {
        res.send("Hello World");
    });

    return app;
}