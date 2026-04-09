import { View, Text, Input, Button } from '@tarojs/components'
import { useState, useRef, useCallback } from 'react'
import Taro from '@tarojs/taro'
import SliderVerify from '../../components/SliderVerify'
import Agreement from '../../components/Agreement'
import styles from './index.module.scss'

export default function Login() {
  const [phone, setPhone] = useState('17721547518')
  const [smsCode, setSmsCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [agreementChecked, setAgreementChecked] = useState(false)
  const verifyRef = useRef<{ open: () => void; close: () => void }>(null)

  const handleSendCode = useCallback(() => {
    if (!phone) {
      Taro.showToast({ title: '请输入手机号', icon: 'none' })
      return
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      Taro.showToast({ title: '手机号格式不正确', icon: 'none' })
      return
    }
    verifyRef.current?.open()
  }, [phone])

  const verifySuccess = useCallback(
    (captchaId: string) => {
      sendSmsCode(captchaId)
    },
    [phone],
  )

  const sendSmsCode = async (captchaId: string) => {
    if (isSendingCode || countdown > 0) return
    setIsSendingCode(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      Taro.showToast({ title: '验证码已发送', icon: 'success' })
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
      Taro.showToast({ title: '发送失败，请重试', icon: 'none' })
    } finally {
      setIsSendingCode(false)
    }
  }

  const handleLogin = useCallback(() => {
    if (!phone) {
      Taro.showToast({ title: '请输入手机号', icon: 'none' })
      return
    }
    if (!smsCode) {
      Taro.showToast({ title: '请输入验证码', icon: 'none' })
      return
    }
    if (!agreementChecked) {
      Taro.showToast({ title: '请同意用户协议和隐私政策', icon: 'none' })
      return
    }
    performLogin()
  }, [phone, smsCode, agreementChecked])

  const performLogin = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      Taro.showToast({ title: '登录成功', icon: 'success' })
      setTimeout(() => {
        Taro.redirectTo({ url: '/pages/responsibleRealName/index' })
      }, 1000)
    } catch (error) {
      Taro.showToast({ title: '登录失败，请重试', icon: 'none' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <View className={styles['login-container']}>
      <View className={styles['header-bg']} />

      <View className={styles['content-section']}>
        <View className={styles['title-section']}>
          <Text className={styles['hello-text']}>Hello！</Text>
          <Text className={styles['welcome-text']}>欢迎登录物联卡实名登记</Text>
        </View>

        <View className={styles['login-section']}>
          <View className={styles['quick-login-tag']}>
            <Text className={styles['tag-text']}>快捷登录</Text>
            <View className={styles['tag-line']} />
          </View>

          <View className={styles['form-section']}>
            <View className={styles['input-group']}>
              <View className={styles['input-wrapper']}>
                <View className={`${styles['input-box']} ${styles['phone-box']}`}>
                  <Text className={styles['phone-text']}>{phone}</Text>
                  <Text className={styles['divider']}>丨</Text>
                </View>
              </View>

              <View className={styles['input-wrapper']}>
                <View className={`${styles['input-box']} ${styles['code-box']}`}>
                  <Input
                    className={styles['code-input']}
                    type="number"
                    value={smsCode}
                    onInput={e =>
                      setSmsCode(
                        String(e.detail.value || '')
                          .replace(/\D/g, '')
                          .slice(0, 6),
                      )
                    }
                    placeholder="请输入验证码"
                    placeholderClass={styles['placeholder']}
                    maxlength={6}
                  />
                  <Button
                    className={styles['send-code-btn']}
                    onClick={handleSendCode}
                    disabled={countdown > 0 || isSendingCode}
                  >
                    <Text className={styles['btn-text']}>
                      {countdown > 0 ? `${countdown}s` : '发送验证码'}
                    </Text>
                  </Button>
                </View>
              </View>
            </View>

            <View className={styles['agreement-section']}>
              <Agreement checked={agreementChecked} onChange={setAgreementChecked} />
            </View>

            <View className={styles['login-btn-wrapper']}>
              <Button
                className={styles['login-btn']}
                onClick={handleLogin}
                loading={loading}
                disabled={loading}
              >
                <Text className={styles['btn-text']}>登录</Text>
              </Button>
            </View>
          </View>
        </View>
      </View>

      <SliderVerify ref={verifyRef} onSuccess={verifySuccess} />
    </View>
  )
}
