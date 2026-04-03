import { View, Text, Image, ScrollView } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import CustomTabBar from '../../components/CustomTabBar'
import styles from './index.module.scss'

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
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const user = {
    avatar: 'https://picsum.photos/200/200?random=30',
    nickname: 'Redbook用户',
    id: 'RB123456',
    signature: '分享生活，记录美好',
    fans: 1234,
    following: 567,
    likes: 8900,
  }

  const handleLogin = () => {
    Taro.navigateTo({ url: '/pages/login/index' })
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
    <View className={styles['profile-page']}>
      <ScrollView scrollY className={styles['content-scroll']}>
        <View className={styles.header}>
          {!isLoggedIn ? (
            <View className={styles['login-section']}>
              <View className={styles['login-avatar']}>
                <Text className={styles['login-avatar-icon']}>👤</Text>
              </View>
              <View className={styles['login-info']}>
                <Text className={styles['login-title']}>登录/注册</Text>
                <Text className={styles['login-desc']}>登录后可同步数据，享受更多功能</Text>
              </View>
              <View className={styles['login-btn']} onClick={handleLogin}>
                <Text>立即登录</Text>
              </View>
            </View>
          ) : (
            <>
              <View className={styles['user-info']}>
                <Image src={user.avatar} className={styles.avatar} />
                <View className={styles['info-right']}>
                  <Text className={styles.nickname}>{user.nickname}</Text>
                  <Text className={styles['user-id']}>Redbook号：{user.id}</Text>
                  <Text className={styles.signature}>{user.signature}</Text>
                </View>
              </View>

              <View className={styles.stats}>
                <View className={styles['stat-item']}>
                  <Text className={styles['stat-num']}>{user.following}</Text>
                  <Text className={styles['stat-label']}>关注</Text>
                </View>
                <View className={styles['stat-item']}>
                  <Text className={styles['stat-num']}>{user.fans}</Text>
                  <Text className={styles['stat-label']}>粉丝</Text>
                </View>
                <View className={styles['stat-item']}>
                  <Text className={styles['stat-num']}>{user.likes}</Text>
                  <Text className={styles['stat-label']}>获赞</Text>
                </View>
              </View>

              <View className={styles['action-btns']}>
                <View className={styles['edit-btn']} onClick={handleEditProfile}>
                  <Text>编辑资料</Text>
                </View>
                <View className={styles['setting-btn']} onClick={() => handleMenuClick('setting')}>
                  <Text>⚙️</Text>
                </View>
              </View>
            </>
          )}
        </View>

        <View className={styles['menu-section']}>
          {menuItems.map(item => (
            <View
              key={item.id}
              className={styles['menu-item']}
              onClick={() => handleMenuClick(item.id)}
            >
              <Text className={styles['menu-icon']}>{item.icon}</Text>
              <Text className={styles['menu-title']}>{item.title}</Text>
              <Text className={styles['menu-count']}>{item.count}</Text>
              <Text className={styles['menu-arrow']}>›</Text>
            </View>
          ))}
        </View>

        <View className={styles['notes-section']}>
          <View className={styles.tabs}>
            <View
              className={`${styles['tab-item']} ${activeTab === 'notes' ? styles.active : ''}`}
              onClick={() => setActiveTab('notes')}
            >
              <Text>笔记</Text>
            </View>
            <View
              className={`${styles['tab-item']} ${activeTab === 'collect' ? styles.active : ''}`}
              onClick={() => setActiveTab('collect')}
            >
              <Text>收藏</Text>
            </View>
            <View
              className={`${styles['tab-item']} ${activeTab === 'like' ? styles.active : ''}`}
              onClick={() => setActiveTab('like')}
            >
              <Text>点赞</Text>
            </View>
          </View>

          <View className={styles['notes-grid']}>
            {notes.map(note => (
              <View key={note.id} className={styles['note-item']}>
                <Image src={note.cover} mode="aspectFill" className={styles['note-cover']} />
                <View className={styles['note-likes']}>
                  <Text>❤️ {note.likes}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className={styles['setting-section']}>
          {settingItems.map(item => (
            <View
              key={item.id}
              className={styles['setting-item']}
              onClick={() => handleMenuClick(item.id)}
            >
              <Text className={styles['setting-icon']}>{item.icon}</Text>
              <Text className={styles['setting-title']}>{item.title}</Text>
              <Text className={styles['setting-arrow']}>›</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <CustomTabBar />
    </View>
  )
}
