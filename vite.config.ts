import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",       // Listen on all IPs (IPv6/IPv4)
    port: 8080,       // Your specified port
    allowedHosts: [
      "ebsg6jkwec4tncwq75tyvl6nthvlb4cjpvpoew4zh4pf7groxsh6qlqd.onion", // Your .onion domain
    ],
    // Optional: Enable HTTPS if you have a .onion SSL cert
    // https: {
    //   key: "./private-key.pem",
    //   cert: "./certificate.pem",
    // },
  },
  plugins: [
    react(),
    mode === 'development',
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
