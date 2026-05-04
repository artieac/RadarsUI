import { defineConfig, transformWithEsbuild } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Vite only processes JSX in .jsx/.tsx by default.
// This plugin extends that to plain .js files (the existing codebase uses .js).
const jsxInJsFiles = {
    name: 'treat-js-files-as-jsx',
    async transform(code, id) {
        if (!id.match(/src\/.*\.js$/)) return null
        return transformWithEsbuild(code, id, { loader: 'jsx' })
    },
}

// This plugin rewrites the URL based on the hostname so different apps load for different hosts.
const hostRouting = {
    name: 'host-routing',
    configureServer(server) {
        server.middlewares.use((req, res, next) => {
            const host = req.headers.host
            if (!host) return next()

            // Map subdomains to their respective HTML entry points
            if (req.url === '/' || req.url === '/index.html') {
                if (host.startsWith('manage.local.')) {
                    req.url = '/ManageRadars.html'
                } else if (host.startsWith('admin.local.')) {
                    req.url = '/AdminSite.html'
                } else if (host.startsWith('local.')) {
                    req.url = '/index.html'
                }
            }
            next()
        })
    },
}

export default defineConfig({
    plugins: [hostRouting, jsxInJsFiles, react()],
    optimizeDeps: {
        esbuildOptions: {
            loader: { '.js': 'jsx' },
        },
    },
    publicDir: 'src/static',
    envPrefix: 'REACT_APP_',
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        rollupOptions: {
            input: {
                main:   path.resolve(__dirname, 'index.html'),
                manage: path.resolve(__dirname, 'ManageRadars.html'),
                admin:  path.resolve(__dirname, 'AdminSite.html'),
            }
        }
    },
    resolve: {
        alias: {
            Apps:             path.resolve(__dirname, 'src/react/Apps'),
            SharedComponents: path.resolve(__dirname, 'src/react/components'),
            Components:       path.resolve(__dirname, 'src/react/components'),
            Repositories:     path.resolve(__dirname, 'src/react/Repositories'),
            Redux:            path.resolve(__dirname, 'src/react/redux'),
        }
    },
    server: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
        allowedHosts: [
            'local.radars.alwaysmoveforward.com',
            'local.api.radars.alwaysmoveforward.com',
            'local.manage.radars.alwaysmoveforward.com',
            'local.admin.radars.alwaysmoveforward.com'
        ],
        hmr: {
            overlay: true,
        },
        watch: {
            usePolling: true,
        },
        proxy: {
            '/api': 'http://localhost:8081',
        },
    },
})
