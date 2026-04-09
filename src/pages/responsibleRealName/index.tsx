import { View, Text, Button } from '@tarojs/components'
import { useCallback } from 'react'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'

export default function ResponsibleRealName() {
  // 开始实名认证
  const handleStartAuth = useCallback(() => {
    Taro.navigateTo({
      url: '/pages/operatorRealName/index',
    })
  }, [])

  return (
    <View className={styles['container']}>
      {/* 顶部背景区域 */}
      <View className={styles['header-bg']}>
        <View className={styles['logo-section']}>
          <View className={styles['logo-icon']}>
            <View className={styles['logo-inner']} />
          </View>
        </View>
      </View>

      {/* 主内容区域 */}
      <View className={styles['content-section']}>
        {/* 提示文字 */}
        <View className={styles['tip-section']}>
          <Text className={styles['tip-text']}>物联卡实名登记</Text>
          <View className={styles['arrow-container']}>
            <Text className={styles['arrow-text']}>&gt;</Text>
            <Text className={styles['arrow-text']}>&gt;</Text>
          </View>
          <Text className={styles['sub-tip']}>点击下方按钮</Text>
        </View>

        {/* 实名认证按钮 */}
        <Button
          className={styles['auth-btn']}
          onClick={handleStartAuth}
        >
          实名认证
        </Button>
      </View>

      {/* 底部装饰 */}
      <View className={styles['footer-decoration']}>
        <View className={styles['decoration-circle']} />
      </View>
    </View>
  )
}
