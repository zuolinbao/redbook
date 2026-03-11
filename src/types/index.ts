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
