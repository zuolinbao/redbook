import { View, Text, Image, Input, Button } from '@tarojs/components'
import { useState, useRef, useCallback } from 'react'
import Taro from '@tarojs/taro'
import SliderVerify from '../../components/SliderVerify'
import styles from './index.module.scss'

export default function Login() {
  const [phone, setPhone] = useState('13333333333')
  const [smsCode, setSmsCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [agreementChecked, setAgreementChecked] = useState(true)
  const verifyRef = useRef<{ open: () => void; close: () => void }>(null)

  // 发送验证码前的校验
  const handleSendCode = useCallback(() => {
    if (!phone) {
      Taro.showToast({
        title: '请输入手机号',
        icon: 'none',
      })
      return
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      Taro.showToast({
        title: '手机号格式不正确',
        icon: 'none',
      })
      return
    }
    // 打开滑动验证码
    verifyRef.current?.open()
  }, [phone])

  // 验证码验证成功后发送短信
  const verifySuccess = useCallback((captchaId: string) => {
    console.log('验证码验证成功，ID:', captchaId)
    sendSmsCode(captchaId)
  }, [phone])

  // 发送短信验证码
  const sendSmsCode = async (captchaId: string) => {
    if (isSendingCode || countdown > 0) return

    setIsSendingCode(true)
    try {
      // TODO: 替换为实际的发送短信验证码API
      // await sendSmsCodeApi({
      //   phone: phone,
      //   captchaId: captchaId,
      // })

      // 模拟发送
      await new Promise(resolve => setTimeout(resolve, 500))

      Taro.showToast({
        title: '验证码已发送',
        icon: 'success',
      })

      // 开始倒计时
      setCountdown(60)
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } catch (error) {
      console.error('发送验证码失败:', error)
      Taro.showToast({
        title: '发送失败，请重试',
        icon: 'none',
      })
    } finally {
      setIsSendingCode(false)
    }
  }

  // 登录
  const handleLogin = useCallback(() => {
    if (!phone) {
      Taro.showToast({
        title: '请输入手机号',
        icon: 'none',
      })
      return
    }
    if (!smsCode) {
      Taro.showToast({
        title: '请输入验证码',
        icon: 'none',
      })
      return
    }
    if (!agreementChecked) {
      Taro.showToast({
        title: '请同意用户协议和隐私政策',
        icon: 'none',
      })
      return
    }
    performLogin()
  }, [phone, smsCode, agreementChecked])

  // 执行登录
  const performLogin = async () => {
    setLoading(true)

    try {
      // TODO: 替换为实际的登录API
      // const res = await loginBySmsApi({
      //   phone: phone,
      //   smsCode: smsCode,
      // })

      // 模拟登录
      await new Promise(resolve => setTimeout(resolve, 1500))

      Taro.showToast({
        title: '登录成功',
        icon: 'success',
      })

      setTimeout(() => {
        Taro.switchTab({
          url: '/pages/home/index',
        })
      }, 1000)
    } catch (error) {
      console.error('登录失败:', error)
      Taro.showToast({
        title: '登录失败，请重试',
        icon: 'none',
      })
    } finally {
      setLoading(false)
    }
  }

  // 微信登录
  const handleWechatLogin = useCallback(() => {
    Taro.showToast({
      title: '功能开发中',
      icon: 'none',
    })
  }, [])

  return (
    <View className={styles['login-container']}>
      {/* 头部区域 */}
      <View className={styles['header-section']}>
        <View className={styles.logo}>
          <Text className={styles['logo-text']}>📕</Text>
        </View>
        <Text className={styles['app-name']}>Redbook</Text>
      </View>

      {/* 表单区域 */}
      <View className={styles['form-section']}>
        {/* 手机号输入 */}
        <View className={styles['form-item']}>
          <Text className={styles['input-label']}>手机号</Text>
          <View className={styles['input-wrapper']}>
            <Input
              value={phone}
              onInput={(e) => setPhone(e.detail.value)}
              type='number'
              maxlength={11}
              placeholder='请输入手机号'
              className={styles.input}
            />
          </View>
        </View>

        {/* 验证码输入 */}
        <View className={styles['form-item']}>
          <Text className={styles['input-label']}>验证码</Text>
          <View className={styles['input-wrapper']}>
            <Input
              value={smsCode}
              onInput={(e) => setSmsCode(String(e.detail.value || '').replace(/\D/g, '').slice(0, 6))}
              type='digit'
              maxlength={6}
              placeholder='请输入验证码'
              className={styles.input}
            />
            <Button
              className={styles['send-code-btn']}
              disabled={countdown > 0}
              onClick={handleSendCode}
            >
              {countdown > 0 ? `${countdown}s后重发` : '获取验证码'}
            </Button>
          </View>
        </View>

        {/* 登录按钮 */}
        <Button
          className={styles['login-btn']}
          loading={loading}
          onClick={handleLogin}
        >
          {loading ? '登录中...' : '登录'}
        </Button>

        {/* 微信登录 */}
        <View className={styles['wechat-login']} onClick={handleWechatLogin}>
          <View className={styles.divider}>
            <Text className={styles['divider-text']}>其他登录方式</Text>
          </View>
          <View className={styles['wechat-icon-wrapper']}>
            <Text className={styles['wechat-icon']}>💬</Text>
          </View>
        </View>
      </View>

      {/* 底部协议区域 */}
      <View className={styles['agreement-section']}>
        <View
          className={styles['agreement-checkbox']}
          onClick={() => setAgreementChecked(!agreementChecked)}
        >
          <Text>{agreementChecked ? '☑️' : '⬜'}</Text>
        </View>
        <Text className={styles['agreement-text']}>
          我已阅读并同意
          <Text className={styles.link}>《用户协议》</Text>
          和
          <Text className={styles.link}>《隐私政策》</Text>
        </Text>
      </View>

      {/* 滑动验证码组件 */}
      <SliderVerify ref={verifyRef} onSuccess={verifySuccess} />
    </View>
  )
}
