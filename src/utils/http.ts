import Taro from '@tarojs/taro'

// API 基础地址 - 从环境变量中获取
const getBaseUrl = () => {
  const isH5 = process.env.TARO_ENV === 'h5'
  const isWeapp = process.env.TARO_ENV === 'weapp'
  const h5ProxyPrefix = process.env.TARO_APP_H5_PROXY_PREFIX || '/cmp-api'

  // H5 环境使用代理前缀
  if (isH5) {
    return h5ProxyPrefix
  }

  // 微信小程序环境：开发使用测试地址，打包使用生产地址
  if (isWeapp) {
    return process.env.TARO_APP_WEAPP_API_BASE_URL || ''
  }

  // 其他平台使用通用地址
  return process.env.TARO_APP_API_BASE_URL || ''
}

const BASE_URL = getBaseUrl()

// 响应类型接口
export interface IResponse<T> {
  code: number
  data: T
  msg?: string
  message?: string
}

// 请求选项接口
export interface RequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: Record<string, any>
  query?: Record<string, any>
  header?: Record<string, any>
  hideErrorToast?: boolean
}

/**
 * HTTP 请求核心函数
 */
export function http<T>(options: RequestOptions): Promise<T> {
  const { url, method = 'GET', data, query, header = {} } = options

  // 构建完整 URL
  let fullUrl = BASE_URL + url

  // 添加 query 参数
  if (query) {
    const queryString = Object.entries(query)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join('&')
    fullUrl += (fullUrl.includes('?') ? '&' : '?') + queryString
  }

  return new Promise<T>((resolve, reject) => {
    Taro.request({
      url: fullUrl,
      method,
      data,
      header: {
        'Content-Type': 'application/json',
        ...header,
      },
      success: res => {
        const responseData = res.data as IResponse<T>
        const { code, data: responseDataData, msg, message } = responseData

        // 处理成功响应
        if (res.statusCode >= 200 && res.statusCode < 300) {
          // 业务逻辑成功
          if (code === 0 || code === 200) {
            return resolve(responseDataData)
          }
          // 业务逻辑错误
          if (!options.hideErrorToast) {
            Taro.showToast({
              icon: 'none',
              title: msg || message || '请求错误',
            })
          }
          return reject(responseData)
        }

        // HTTP 错误
        if (!options.hideErrorToast) {
          Taro.showToast({
            icon: 'none',
            title: msg || message || `请求错误 (${res.statusCode})`,
          })
        }
        reject(responseData)
      },
      fail: err => {
        console.error('请求失败:', err)
        if (!options.hideErrorToast) {
          Taro.showToast({
            icon: 'none',
            title: '网络错误，请检查网络连接',
          })
        }
        reject(err)
      },
    })
  })
}

/**
 * GET 请求
 */
export function httpGet<T>(
  url: string,
  query?: Record<string, any>,
  header?: Record<string, any>,
  options?: Partial<RequestOptions>,
) {
  return http<T>({
    url,
    method: 'GET',
    query,
    header,
    ...options,
  })
}

/**
 * POST 请求
 */
export function httpPost<T>(
  url: string,
  data?: Record<string, any>,
  query?: Record<string, any>,
  header?: Record<string, any>,
  options?: Partial<RequestOptions>,
) {
  return http<T>({
    url,
    method: 'POST',
    data,
    query,
    header,
    ...options,
  })
}

/**
 * PUT 请求
 */
export function httpPut<T>(
  url: string,
  data?: Record<string, any>,
  query?: Record<string, any>,
  header?: Record<string, any>,
  options?: Partial<RequestOptions>,
) {
  return http<T>({
    url,
    method: 'PUT',
    data,
    query,
    header,
    ...options,
  })
}

/**
 * DELETE 请求
 */
export function httpDelete<T>(
  url: string,
  query?: Record<string, any>,
  header?: Record<string, any>,
  options?: Partial<RequestOptions>,
) {
  return http<T>({
    url,
    method: 'DELETE',
    query,
    header,
    ...options,
  })
}
