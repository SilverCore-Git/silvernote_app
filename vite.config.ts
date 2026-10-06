import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  plugins: [
    vue(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    watch: {
      // Évite que le watcher ne suive les worktrees d'agents créés sous .claude/
      // (leur création/suppression pendant que ce serveur tourne corrompait le
      // cache interne de Vite, causant des ENOENT sur des fichiers déjà supprimés).
      ignored: ['**/.claude/**'],
    },
  },
})
