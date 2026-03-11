import { View, Text, Image, ScrollView, Input } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import CustomTabBar from '../../components/CustomTabBar'
import './index.scss'

const hotTopics = [
  { id: '1', title: '秋冬穿搭', hot: '123.4万' },
  { id: '2', title: '美食探店', hot: '98.2万' },
  { id: '3', title: '护肤心得', hot: '87.6万' },
  { id: '4', title: '旅行攻略', hot: '76.5万' },
  { id: '5', title: '健身打卡', hot: '65.3万' },
  { id: '6', title: '家居好物', hot: '54.1万' },
]

const categories = [
  { id: '1', name: '穿搭', icon: '👗', count: '1234万笔记' },
  { id: '2', name: '美食', icon: '🍜', count: '987万笔记' },
  { id: '3', name: '旅行', icon: '✈️', count: '876万笔记' },
  { id: '4', name: '美妆', icon: '💄', count: '765万笔记' },
  { id: '5', name: '健身', icon: '💪', count: '654万笔记' },
  { id: '6', name: '家居', icon: '🏠', count: '543万笔记' },
  { id: '7', name: '数码', icon: '📱', count: '432万笔记' },
  { id: '8', name: '读书', icon: '📚', count: '321万笔记' },
]

const recommendUsers = [
  { id: '1', nickname: '时尚达人', avatar: 'https://picsum.photos/100/100?random=10', fans: '12.3万', desc: '专注时尚穿搭分享' },
  { id: '2', nickname: '美食博主', avatar: 'https://picsum.photos/100/100?random=11', fans: '8.7万', desc: '带你发现美食' },
  { id: '3', nickname: '旅行家', avatar: 'https://picsum.photos/100/100?random=12', fans: '15.2万', desc: '环球旅行中' },
]

export default function Discover() {
  const [searchValue, setSearchValue] = useState('')

  const handleSearch = () => {
    if (searchValue.trim()) {
      Taro.navigateTo({
        url: `/pages/search/index?keyword=${searchValue}`
      })
    }
  }

  return (
    <View className='discover-page'>
      <View className='search-bar'>
        <View className='search-input-wrapper'>
          <Text className='search-icon'>🔍</Text>
          <Input 
            className='search-input'
            placeholder='搜索笔记、用户'
            value={searchValue}
            onInput={(e) => setSearchValue(e.detail.value)}
            onConfirm={handleSearch}
          />
        </View>
      </View>

      <ScrollView scrollY className='content-scroll'>
        <View className='section'>
          <View className='section-header'>
            <Text className='section-title'>🔥 热门话题</Text>
          </View>
          <View className='hot-topics'>
            {hotTopics.map((topic, index) => (
              <View 
                key={topic.id} 
                className='topic-item'
                onClick={() => Taro.navigateTo({ url: `/pages/topic/index?id=${topic.id}` })}
              >
                <Text className={`topic-rank ${index < 3 ? 'top' : ''}`}>{index + 1}</Text>
                <View className='topic-info'>
                  <Text className='topic-title'>{topic.title}</Text>
                  <Text className='topic-hot'>{topic.hot}热度</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View className='section'>
          <View className='section-header'>
            <Text className='section-title'>📂 热门分类</Text>
          </View>
          <View className='categories'>
            {categories.map(cat => (
              <View key={cat.id} className='category-item'>
                <Text className='category-icon'>{cat.icon}</Text>
                <Text className='category-name'>{cat.name}</Text>
                <Text className='category-count'>{cat.count}</Text>
              </View>
            ))}
          </View>
        </View>

        <View className='section'>
          <View className='section-header'>
            <Text className='section-title'>👤 推荐关注</Text>
          </View>
          <ScrollView scrollX className='users-scroll'>
            {recommendUsers.map(user => (
              <View key={user.id} className='user-card'>
                <Image src={user.avatar} className='user-avatar' />
                <Text className='user-nickname'>{user.nickname}</Text>
                <Text className='user-desc'>{user.desc}</Text>
                <Text className='user-fans'>{user.fans}粉丝</Text>
                <View className='follow-btn'>
                  <Text>+ 关注</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
      <CustomTabBar />
    </View>
  )
}
