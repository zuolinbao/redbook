import { View, Text, Image, ScrollView, RichText } from '@tarojs/components'
import { useState, useEffect } from 'react'
import Taro, { useRouter } from '@tarojs/taro'
import { mockPosts } from '../../api/mock'
import { formatTime, formatNumber } from '../../utils'
import './index.scss'

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
    <View className='detail-page'>
      <ScrollView scrollY className='content-scroll'>
        <View className='author-section'>
          <Image src={post.avatar} className='author-avatar' />
          <View className='author-info'>
            <Text className='author-name'>{post.nickname}</Text>
            <Text className='author-fans'>粉丝 {formatNumber(1234)}</Text>
          </View>
          <View 
            className={`follow-btn ${isFollowing ? 'following' : ''}`}
            onClick={handleFollow}
          >
            <Text>{isFollowing ? '已关注' : '+ 关注'}</Text>
          </View>
        </View>

        <View className='images-section'>
          <ScrollView 
            scrollX 
            className='images-scroll'
            onScroll={(e) => {
              const scrollLeft = e.detail.scrollLeft
              const index = Math.round(scrollLeft / 375)
              setCurrentImageIndex(index)
            }}
          >
            {images.map((img, index) => (
              <Image 
                key={index}
                src={img} 
                mode='widthFix' 
                className='detail-image'
              />
            ))}
          </ScrollView>
          {images.length > 1 && (
            <View className='image-indicator'>
              <Text>{currentImageIndex + 1} / {images.length}</Text>
            </View>
          )}
        </View>

        <View className='post-content'>
          <Text className='post-title'>{post.title}</Text>
          {post.content && (
            <Text className='post-text'>{post.content}</Text>
          )}
          
          <View className='post-tags'>
            {post.topic && (
              <View className='tag-item'>
                <Text>#{post.topic}</Text>
              </View>
            )}
            {post.location && (
              <View className='location-item'>
                <Text>📍 {post.location}</Text>
              </View>
            )}
          </View>

          <Text className='post-time'>{formatTime(post.createdAt)}</Text>
        </View>

        <View className='comments-section'>
          <View className='section-header'>
            <Text className='section-title'>评论 {comments.length}</Text>
          </View>

          {comments.map(comment => (
            <View key={comment.id} className='comment-item'>
              <Image src={comment.avatar} className='comment-avatar' />
              <View className='comment-content'>
                <Text className='comment-nickname'>{comment.nickname}</Text>
                <Text className='comment-text'>{comment.content}</Text>
                <View className='comment-footer'>
                  <Text className='comment-time'>{formatTime(comment.createdAt)}</Text>
                  <View className='comment-like'>
                    <Text className='like-icon'>♡</Text>
                    <Text className='like-count'>{comment.likes}</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <View className='bottom-bar'>
        <View className='input-wrapper'>
          <Text className='input-placeholder'>说点什么...</Text>
        </View>
        <View className='action-icons'>
          <View className={`action-item ${isLiked ? 'active' : ''}`} onClick={handleLike}>
            <Text className='action-icon'>{isLiked ? '❤️' : '🤍'}</Text>
            <Text className='action-count'>{formatNumber(post.likes + (isLiked ? 1 : 0))}</Text>
          </View>
          <View className={`action-item ${isCollected ? 'active' : ''}`} onClick={handleCollect}>
            <Text className='action-icon'>{isCollected ? '⭐' : '☆'}</Text>
            <Text className='action-count'>{formatNumber(post.collects + (isCollected ? 1 : 0))}</Text>
          </View>
          <View className='action-item' onClick={handleShare}>
            <Text className='action-icon'>📤</Text>
            <Text className='action-count'>分享</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
