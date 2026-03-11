import { View, Text } from '@tarojs/components'
import './index.scss'

interface EmptyProps {
  icon?: string
  title?: string
  desc?: string
}

export default function Empty({ icon = '📭', title = '暂无数据', desc }: EmptyProps) {
  return (
    <View className='empty-container'>
      <Text className='empty-icon'>{icon}</Text>
      <Text className='empty-title'>{title}</Text>
      {desc && <Text className='empty-desc'>{desc}</Text>}
    </View>
  )
}
