const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  
  // Configurar feature flags de Vue
  configureWebpack: {
    plugins: [
      new (require('webpack')).DefinePlugin({
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: 'false',
        __VUE_OPTIONS_API__: 'true',
        __VUE_PROD_DEVTOOLS__: 'false'
      })
    ]
  },
  
  // Configuración de desarrollo
  devServer: {
    port: 8080,
    proxy: {
      // Proxy para la API del backend
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        logLevel: 'debug'
      }
    }
  },

  // Configuración de producción
  publicPath: process.env.NODE_ENV === 'production' ? '/proyectoxample/' : '/',
  
  // Configuración de PWA (opcional)
  pwa: {
    name: 'Sistema de Gestión de Documentos',
    themeColor: '#409EFF',
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    
    workboxOptions: {
      skipWaiting: true
    }
  },

  // Optimizaciones de build
  configureWebpack: {
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
          elementPlus: {
            test: /[\\/]node_modules[\\/]element-plus[\\/]/,
            name: 'element-plus',
            chunks: 'all',
          }
        }
      }
    }
  },

  // Configuración de CSS
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "@/assets/styles/variables.scss";`
      }
    }
  }
})