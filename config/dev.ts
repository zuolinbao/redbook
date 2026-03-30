import type { UserConfigExport } from "@tarojs/cli"

export default {
mini: {},
  h5: {
    devServer: {
      proxy: {
        // /cmp-api 代理配置
        '/cmp-api': {
          target: 'http://10.251.23.207:30177',
          changeOrigin: true,
          pathRewrite: {
            '^/cmp-api': ''
          }
        }
      }
    }
  }
} satisfies UserConfigExport<'webpack5'>
