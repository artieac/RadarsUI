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

export default defineConfig({
    plugins: [jsxInJsFiles, react()],
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
        hmr: {
            overlay: true,
        },
        watch: {
            usePolling: true,
        },
        proxy: {
            '/api': 'http://localhost:5093',
        },
    },
})
