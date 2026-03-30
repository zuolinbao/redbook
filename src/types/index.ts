export interface Post {
  id: string
  title: string
  content?: string
  cover: string
  images?: string[]
  avatar: string
  nickname: string
  userId: string
  likes: number
  comments: number
  collects: number
  isVideo?: boolean
  videoUrl?: string
  topic?: string
  location?: string
  createdAt: string
}

export interface User {
  id: string
  nickname: string
  avatar: string
  signature: string
  fans: number
  following: number
  likes: number
  isFollowing?: boolean
}

export interface Comment {
  id: string
  content: string
  userId: string
  nickname: string
  avatar: string
  likes: number
  createdAt: string
  replyTo?: string
}

export interface Message {
  id: string
  type: 'like' | 'comment' | 'follow' | 'system' | 'mention'
  title: string
  content: string
  avatar?: string
  nickname?: string
  createdAt: string
  isRead: boolean
}

export interface Topic {
  id: string
  title: string
  cover: string
  participants: number
  notes: number
}

// ==================== 登录相关类型 ====================

// 认证模式类型
export type AuthMode = 'single' | 'double'

// 单Token响应类型
export interface ISingleTokenRes {
  token: string
  expiresIn: number // 有效期(秒)
}

// 双Token响应类型
export interface IDoubleTokenRes {
  accessToken: string
  refreshToken: string
  accessExpiresIn: number // 访问令牌有效期(秒)
  refreshExpiresIn: number // 刷新令牌有效期(秒)
}

// 登录返回的信息
export type IAuthLoginRes = ISingleTokenRes | IDoubleTokenRes

// 登录表单
export interface ILoginForm {
  phone: string
  smsCode: string
}

// 用户信息
export interface IUserInfoRes {
  userId: number
  username: string
  nickname: string
  avatar?: string
  role?: string
  roles?: string[]
  [key: string]: any
}

// 认证存储数据结构
export interface AuthStorage {
  mode: AuthMode
  tokens: ISingleTokenRes | IDoubleTokenRes
  userInfo?: IUserInfoRes
  loginTime: number
}

// 验证码数据
export interface ICaptcha {
  id: string
  backgroundImage: string
  templateImage: string
  backgroundImageWidth: number
  backgroundImageHeight: number
  templateImageWidth: number
  templateImageHeight: number
}

// 验证码验证请求
export interface ICaptchaVerifyReq {
  id: string
  data: {
    bgImageWidth: number
    bgImageHeight: number
    templateImageWidth: number
    templateImageHeight: number
    startTime: number
    stopTime: number
    trackList: {
      x: number
      y: number
      type: string
      t: number
    }[]
  }
}

// 判断是否为单Token响应
export function isSingleTokenRes(tokenRes: IAuthLoginRes): tokenRes is ISingleTokenRes {
  return 'token' in tokenRes && !('refreshToken' in tokenRes)
}

// 判断是否为双Token响应
export function isDoubleTokenRes(tokenRes: IAuthLoginRes): tokenRes is IDoubleTokenRes {
  return 'accessToken' in tokenRes && 'refreshToken' in tokenRes
}
