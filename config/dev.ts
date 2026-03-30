import type { UserConfigExport } from "@tarojs/cli"

// 从环境变量中获取 API 基础地址
const API_BASE_URL = process.env.TARO_APP_API_BASE_URL || 'http://10.251.23.207:30177'

export default {
  mini: {},
  h5: {
    devServer: {
      proxy: {
        // /cmp-api 代理配置
        '/cmp-api': {
          target: API_BASE_URL,
          changeOrigin: true,
          pathRewrite: {
            '^/cmp-api': '/cmp-api'
          }
        }
      }
    }
  }
} satisfies UserConfigExport<'webpack5'>
