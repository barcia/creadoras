import { serve } from "https://deno.land/std@0.87.0/http/server.ts";

const server = serve({ port: 3000 });

console.log("Servidor correndo en http://localhost:3000");

const body = await Deno.readTextFile("dist/api.json");
const headers = new Headers({
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-cache no-store must-revalidate",
});

for await (const req of server) {
  req.respond({ headers, body });
}
