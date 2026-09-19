import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/** Dev only: serve /insurance and /before-after like production does (Vercel cleanUrls). */
function cleanUrls(): Plugin {
  return {
    name: 'clean-urls',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const path = req.url?.split('?')[0]
        if (path === '/insurance' || path === '/before-after') req.url = req.url!.replace(path, `${path}.html`)
        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react(), tailwindcss(), cleanUrls()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    // The SSR build only produces the static-shell renderer (see src/shell); it needs no public assets.
    copyPublicDir: !isSsrBuild,
    rollupOptions: isSsrBuild
      ? undefined
      : { input: { main: fileURLToPath(new URL('./index.html', import.meta.url)), insurance: fileURLToPath(new URL('./insurance.html', import.meta.url)), beforeAfter: fileURLToPath(new URL('./before-after.html', import.meta.url)) } },
  },
}))
