import { defineConfig } from 'vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const frontendDirectory = path.dirname(
    fileURLToPath(import.meta.url)
);

export default defineConfig({
    publicDir: false,
    build: {
        lib: {
            entry: path.resolve(
                frontendDirectory,
                '../backend/pagesfunction/index.js'
            ),
            formats: ['es'],
            fileName: () => '_worker.js'
        },
        outDir: path.resolve(
            frontendDirectory,
            'public'
        ),
        emptyOutDir: false,
        rollupOptions: {
            output: {
                codeSplitting: false
            }
        }
    }
});
