import Taro from '@tarojs/taro'
import { encryptRequest, decryptResponse, isCryptoEnabled, IEncryptResponse } from './crypto'

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
  // 是否启用加密传输（默认根据是否配置RSA公钥自动判断）
  enableCrypto?: boolean
}

/**
 * 判断是否需要加密传输
 * 加密传输条件：
 * 1. 明确设置 enableCrypto 为 true
 * 2. 或者未设置 enableCrypto，但已配置 RSA 公钥且为 POST/PUT 请求
 */
function shouldEncrypt(options: RequestOptions): boolean {
  // 如果明确设置了 enableCrypto，优先使用该设置
  if (options.enableCrypto !== undefined) {
    return options.enableCrypto
  }

  // 自动判断：已配置 RSA 公钥且为 POST/PUT 请求时启用加密
  const method = options.method || 'GET'
  return isCryptoEnabled() && (method === 'POST' || method === 'PUT')
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

  // 判断是否使用加密传输
  const useCrypto = shouldEncrypt(options)

  return new Promise<T>((resolve, reject) => {
    // 准备请求数据
    let requestData: any = data
    let requestHeader: Record<string, string> = {
      'Content-Type': 'application/json',
      ...header,
    }

    // 加密信息（用于响应解密）
    let cryptoInfo: { aesKey: string; iv: string } | null = null

    if (useCrypto && data) {
      try {
        // 加密请求数据
        const encrypted = encryptRequest(data)
        requestData = encrypted.requestBody
        cryptoInfo = encrypted.cryptoInfo

        // 添加加密标识头
        requestHeader['X-Encryption-Enabled'] = 'true'
      } catch (error) {
        console.error('请求加密失败:', error)
        if (!options.hideErrorToast) {
          Taro.showToast({
            icon: 'none',
            title: '请求加密失败',
          })
        }
        return reject(error)
      }
    }

    Taro.request({
      url: fullUrl,
      method,
      data: requestData,
      header: requestHeader,
      success: res => {
        // 判断响应是否加密
        const isEncryptedResponse =
          res.header?.['X-Encryption-Enabled'] === 'true' ||
          res.header?.['x-encryption-enabled'] === 'true'

        let responseData: IResponse<T>

        if (isEncryptedResponse && cryptoInfo) {
          // 解密响应数据
          try {
            const encryptedResponse = res.data as unknown as IEncryptResponse
            const decryptedData = decryptResponse<IResponse<T>>(
              encryptedResponse,
              cryptoInfo.aesKey,
              cryptoInfo.iv,
            )
            responseData = decryptedData
          } catch (error) {
            console.error('响应解密失败:', error)
            if (!options.hideErrorToast) {
              Taro.showToast({
                icon: 'none',
                title: '响应解密失败，数据可能被篡改',
              })
            }
            return reject(error)
          }
        } else {
          // 普通响应
          responseData = res.data as IResponse<T>
        }

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

/**
 * 加密 POST 请求（强制启用加密）
 * 适用于需要明确启用加密的场景
 */
export function httpSecurePost<T>(
  url: string,
  data?: Record<string, any>,
  query?: Record<string, any>,
  header?: Record<string, any>,
  options?: Partial<Omit<RequestOptions, 'enableCrypto'>>,
) {
  return http<T>({
    url,
    method: 'POST',
    data,
    query,
    header,
    enableCrypto: true,
    ...options,
  })
}

/**
 * 加密 PUT 请求（强制启用加密）
 * 适用于需要明确启用加密的场景
 */
export function httpSecurePut<T>(
  url: string,
  data?: Record<string, any>,
  query?: Record<string, any>,
  header?: Record<string, any>,
  options?: Partial<Omit<RequestOptions, 'enableCrypto'>>,
) {
  return http<T>({
    url,
    method: 'PUT',
    data,
    query,
    header,
    enableCrypto: true,
    ...options,
  })
}
