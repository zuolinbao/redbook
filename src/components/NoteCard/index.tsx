import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

interface NoteCardProps {
  id: string
  title: string
  cover: string
  avatar: string
  nickname: string
  likes: number
  isVideo?: boolean
}

export default function NoteCard({
  id,
  title,
  cover,
  avatar,
  nickname,
  likes,
  isVideo,
}: NoteCardProps) {
  const handleClick = () => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${id}`,
    })
  }

  return (
    <View className="note-card" onClick={handleClick}>
      <View className="cover-wrapper">
        <Image src={cover} mode="widthFix" className="cover" lazyLoad />
        {isVideo && (
          <View className="video-badge">
            <Text className="video-icon">▶</Text>
          </View>
        )}
      </View>
      <View className="content">
        <Text className="title text-ellipsis-2">{title}</Text>
        <View className="footer">
          <View className="author">
            <Image src={avatar} className="avatar" />
            <Text className="nickname">{nickname}</Text>
          </View>
          <View className="likes">
            <Text className="like-icon">♡</Text>
            <Text className="like-count">{likes}</Text>
          </View>
        </View>
      </View>
    </View>
  )
}
