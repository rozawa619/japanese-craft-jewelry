import { defineConfig } from 'astro/config';
try { process.loadEnvFile('.env'); } catch (error) { if (error.code !== 'ENOENT') throw error; }
export default defineConfig({
  site:process.env.PUBLIC_SITE_URL||undefined,
  base:process.env.PUBLIC_BASE_PATH||'/',
  trailingSlash:'always', output:'static', devToolbar:{enabled:false}, build:{format:'directory'},
  markdown: { syntaxHighlight: false },
  security: {
    csp: {
      directives: ["default-src 'self'", "object-src 'none'", "base-uri 'none'", "form-action 'none'", "frame-src https://www.google.com", "connect-src 'none'", "img-src 'self' data:", "font-src 'self'"],
    },
  },
});
