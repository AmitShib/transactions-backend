import { buildApp } from "./app.js";

export const startServer = async () => {
    const app = await buildApp();
    await app.listen({ port: 3000 });
}

startServer().catch((err) => {
    console.error("ERR IN START SERVER", err);
    process.exit(1);
});