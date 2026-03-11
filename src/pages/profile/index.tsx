import { View, Text, Image, ScrollView } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import CustomTabBar from '../../components/CustomTabBar'
import './index.scss'

const menuItems = [
  { id: 'notes', icon: '📝', title: '我的笔记', count: 12 },
  { id: 'collect', icon: '⭐', title: '收藏', count: 36 },
  { id: 'like', icon: '❤️', title: '点赞', count: 89 },
  { id: 'history', icon: '🕐', title: '浏览历史', count: 0 },
]

const settingItems = [
  { id: 'setting', icon: '⚙️', title: '设置' },
  { id: 'help', icon: '❓', title: '帮助与反馈' },
  { id: 'about', icon: 'ℹ️', title: '关于我们' },
]

export default function Profile() {
  const [activeTab, setActiveTab] = useState('notes')

  const user = {
    avatar: 'https://picsum.photos/200/200?random=30',
    nickname: '小红书用户',
    id: 'XHS123456',
    signature: '分享生活，记录美好',
    fans: 1234,
    following: 567,
    likes: 8900
  }

  const notes = [
    { id: '1', cover: 'https://picsum.photos/300/400?random=31', likes: 123 },
    { id: '2', cover: 'https://picsum.photos/300/350?random=32', likes: 456 },
    { id: '3', cover: 'https://picsum.photos/300/380?random=33', likes: 789 },
    { id: '4', cover: 'https://picsum.photos/300/420?random=34', likes: 234 },
    { id: '5', cover: 'https://picsum.photos/300/360?random=35', likes: 567 },
    { id: '6', cover: 'https://picsum.photos/300/400?random=36', likes: 890 },
  ]

  const handleEditProfile = () => {
    Taro.navigateTo({ url: '/pages/edit-profile/index' })
  }

  const handleMenuClick = (id: string) => {
    Taro.navigateTo({ url: `/pages/${id}/index` })
  }

  return (
    <View className='profile-page'>
      <ScrollView scrollY className='content-scroll'>
        <View className='header'>
          <View className='user-info'>
            <Image src={user.avatar} className='avatar' />
            <View className='info-right'>
              <Text className='nickname'>{user.nickname}</Text>
              <Text className='user-id'>小红书号：{user.id}</Text>
              <Text className='signature'>{user.signature}</Text>
            </View>
          </View>
          
          <View className='stats'>
            <View className='stat-item'>
              <Text className='stat-num'>{user.following}</Text>
              <Text className='stat-label'>关注</Text>
            </View>
            <View className='stat-item'>
              <Text className='stat-num'>{user.fans}</Text>
              <Text className='stat-label'>粉丝</Text>
            </View>
            <View className='stat-item'>
              <Text className='stat-num'>{user.likes}</Text>
              <Text className='stat-label'>获赞</Text>
            </View>
          </View>

          <View className='action-btns'>
            <View className='edit-btn' onClick={handleEditProfile}>
              <Text>编辑资料</Text>
            </View>
            <View className='setting-btn' onClick={() => handleMenuClick('setting')}>
              <Text>⚙️</Text>
            </View>
          </View>
        </View>

        <View className='menu-section'>
          {menuItems.map(item => (
            <View 
              key={item.id} 
              className='menu-item'
              onClick={() => handleMenuClick(item.id)}
            >
              <Text className='menu-icon'>{item.icon}</Text>
              <Text className='menu-title'>{item.title}</Text>
              <Text className='menu-count'>{item.count}</Text>
              <Text className='menu-arrow'>›</Text>
            </View>
          ))}
        </View>

        <View className='notes-section'>
          <View className='tabs'>
            <View 
              className={`tab-item ${activeTab === 'notes' ? 'active' : ''}`}
              onClick={() => setActiveTab('notes')}
            >
              <Text>笔记</Text>
            </View>
            <View 
              className={`tab-item ${activeTab === 'collect' ? 'active' : ''}`}
              onClick={() => setActiveTab('collect')}
            >
              <Text>收藏</Text>
            </View>
            <View 
              className={`tab-item ${activeTab === 'like' ? 'active' : ''}`}
              onClick={() => setActiveTab('like')}
            >
              <Text>点赞</Text>
            </View>
          </View>

          <View className='notes-grid'>
            {notes.map(note => (
              <View key={note.id} className='note-item'>
                <Image src={note.cover} mode='aspectFill' className='note-cover' />
                <View className='note-likes'>
                  <Text>❤️ {note.likes}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className='setting-section'>
          {settingItems.map(item => (
            <View 
              key={item.id} 
              className='setting-item'
              onClick={() => handleMenuClick(item.id)}
            >
              <Text className='setting-icon'>{item.icon}</Text>
              <Text className='setting-title'>{item.title}</Text>
              <Text className='setting-arrow'>›</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <CustomTabBar />
    </View>
  )
}
