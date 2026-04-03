import { View, Text, Image, ScrollView } from '@tarojs/components'
import { useState, useCallback } from 'react'
import Taro, { useReachBottom, usePullDownRefresh } from '@tarojs/taro'
import CustomTabBar from '../../components/CustomTabBar'
import styles from './index.module.scss'

interface Post {
  id: string
  title: string
  cover: string
  avatar: string
  nickname: string
  likes: number
  isVideo?: boolean
}

const mockPosts: Post[] = [
  {
    id: '1',
    title: '今日穿搭分享｜秋冬必备单品合集',
    cover: 'https://picsum.photos/300/400?random=1',
    avatar: 'https://picsum.photos/100/100?random=1',
    nickname: '时尚达人',
    likes: 1234,
  },
  {
    id: '2',
    title: '美食探店｜这家店太好吃了',
    cover: 'https://picsum.photos/300/350?random=2',
    avatar: 'https://picsum.photos/100/100?random=2',
    nickname: '吃货小王',
    likes: 856,
    isVideo: true,
  },
  {
    id: '3',
    title: '旅行攻略｜云南大理三天两夜',
    cover: 'https://picsum.photos/300/380?random=3',
    avatar: 'https://picsum.photos/100/100?random=3',
    nickname: '旅行者',
    likes: 2341,
  },
  {
    id: '4',
    title: '护肤心得｜敏感肌必看',
    cover: 'https://picsum.photos/300/420?random=4',
    avatar: 'https://picsum.photos/100/100?random=4',
    nickname: '护肤达人',
    likes: 567,
  },
  {
    id: '5',
    title: '健身打卡｜一周训练计划',
    cover: 'https://picsum.photos/300/360?random=5',
    avatar: 'https://picsum.photos/100/100?random=5',
    nickname: '健身教练',
    likes: 1890,
    isVideo: true,
  },
  {
    id: '6',
    title: '家居好物推荐｜提升幸福感',
    cover: 'https://picsum.photos/300/400?random=6',
    avatar: 'https://picsum.photos/100/100?random=6',
    nickname: '家居控',
    likes: 723,
  },
  {
    id: '7',
    title: '读书笔记｜近期好书推荐',
    cover: 'https://picsum.photos/300/370?random=7',
    avatar: 'https://picsum.photos/100/100?random=7',
    nickname: '书虫',
    likes: 456,
  },
  {
    id: '8',
    title: '数码测评｜最新耳机对比',
    cover: 'https://picsum.photos/300/390?random=8',
    avatar: 'https://picsum.photos/100/100?random=8',
    nickname: '数码爱好者',
    likes: 1234,
    isVideo: true,
  },
]

function WaterfallItem({ post }: { post: Post }) {
  const goToDetail = () => {
    console.log('点击了笔记:', post.id)
    Taro.navigateTo({
      url: `/pages/detail/index?id=${post.id}`,
    })
  }

  return (
    <View
      className={styles['waterfall-item']}
      onClick={goToDetail}
      hoverClass={styles['waterfall-item-hover']}
    >
      <View className={styles['cover-wrapper']}>
        <Image src={post.cover} mode="widthFix" className={styles.cover} lazyLoad />
        {post.isVideo && (
          <View className={styles['video-badge']}>
            <Text className={styles['video-icon']}>▶</Text>
          </View>
        )}
      </View>
      <View className={styles.content}>
        <Text className={`${styles.title} ${styles['text-ellipsis-2']}`}>{post.title}</Text>
        <View className={styles.author}>
          <Image src={post.avatar} className={styles.avatar} />
          <Text className={styles.nickname}>{post.nickname}</Text>
        </View>
        <View className={styles.likes}>
          <Text className={styles['like-icon']}>♡</Text>
          <Text className={styles['like-count']}>{post.likes}</Text>
        </View>
      </View>
    </View>
  )
}

export default function Home() {
  const [posts, setPosts] = useState<Post[]>(mockPosts)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('recommend')

  const tabs = [
    { key: 'recommend', title: '推荐' },
    { key: 'follow', title: '关注' },
    { key: 'nearby', title: '附近' },
    { key: 'food', title: '美食' },
    { key: 'fashion', title: '穿搭' },
  ]

  const loadMore = useCallback(() => {
    if (loading) return
    setLoading(true)
    setTimeout(() => {
      const newPosts = mockPosts.map(p => ({ ...p, id: p.id + Date.now() }))
      setPosts(prev => [...prev, ...newPosts])
      setLoading(false)
    }, 1000)
  }, [loading])

  useReachBottom(() => {
    loadMore()
  })

  usePullDownRefresh(() => {
    setTimeout(() => {
      setPosts(mockPosts)
      Taro.stopPullDownRefresh()
    }, 1000)
  })

  const leftPosts = posts.filter((_, i) => i % 2 === 0)
  const rightPosts = posts.filter((_, i) => i % 2 === 1)

  return (
    <View className={styles['home-page']}>
      <View className={styles.header}>
        <ScrollView scrollX className={styles['tabs-scroll']}>
          <View className={styles.tabs}>
            {tabs.map(tab => (
              <View
                key={tab.key}
                className={`${styles['tab-item']} ${activeTab === tab.key ? styles.active : ''}`}
                onClick={() => setActiveTab(tab.key)}
              >
                <Text>{tab.title}</Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView scrollY className={styles['content-scroll']}>
        <View className={styles.waterfall}>
          <View className={styles['waterfall-column']}>
            {leftPosts.map(post => (
              <WaterfallItem key={post.id} post={post} />
            ))}
          </View>
          <View className={styles['waterfall-column']}>
            {rightPosts.map(post => (
              <WaterfallItem key={post.id} post={post} />
            ))}
          </View>
        </View>
        {loading && (
          <View className={styles.loading}>
            <Text>加载中...</Text>
          </View>
        )}
      </ScrollView>
      <CustomTabBar />
    </View>
  )
}
