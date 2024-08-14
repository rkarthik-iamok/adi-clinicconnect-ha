import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react()],
    define: {
      "process.env": env,
    },
    resolve: {
      alias: {
        "react-router-dom": path.resolve(
          __dirname,
          "node_modules/react-router-dom"
        ),
      },
    },
    server: {
      port: process.env.PORT || 8000,
    },
    build: {
      chunkSizeWarningLimit: 1600,
      rollupOptions: {
        // always throw with build warnings
        onwarn(warning, warn) {
          warn(
            '\nBuild warning happened, customize "onwarn" callback in vite.config.js to handle this error.'
          );
          throw new Error(warning);
        },
      },
    },
  };
});
