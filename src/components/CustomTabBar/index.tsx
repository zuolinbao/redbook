import { View, Text } from '@tarojs/components'
import { useEffect, useState } from 'react'
import Taro from '@tarojs/taro'
import './index.scss'

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
    <View className='custom-tabbar'>
      {tabList.map((tab, index) => {
        const isActive = activeIndex === index
        
        if (tab.isPublish) {
          return (
            <View 
              key={index} 
              className='tab-item publish-item'
              onClick={() => handleTabClick(index, tab.pagePath, true)}
            >
              <View className='publish-btn'>
                <Text className='publish-icon'>+</Text>
              </View>
            </View>
          )
        }

        return (
          <View 
            key={index} 
            className={`tab-item ${isActive ? 'active' : ''}`}
            onClick={() => handleTabClick(index, tab.pagePath, false)}
          >
            <Text className='tab-icon'>{tab.icon}</Text>
            <Text className='tab-text'>{tab.text}</Text>
          </View>
        )
      })}
    </View>
  )
}
