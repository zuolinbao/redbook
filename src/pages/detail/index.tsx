import { View, Text, Image, ScrollView } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { mockPosts } from '../../api/mock'
import { formatTime, formatNumber } from '../../utils'
import styles from './index.module.scss'

interface Comment {
  id: string
  avatar: string
  nickname: string
  content: string
  likes: number
  createdAt: string
}

const mockComments: Comment[] = [
  { id: '1', avatar: 'https://picsum.photos/100/100?random=40', nickname: '用户A', content: '太棒了！学到了很多', likes: 23, createdAt: '2024-01-15T12:00:00' },
  { id: '2', avatar: 'https://picsum.photos/100/100?random=41', nickname: '用户B', content: '收藏了，以后慢慢看', likes: 15, createdAt: '2024-01-15T11:30:00' },
  { id: '3', avatar: 'https://picsum.photos/100/100?random=42', nickname: '用户C', content: '请问这个在哪里可以买到？', likes: 8, createdAt: '2024-01-15T10:00:00' },
]

export default function Detail() {
  const router = useRouter()
  const [post, setPost] = useState(mockPosts[0])
  const [comments, setComments] = useState<Comment[]>(mockComments)
  const [isLiked, setIsLiked] = useState(false)
  const [isCollected, setIsCollected] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const id = router.params.id
    if (id) {
      const foundPost = mockPosts.find(p => p.id === id)
      if (foundPost) {
        setPost(foundPost)
      }
    }
  }, [router.params.id])

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    Taro.showToast({
      title: isFollowing ? '已取消关注' : '关注成功',
      icon: 'none'
    })
  }

  const handleLike = () => {
    setIsLiked(!isLiked)
    if (!isLiked) {
      Taro.showToast({ title: '点赞成功', icon: 'none' })
    }
  }

  const handleCollect = () => {
    setIsCollected(!isCollected)
    Taro.showToast({
      title: isCollected ? '已取消收藏' : '收藏成功',
      icon: 'none'
    })
  }

  const handleShare = () => {
    Taro.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  }

  const images = post.images || [post.cover]

  return (
    <View className={styles['detail-page']}>
      <ScrollView scrollY className={styles['content-scroll']}>
        <View className={styles['author-section']}>
          <Image src={post.avatar} className={styles['author-avatar']} />
          <View className={styles['author-info']}>
            <Text className={styles['author-name']}>{post.nickname}</Text>
            <Text className={styles['author-fans']}>粉丝 {formatNumber(1234)}</Text>
          </View>
          <View 
            className={`${styles['follow-btn']} ${isFollowing ? styles.following : ''}`}
            onClick={handleFollow}
          >
            <Text>{isFollowing ? '已关注' : '+ 关注'}</Text>
          </View>
        </View>

        <View className={styles['images-section']}>
          <ScrollView 
            scrollX 
            className={styles['images-scroll']}
          >
            {images.map((img, index) => (
              <Image 
                key={index}
                src={img} 
                mode='widthFix' 
                className={styles['detail-image']}
              />
            ))}
          </ScrollView>
          {images.length > 1 && (
            <View className={styles['image-indicator']}>
              <Text>{currentImageIndex + 1} / {images.length}</Text>
            </View>
          )}
        </View>

        <View className={styles['post-content']}>
          <Text className={styles['post-title']}>{post.title}</Text>
          {post.content && (
            <Text className={styles['post-text']}>{post.content}</Text>
          )}
          
          <View className={styles['post-tags']}>
            {post.topic && (
              <View className={styles['tag-item']}>
                <Text>#{post.topic}</Text>
              </View>
            )}
            {post.location && (
              <View className={styles['location-item']}>
                <Text>📍 {post.location}</Text>
              </View>
            )}
          </View>

          <Text className={styles['post-time']}>{formatTime(post.createdAt)}</Text>
        </View>

        <View className={styles['comments-section']}>
          <View className={styles['section-header']}>
            <Text className={styles['section-title']}>评论 {comments.length}</Text>
          </View>

          {comments.map(comment => (
            <View key={comment.id} className={styles['comment-item']}>
              <Image src={comment.avatar} className={styles['comment-avatar']} />
              <View className={styles['comment-content']}>
                <Text className={styles['comment-nickname']}>{comment.nickname}</Text>
                <Text className={styles['comment-text']}>{comment.content}</Text>
                <View className={styles['comment-footer']}>
                  <Text className={styles['comment-time']}>{formatTime(comment.createdAt)}</Text>
                  <View className={styles['comment-like']}>
                    <Text className={styles['like-icon']}>♡</Text>
                    <Text className={styles['like-count']}>{comment.likes}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View className={styles['bottom-bar']}>
        <View className={styles['input-wrapper']}>
          <Text className={styles['input-placeholder']}>说点什么...</Text>
        </View>
        <View className={styles['action-icons']}>
          <View className={`${styles['action-item']} ${isLiked ? styles.active : ''}`} onClick={handleLike}>
            <Text className={styles['action-icon']}>{isLiked ? '❤️' : '🤍'}</Text>
            <Text className={styles['action-count']}>{formatNumber(post.likes + (isLiked ? 1 : 0))}</Text>
          </View>
          <View className={`${styles['action-item']} ${isCollected ? styles.active : ''}`} onClick={handleCollect}>
            <Text className={styles['action-icon']}>{isCollected ? '⭐' : '☆'}</Text>
            <Text className={styles['action-count']}>{formatNumber(post.collects + (isCollected ? 1 : 0))}</Text>
          </View>
          <View className={styles['action-item']} onClick={handleShare}>
            <Text className={styles['action-icon']}>📤</Text>
            <Text className={styles['action-count']}>分享</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
