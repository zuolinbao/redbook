import { View, Text } from '@tarojs/components'
import { Cell } from '@taroify/core'
import Taro from '@tarojs/taro'
import CTNavbar from '../../components/CTNavbar'
import styles from './index.module.scss'

const IndexPage = () => {
  // 页面列表
  const pageList = [
    {
      id: 'userRealName',
      title: '用户实名认证',
      path: '/pages/userRealName/index',
    },
    {
      id: 'operatorRealName',
      title: '经办人实名认证',
      path: '/pages/operatorRealName/index',
    },
    {
      id: 'ordinaryuserRealName',
      title: '普通用户实名认证',
      path: '/pages/ordinaryuserRealName/index',
    },
    {
      id: 'responsibleRealName',
      title: '责任人实名认证',
      path: '/pages/responsibleRealName/index',
    },
  ]

  // 跳转到指定页面
  const navigateToPage = (path: string) => {
    Taro.navigateTo({
      url: path,
      success: () => {
        console.log('跳转成功:', path)
      },
      fail: err => {
        console.error('跳转失败:', err)
        Taro.showToast({
          title: '页面跳转失败',
          icon: 'none',
        })
      },
    })
  }

  return (
    <View className={styles['index-page']}>
      <CTNavbar title="实名认证中心" />

      <View className={styles['footer']}>
        <Text className={styles['footer-text']}>请根据您的身份选择相应的认证入口</Text>
      </View>

      <Cell.Group>
        {pageList.map(page => (
          <Cell key={page.id} title={page.title} isLink onClick={() => navigateToPage(page.path)} />
        ))}
      </Cell.Group>
    </View>
  )
}

export default IndexPage
