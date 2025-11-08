const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,

  devServer: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000', // URL de tu backend
        changeOrigin: true,
        // No reescribir el path, mantener /api en la URL
      },
    },
  },
});
