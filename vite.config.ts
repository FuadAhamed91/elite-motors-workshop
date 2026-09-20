import { fileURLToPath, URL } from 'node:url'
import { defineConfig, type Plugin } from 'vite'
import preact from '@preact/preset-vite'
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
// The app is written against the React API but runs on Preact (preact/compat)
// — about 190 KB less JavaScript for a phone to download and run on first visit.
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [preact({ reactAliasesEnabled: true }), tailwindcss(), cleanUrls()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // The build-time shell renderer
      'react-dom/server': 'preact-render-to-string',
    },
  },
  // Bundle everything into the shell renderer so the React → Preact aliases apply there too.
  ssr: { noExternal: true },
  build: {
    // The SSR build only produces the static-shell renderer (see src/shell); it needs no public assets.
    copyPublicDir: !isSsrBuild,
    rollupOptions: isSsrBuild
      ? undefined
      : { input: { main: fileURLToPath(new URL('./index.html', import.meta.url)), insurance: fileURLToPath(new URL('./insurance.html', import.meta.url)), beforeAfter: fileURLToPath(new URL('./before-after.html', import.meta.url)) } },
  },
}))
