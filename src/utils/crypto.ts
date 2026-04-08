import CryptoJS from 'crypto-js'
import { JSEncrypt } from 'jsencrypt'

// RSA 公钥 - 应从环境变量或配置文件中获取
// 这是一个示例公钥，实际使用时需要替换为后端生成的真实公钥
const RSA_PUBLIC_KEY = process.env.TARO_APP_RSA_PUBLIC_KEY || ''

/**
 * 加密响应类型接口
 */
export interface IEncryptResponse {
  encryptData: string
  sign: string
}

/**
 * 加密请求体类型接口
 */
export interface IEncryptRequestBody {
  encryptData: string
  encryptKey: string
  timestamp: string
  nonce: string
  sign: string
}

/**
 * 加密信息类型接口
 */
export interface ICryptoInfo {
  aesKey: string
  iv: string
}

/**
 * 生成随机字符串
 * @param len 字符串长度
 * @returns 随机字符串
 */
function randomStr(len: number): string {
  const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  let res = ''
  for (let i = 0; i < len; i++) {
    res += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return res
}

/**
 * AES-256-CBC 加密
 * @param data 明文数据
 * @param key AES 密钥 (32位)
 * @param iv 初始化向量 (16位)
 * @returns Base64 加密结果
 */
function aesEncrypt(data: string, key: string, iv: string): string {
  return CryptoJS.AES.encrypt(data, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString()
}

/**
 * AES-256-CBC 解密
 * @param encryptData Base64 加密数据
 * @param key AES 密钥 (32位)
 * @param iv 初始化向量 (16位)
 * @returns 明文结果
 */
function aesDecrypt(encryptData: string, key: string, iv: string): string {
  const bytes = CryptoJS.AES.decrypt(encryptData, CryptoJS.enc.Utf8.parse(key), {
    iv: CryptoJS.enc.Utf8.parse(iv),
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  })
  return bytes.toString(CryptoJS.enc.Utf8)
}

/**
 * RSA 公钥加密
 * @param data 明文数据
 * @returns Base64 加密结果
 */
function rsaEncrypt(data: string): string {
  if (!RSA_PUBLIC_KEY) {
    throw new Error('RSA 公钥未配置')
  }
  const encrypt = new JSEncrypt()
  encrypt.setPublicKey(RSA_PUBLIC_KEY)
  const result = encrypt.encrypt(data)
  if (!result) {
    throw new Error('RSA 加密失败')
  }
  return result
}

/**
 * SHA256 签名
 * @param data 待签名数据
 * @returns 签名结果
 */
function sha256(data: string): string {
  return CryptoJS.SHA256(data).toString(CryptoJS.enc.Hex)
}

/**
 * 请求加密入口
 * @param businessData 业务明文参数
 * @returns 加密请求体和加密信息
 */
export function encryptRequest<T extends Record<string, any>>(
  businessData: T,
): { requestBody: IEncryptRequestBody; cryptoInfo: ICryptoInfo } {
  // 1. 生成一次性参数
  const timestamp = Date.now().toString()
  const nonce = randomStr(16)
  const aesKey = randomStr(32)
  const iv = randomStr(16)

  // 2. 组装请求明文
  const plainData = JSON.stringify({
    business: businessData,
    timestamp,
    nonce,
  })

  // 3. AES 加密请求明文
  const encryptData = aesEncrypt(plainData, aesKey, iv)

  // 4. RSA 加密 AES 密钥 + IV
  const encryptKey = rsaEncrypt(`${aesKey}|${iv}`)

  // 5. 生成请求签名
  const signOrigin = `encryptData=${encryptData}&timestamp=${timestamp}&nonce=${nonce}`
  const sign = sha256(signOrigin)

  return {
    requestBody: {
      encryptData,
      encryptKey,
      timestamp,
      nonce,
      sign,
    },
    cryptoInfo: {
      aesKey,
      iv,
    },
  }
}

/**
 * 响应解密 + 验签入口
 * @param encryptResponse 后端加密响应体
 * @param aesKey 本次请求的 AES 密钥
 * @param iv 本次请求的 IV
 * @returns 解密后的响应明文对象
 */
export function decryptResponse<T>(
  encryptResponse: IEncryptResponse,
  aesKey: string,
  iv: string,
): T {
  // 1. 先验签：防下行篡改
  const signOrigin = `encryptData=${encryptResponse.encryptData}`
  const calcSign = sha256(signOrigin)
  if (calcSign !== encryptResponse.sign) {
    throw new Error('响应签名校验失败，数据可能被篡改')
  }

  // 2. 再解密：复用 AES 密钥
  const plainText = aesDecrypt(encryptResponse.encryptData, aesKey, iv)
  return JSON.parse(plainText) as T
}

/**
 * 检查是否配置了 RSA 公钥
 * @returns 是否已配置
 */
export function isCryptoEnabled(): boolean {
  return !!RSA_PUBLIC_KEY
}
