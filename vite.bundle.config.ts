import path from 'path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const resolvePath = (str: string) => path.resolve(__dirname, str);

export default defineConfig({
    define: {
        global: 'window',
        'process.env': {},
    },
    css: {
        preprocessorOptions: {
            scss: {
                api: 'modern-compiler',
            },
        },
    },
    plugins: [react(), dts({ tsconfigPath: resolvePath('./tsconfig.build.json') })],
    build: {
        outDir: 'bundle',
        lib: {
            entry: resolvePath('packages/popup.tsx'),
            name: 'EasydappPopup',
            fileName: (format) => `easydapp-popup.${format}.js`,
            formats: ['umd'],
        },
        rollupOptions: {
            external: [],
        },
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,
                drop_debugger: true,
            },
        },
    },
});
