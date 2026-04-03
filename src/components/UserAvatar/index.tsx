import { View, Text, Image } from '@tarojs/components'
import './index.scss'

interface UserAvatarProps {
  src: string
  size?: 'small' | 'medium' | 'large'
  showBorder?: boolean
}

export default function UserAvatar({ src, size = 'medium', showBorder = false }: UserAvatarProps) {
  return (
    <View className={`user-avatar ${size} ${showBorder ? 'border' : ''}`}>
      <Image src={src} mode="aspectFill" className="avatar-image" />
    </View>
  )
}
