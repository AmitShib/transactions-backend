import fp from "fastify-plugin";
import { z } from "zod";
import "dotenv/config";

const EnvSchema = z.object({
    NODE_ENV: z.enum(["development", "production"]).default("development"),
    PORT: z.coerce.number().default(3000),
    DATABASE_URL: z.string(),
    PG_SSL: z.enum(["true", "false"]).default("false"),
    PG_MAX_POOL_SIZE: z.coerce.number().default(10),
});

export default fp(async (app) => {
    const { error, data } = EnvSchema.safeParse(process.env);
    if (error) {
        app.log.error(error.message);
        process.exit(1)
    }
    app.decorate("config", data);
});

declare module "fastify" {
    interface FastifyInstance {
        config: z.infer<typeof EnvSchema>;
    }
}