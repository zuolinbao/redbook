import { View, Text, Image, ScrollView } from '@tarojs/components'
import Taro from '@tarojs/taro'
import CustomTabBar from '../../components/CustomTabBar'
import './index.scss'

const messageTypes = [
  { id: 'like', icon: '❤️', title: '点赞和收藏', desc: '有人赞了你的笔记', count: 12 },
  { id: 'comment', icon: '💬', title: '评论', desc: '有人评论了你的笔记', count: 5 },
  { id: 'follow', icon: '👤', title: '新增关注', desc: '有人关注了你', count: 3 },
  { id: 'mention', icon: '@', title: '@我的', desc: '有人@了你', count: 0 },
  { id: 'system', icon: '🔔', title: '系统通知', desc: '官方消息通知', count: 2 },
]

const conversations = [
  { 
    id: '1', 
    avatar: 'https://picsum.photos/100/100?random=20', 
    nickname: '时尚达人', 
    lastMessage: '你好，请问这件衣服在哪里买的？', 
    time: '刚刚',
    unread: 2
  },
  { 
    id: '2', 
    avatar: 'https://picsum.photos/100/100?random=21', 
    nickname: '美食博主', 
    lastMessage: '谢谢分享，学到了很多', 
    time: '10分钟前',
    unread: 0
  },
  { 
    id: '3', 
    avatar: 'https://picsum.photos/100/100?random=22', 
    nickname: '旅行家', 
    lastMessage: '下次一起去旅行吧', 
    time: '昨天',
    unread: 0
  },
  { 
    id: '4', 
    avatar: 'https://picsum.photos/100/100?random=23', 
    nickname: '健身教练', 
    lastMessage: '坚持锻炼，加油！', 
    time: '前天',
    unread: 1
  },
]

export default function Message() {
  const handleTypeClick = (type: string) => {
    Taro.navigateTo({
      url: `/pages/message-detail/index?type=${type}`
    })
  }

  const handleConversationClick = (id: string) => {
    Taro.navigateTo({
      url: `/pages/chat/index?id=${id}`
    })
  }

  return (
    <View className='message-page'>
      <ScrollView scrollY className='content-scroll'>
        <View className='message-types'>
          {messageTypes.map(type => (
            <View 
              key={type.id} 
              className='type-item'
              onClick={() => handleTypeClick(type.id)}
            >
              <View className='type-icon-wrapper'>
                <Text className='type-icon'>{type.icon}</Text>
                {type.count > 0 && (
                  <View className='badge'>
                    <Text>{type.count > 99 ? '99+' : type.count}</Text>
                  </View>
                )}
              </View>
              <Text className='type-title'>{type.title}</Text>
            </View>
          ))}
        </View>

        <View className='section-header'>
          <Text className='section-title'>私信</Text>
        </View>

        <View className='conversations'>
          {conversations.map(conv => (
            <View 
              key={conv.id} 
              className='conversation-item'
              onClick={() => handleConversationClick(conv.id)}
            >
              <View className='avatar-wrapper'>
                <Image src={conv.avatar} className='avatar' />
                {conv.unread > 0 && (
                  <View className='unread-dot' />
                )}
              </View>
              <View className='conversation-content'>
                <View className='conversation-header'>
                  <Text className='nickname'>{conv.nickname}</Text>
                  <Text className='time'>{conv.time}</Text>
                </View>
                <Text className='last-message text-ellipsis'>{conv.lastMessage}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <CustomTabBar />
    </View>
  )
}
