import { useState, useCallback } from 'react'
import { View, Text, Input, Button } from '@tarojs/components'
import { Navbar } from '@taroify/core'
import Taro from '@tarojs/taro'
import CTNavbar from '@/components/CTNavbar'
import Icon from '@/components/Icon'
import styles from './index.module.scss'

const OperatorRealName = () => {
  // ICCID 输入值
  const [iccid, setIccid] = useState('8986031632200551004')
  const [agreementChecked, setAgreementChecked] = useState(false)
  const [loading, setLoading] = useState(false)

  // 返回上一页
  const handleBack = useCallback(() => {
    Taro.navigateBack()
  }, [])

  // 处理输入变化
  const handleInputChange = useCallback(e => {
    const value = e.detail.value || ''
    // 只允许数字
    const numericValue = value.replace(/\D/g, '').slice(0, 20)
    setIccid(numericValue)
  }, [])

  // 开始实名认证
  const handleSubmit = useCallback(() => {
    if (!iccid) {
      Taro.showToast({
        title: '请输入物联网卡号',
        icon: 'none',
      })
      return
    }
    if (iccid.length < 19) {
      Taro.showToast({
        title: '物联网卡号格式不正确',
        icon: 'none',
      })
      return
    }
    if (!agreementChecked) {
      Taro.showToast({
        title: '请同意物联网卡安全协议',
        icon: 'none',
      })
      return
    }
    performAuth()
  }, [iccid, agreementChecked])

  // 执行认证
  const performAuth = async () => {
    setLoading(true)
    try {
      // TODO: 替换为实际的认证API
      await new Promise(resolve => setTimeout(resolve, 1500))

      Taro.showToast({
        title: '认证成功',
        icon: 'success',
      })

      // 跳转到下一步
      setTimeout(() => {
        Taro.navigateTo({
          url: '/pages/userRealName/index',
        })
      }, 1000)
    } catch (error) {
      Taro.showToast({
        title: '认证失败，请重试',
        icon: 'none',
      })
    } finally {
      setLoading(false)
    }
  }

  // 查看安全协议
  const viewAgreement = useCallback(() => {
    Taro.navigateTo({
      url: '/pages/agreement/index?type=iot',
    })
  }, [])

  return (
    <View className={styles['container']}>
      {/* 自定义导航栏 */}
      <CTNavbar title="中国电信物联网实名登记">
        <Navbar.NavLeft onClick={handleBack} />
      </CTNavbar>

      {/* 主内容区域 */}
      <View className={styles['content']}>
        {/* 输入卡片 */}
        <View className={styles['card']}>
          {/* 标题 */}
          <View className={styles['card-header']}>
            <View className={styles['title-bar']} />
            <Text className={styles['card-title']}>请填写物联网卡信息</Text>
          </View>

          {/* 输入框 */}
          <View>
            <View className={styles['input-wrapper']}>
              <View className={styles['input-icon']}>
                <Icon type="card" size={32} />
              </View>
              <View className={styles['input-divider']} />
              <Input
                className={styles['input']}
                type="number"
                value={iccid}
                onInput={handleInputChange}
                placeholder="请输入物联网卡号"
                placeholderClass={styles['placeholder']}
                maxlength={20}
              />
            </View>
          </View>
        </View>
        {/* 实名认证按钮 */}
        <Button
          className={styles['submit-btn']}
          onClick={handleSubmit}
          loading={loading}
          disabled={loading}
        >
          实名认证
        </Button>

        {/* 协议勾选 */}
        <View className={styles['agreement-section']}>
          <View
            className={`${styles['checkbox']} ${agreementChecked ? styles['checked'] : ''}`}
            onClick={() => setAgreementChecked(!agreementChecked)}
          >
            {agreementChecked && <Text className={styles['check-icon']}>✓</Text>}
          </View>
          <Text className={styles['agreement-text']}>
            我已阅读并同意
            <Text className={styles['link']} onClick={viewAgreement}>
              《物联网卡安全协议》
            </Text>
          </Text>
        </View>
        {/* 安全警告 */}
        <View className={styles['warning-card']}>
          <Text className={styles['warning-title']}>安全警告：</Text>
          <Text className={styles['warning-content']}>
            1. 物联网卡仅限于物联网设备联网通信，严禁用于手机、平板等人联网终端{'\n'}
            2. 乙方须向甲方提供真实、有效的证件信息，并配合人脸核验或现场认证
          </Text>
        </View>
      </View>
    </View>
  )
}

export default OperatorRealName
