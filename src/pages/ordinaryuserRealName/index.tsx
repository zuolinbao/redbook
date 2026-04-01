import { useState, useRef, useCallback } from 'react'
import { View, Text } from '@tarojs/components'
import { Form, Input, Button, Cell, Field, Dialog, Checkbox } from '@taroify/core'
import CTNavbar from '../../components/CTNavbar'
import Taro from '@tarojs/taro'
import FormTitle from '../../components/FormTitle'
import SliderVerify from '../../components/SliderVerify'
import styles from './index.module.scss'

const OrdinaryUserRealName = () => {
  const [phoneDis, _setPhoneDis] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const [show, setShow] = useState(false)
  const [dialogContent, setDialogContent] = useState('')
  const [isMobile, _setIsMobile] = useState(false)

  // 验证码相关状态
  const [countdown, setCountdown] = useState(0)
  const [isSendingCode, setIsSendingCode] = useState(false)
  const verifyRef = useRef<{ open: () => void; close: () => void }>(null)

  // 基础信息表单数据
  const [baseFormData, setBaseFormData] = useState({
    iccid: '',
    phoneNum: '',
    verifyCode: '',
  })

  // 是否禁用按钮
  const isdisabled = () => {
    if (phoneDis) {
      return !isChecked
    } else {
      const param = { ...baseFormData }
      return !isChecked || Object.values(param).some((value) => !value)
    }
  }

  // 获取验证码 - 发送验证码前的校验
  const handleSearchCode = useCallback(() => {
    if (!baseFormData.phoneNum) {
      Taro.showToast({
        title: '请输入手机号',
        icon: 'none',
      })
      return
    }
    if (!/^1[3-9]\d{9}$/.test(baseFormData.phoneNum)) {
      Taro.showToast({
        title: '手机号格式不正确',
        icon: 'none',
      })
      return
    }
    // 打开滑动验证码（如果有该组件）
    verifyRef.current?.open()
  }, [baseFormData.phoneNum])

  // 验证码验证成功后发送短信
  const verifySuccess = useCallback((captchaId: string) => {
    console.log('验证码验证成功，ID:', captchaId)
    sendSmsCode(captchaId)
  }, [])

  // 发送短信验证码
  const sendSmsCode = async (_captchaId: string) => {
    if (isSendingCode || countdown > 0) return

    setIsSendingCode(true)
    try {
      // TODO: 替换为实际的发送短信验证码 API
      // await sendSmsCodeApi({
      //   phone: baseFormData.phoneNum,
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

  // 快速验证
  const nextStep = () => {
    console.log('快速验证', baseFormData)
    // TODO: 处理快速验证逻辑
  }

  // 点击用户协议/隐私政策
  const clickShow = (type) => {
    setShow(true)
    if (type === 'user') {
      setDialogContent('1')
    } else {
      setDialogContent('2')
    }
  }

  // 对话框确认
  const dialogConfirm = () => {
    setShow(false)
    setIsChecked(true)
  }

  // 对话框取消
  const dialogCancel = () => {
    setShow(false)
  }

  return (
    <View className={styles["real-name-page"]}>
      <CTNavbar title="普通用户实名认证">
        <CTNavbar.NavLeft onClick={() => Taro.navigateBack()} />
      </CTNavbar>
      <View className={styles["real-name-content"]}>
        <FormTitle title={phoneDis ? '请确认你的信息' : '请填写你的信息'} />
        <Form>
          <Cell.Group inset>
            {/* ICCID */}
            <Field label="物联网 ICCID/接入号">
              <Input
                placeholder="请输入物联网 ICCID/接入号"
                value={baseFormData.iccid}
                disabled={phoneDis}
                onChange={(e) => setBaseFormData({ ...baseFormData, iccid: e.detail.value })}
              />
            </Field>

            {/* 手机号 */}
            {!phoneDis && (
              <Field align="center" label="手机号">
                <Input
                  placeholder="请输入手机号"
                  value={baseFormData.phoneNum}
                  onChange={(e) => setBaseFormData({ ...baseFormData, phoneNum: e.detail.value })}
                />
                <Button
                  size="small"
                  color="primary"
                  disabled={countdown > 0 || isSendingCode}
                  onClick={handleSearchCode}
                >
                  {countdown > 0 ? `${countdown}s 后重发` : '获取验证码'}
                </Button>
              </Field>
            )}

            {/* 验证码 */}
            {!phoneDis && (
              <Field label="验证码">
                <Input
                  placeholder="请输入 6 位数字验证码"
                  value={baseFormData.verifyCode}
                  maxlength={6}
                  onChange={(e) => setBaseFormData({ ...baseFormData, verifyCode: e.detail.value })}
                />
              </Field>
            )}
          </Cell.Group>

          {/* 用户协议 */}
          <View className={styles["agreement"]}>
            <Checkbox checked={isChecked} onChange={() => setIsChecked(!isChecked)}>
              <Text className={styles["ag-text"]}>我已认真阅读并同意</Text>
            </Checkbox>
            <Text className={styles["ag-link"]} onClick={() => clickShow('user')}>
              《用户协议》
            </Text>
            <Text className={styles["ag-link"]} onClick={() => clickShow('privacy')}>
              《隐私政策》
            </Text>
          </View>

          <Button
            shape="round"
            block
            color="primary"
            disabled={isdisabled()}
            onClick={nextStep}
            style={{ width: '100%' }}
          >
            快速验证
          </Button>
        </Form>
      </View>

      {/* 用户协议/隐私政策弹窗 */}
      <Dialog open={show} title="提示" onConfirm={dialogConfirm} onCancel={dialogCancel}>
        <View>{dialogContent}</View>
      </Dialog>

      {/* 移动端提示 */}
      <Dialog open={isMobile} onClose={() => {}}>
        <Dialog.Header>提示</Dialog.Header>
        <Dialog.Content>请使用移动端办理业务</Dialog.Content>
      </Dialog>

      {/* 滑动验证码组件 */}
      <SliderVerify ref={verifyRef} onSuccess={verifySuccess} />
    </View>
  )
}

export default OrdinaryUserRealName
