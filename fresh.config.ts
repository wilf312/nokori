import { defineConfig } from "$fresh/server.ts";
import tailwind from "$fresh/plugins/tailwind.ts";

const port = Number.parseInt(Deno.env.get("PORT") || "13333");

export default defineConfig({
  plugins: [tailwind()],
  server: {
    port: port
  }
});
