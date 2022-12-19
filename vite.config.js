import { defineConfig } from "@cyco130/vite";

export default defineConfig((env) => ({
  appType: "custom",
  experimental: {
    skipSsrTransform: true,
  },
  build: {
    rollupOptions: {
      input: env.ssrBuild
        ? { "entry-server": "entry-server.js" }
        : { "entry-client": "entry-client.js" },
    },
    manifest: !env.ssrBuild,
  },
  plugins: [
    {
      name: "vite-plugin-node-loader",
      apply: "serve",
      async configureServer(server) {
        // Make the server available globally
        global.__vite_dev_server__ = server;

        return () => {
          server.middlewares.use(async (req, res, next) => {
            // This eval is needed to prevent ESBuild to inline this import when bundling the config
            const entry = await (0, eval)(
              `import("./handler?vavite-entry")`
            ).then((m) => m.default);

            entry(req, res, next);
          });
        };
      },
      buildEnd() {
        // Remove the server from the global scope
        delete global.__vite_dev_server__;
      },
      config() {
        return {
          optimizeDeps: { include: [] },
        };
      },
    },
  ],
}));
