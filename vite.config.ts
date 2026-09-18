import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/** Dev only: serve /insurance like production does (Vercel cleanUrls). */
function cleanUrls(): Plugin {
  return {
    name: 'clean-urls',
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        if (req.url?.split('?')[0] === '/insurance') req.url = req.url.replace('/insurance', '/insurance.html')
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
      : { input: { main: fileURLToPath(new URL('./index.html', import.meta.url)), insurance: fileURLToPath(new URL('./insurance.html', import.meta.url)) } },
  },
}))
