import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';
import {defineConfig} from 'vite';

// __dirname no existe de forma fiable al cargar la config como módulo ESM,
// así que lo derivamos del URL del propio archivo.
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(() => {
  return {
    // Ruta base para GitHub Pages: el sitio se publica en
    // https://<usuario>.github.io/tribu/ (el nombre del repositorio es "tribu").
    // Si renombras el repositorio, cambia aquí el valor.
    base: '/tribu/',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
