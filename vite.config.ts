import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';
// import devtools from 'solid-devtools/vite';


const serveConfig = {
	strictPort: true,
	port: 8000,
	open: true,
}

export default defineConfig({
  plugins: [
    // https://github.com/thetarnav/solid-devtools/tree/main/packages/extension#readme
    // devtools(),
    solidPlugin(),
  ],
  server: serveConfig,
  preview: serveConfig,
  build: {
	// outDir: './build',
    target: 'esnext',
  },
});
