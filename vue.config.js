const { defineConfig } = require('@vue/cli-service')
const path = require('path')
const webpack = require('webpack')
const CompressionPlugin = require('compression-webpack-plugin')
const zlib = require('zlib')

// Determine if we're deploying to GitHub Pages
const isGitHubPages = process.env.DEPLOY_ENV === 'GH_PAGES'

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    allowedHosts: 'all',
    client: {
      webSocketURL: 'auto://0.0.0.0:0/ws'
    }
  },
  css: {
    loaderOptions: {
      sass: {
        additionalData: `@import "@/styles/variables.scss";`
      }
    },
    extract: true
  },
  configureWebpack: {
    // Always use demo entry point for local serving and testing
    entry: process.env.NODE_ENV === 'production' && !process.env.DEMO_BUILD
      ? './src/components/ChatWidget/index.vue'
      : './demo/src/main.js',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    output: {
      filename: 'js/[name].[contenthash].js',
      chunkFilename: 'js/[name].[contenthash].js',
      // Important: This makes the build work as a library that can be loaded into any page
      libraryTarget: 'umd',
      library: 'SophosicChat'
    },
    plugins: [
      new webpack.DefinePlugin({
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
        __VUE_OPTIONS_API__: JSON.stringify(true),
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
          BASE_URL: JSON.stringify(process.env.BASE_URL || '/'),
          VUE_APP_API_URL: JSON.stringify(process.env.VUE_APP_API_URL)
        }
      }),
      ...(process.env.NODE_ENV === 'production' ? [
        new CompressionPlugin({
          filename: '[path][base].br',
          algorithm: 'brotliCompress',
          test: /\.(js|css|html|svg)$/,
          compressionOptions: {
            params: {
              [zlib.constants.BROTLI_PARAM_QUALITY]: 11,
            },
          },
          threshold: 10240,
          minRatio: 0.8,
          deleteOriginalAssets: false,
        }),
        new CompressionPlugin({
          filename: '[path][base].gz',
          algorithm: 'gzip',
          test: /\.(js|css|html|svg)$/,
          threshold: 10240,
          minRatio: 0.8,
          deleteOriginalAssets: false,
        })
      ] : [])
    ]
  },
  // Only use /sophia-web/ path when deploying to GitHub Pages
  publicPath: isGitHubPages 
    ? '/sophia-web/'  // Updated to match your repository name
    : '/',
  css: {
    extract: true
  }
})
