import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

// Clean any environment variable keys that contain trailing dots or invalid identifier characters
for (const key of Object.keys(process.env)) {
  if (key.startsWith('VITE_') && !/^VITE_[a-zA-Z0-9_]+$/.test(key)) {
    delete process.env[key];
  }
}

export default defineConfig(() => {
  return {
    define: {},
    plugins: [
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
