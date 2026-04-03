import { View, Text } from '@tarojs/components'
import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'

const tabList = [
  { pagePath: '/pages/home/index', text: '首页', icon: '🏠' },
  { pagePath: '/pages/discover/index', text: '发现', icon: '🔍' },
  { pagePath: '/pages/publish/index', text: '', icon: '', isPublish: true },
  { pagePath: '/pages/message/index', text: '消息', icon: '💬' },
  { pagePath: '/pages/profile/index', text: '我的', icon: '👤' },
]

export default function CustomTabBar() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const currentPath = Taro.getCurrentInstance().router?.path
    const index = tabList.findIndex(tab => tab.pagePath === currentPath)
    if (index !== -1) {
      setActiveIndex(index)
    }
  }, [])

  const handleTabClick = (index: number, path: string, isPublish: boolean) => {
    if (isPublish) {
      Taro.navigateTo({ url: path })
    } else {
      setActiveIndex(index)
      Taro.switchTab({ url: path })
    }
  }

  return (
    <View className={styles['custom-tabbar']}>
      {tabList.map((tab, index) => {
        const isActive = activeIndex === index

        if (tab.isPublish) {
          return (
            <View
              key={index}
              className={`${styles['tab-item']} ${styles['publish-item']}`}
              onClick={() => handleTabClick(index, tab.pagePath, true)}
            >
              <View className={styles['publish-btn']}>
                <Text className={styles['publish-icon']}>+</Text>
              </View>
            </View>
          )
        }

        return (
          <View
            key={index}
            className={`${styles['tab-item']} ${isActive ? styles.active : ''}`}
            onClick={() => handleTabClick(index, tab.pagePath, false)}
          >
            <Text className={styles['tab-icon']}>{tab.icon}</Text>
            <Text className={styles['tab-text']}>{tab.text}</Text>
          </View>
        )
      })}
    </View>
  )
}
