import fp from "fastify-plugin";
import fastifyPostgres from "@fastify/postgres";

export default fp(async (app) => {
  const { DATABASE_URL, PG_SSL, PG_MAX_POOL_SIZE } = app.config;

  await app.register(fastifyPostgres, {
    connectionString: DATABASE_URL,
    ssl: PG_SSL === "true" ? { rejectUnauthorized: true } : undefined,
    max: PG_MAX_POOL_SIZE,
    statement_timeout: 15_000,
    query_timeout: 15_000,
  });

  // readiness check
  const { rows } = await app.pg.query("SELECT 1 as ok");
  if (rows?.[0]?.ok !== 1) throw new Error("DB readiness failed");

  app.addHook("onClose", async (instance) => {
    await instance.pg.pool.end();
  });
});
