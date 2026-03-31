import { defineConfig, type UserConfigExport } from '@tarojs/cli'

import devConfig from './dev'
import prodConfig from './prod'

export default defineConfig<'webpack5'>(async (merge, { command, mode }) => {
  const baseConfig: UserConfigExport<'webpack5'> = {
    projectName: 'redbook',
    date: '2026-3-11',
    designWidth: 750,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      375: 2,
      828: 1.81 / 2
    },
    sourceRoot: 'src',
    outputRoot: 'dist',
    framework: 'react',
    compiler: 'webpack5',
    cache: {
      enable: false
    },
    plugins: ['@tarojs/plugin-generator'],
    defineConstants: {
      'process.env.TARO_ENV': JSON.stringify(process.env.TARO_ENV || ''),
      'process.env.TARO_APP_API_BASE_URL': JSON.stringify(process.env.TARO_APP_API_BASE_URL || ''),
      'process.env.TARO_APP_WEAPP_API_BASE_URL': JSON.stringify(process.env.TARO_APP_WEAPP_API_BASE_URL || ''),
      'process.env.TARO_APP_H5_PROXY_PREFIX': JSON.stringify(process.env.TARO_APP_H5_PROXY_PREFIX || '/cmp-api'),
    },
    copy: {
      patterns: [],
      options: {}
    },
    mini: {
      postcss: {
        pxtransform: {
          enable: true,
          config: {}
        },
        cssModules: {
          enable: true,
          config: {
            namingPattern: 'module',
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      }
    },
    h5: {
      devServer: {
        port: 9000
      },
      publicPath: '/',
      staticDirectory: 'static',
      miniCssExtractPluginOption: {
        ignoreOrder: true,
        filename: 'css/[name].[hash].css',
        chunkFilename: 'css/[name].[chunkhash].css'
      },
      postcss: {
        autoprefixer: {
          enable: true,
          config: {}
        },
        cssModules: {
          enable: true,
          config: {
            namingPattern: 'module',
            generateScopedName: '[name]__[local]___[hash:base64:5]'
          }
        }
      }
    },
    rn: {
      appName: 'taroDemo',
      postcss: {
        cssModules: {
          enable: false
        }
      }
    }
  }

  if (process.env.NODE_ENV === 'development') {
    return merge({}, baseConfig, devConfig)
  }
  return merge({}, baseConfig, prodConfig)
})
