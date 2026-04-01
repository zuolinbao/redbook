import { useState, useRef, useCallback } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Form, Input, Button, Cell, Field, Popup, Dialog, Checkbox } from '@taroify/core'
import FormTitle from '../../components/FormTitle'
import SliderVerify from '../../components/SliderVerify'
import styles from './index.module.scss'

const UserRealName = () => {
  const [active] = useState(0)
  const [phoneDis] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const [show, setShow] = useState(false)
  const [dialogContent, setDialogContent] = useState('')
  const [isMobile] = useState(false)
  const [imgSrc, setImgSrc] = useState('')
  const [effectCodeInfo] = useState('')
  const [iccIdDisabled] = useState(false)
  const [showPhoneNum] = useState(true)
  const [showPhoneVerifyCode] = useState(true)
  const [phoneDisabled] = useState(false)

  // 验证码相关状态
  const [countdown, setCountdown] = useState(0)
  const [isSendingCode, setIsSendingCode] = useState(false)
  const verifyRef = useRef<{ open: () => void; close: () => void }>(null)

  // 基础信息表单数据
  const [baseFormData, setBaseFormData] = useState({
    iccid: '',
    phoneNum: '',
    verifyCode: '',
    imgCode: '',
    timeStamp: '',
  })

  // 是否禁用按钮
  const isdisabled = () => {
    if (active === 0) {
      const param = { ...baseFormData } as Partial<typeof baseFormData>
      delete param.imgCode
      delete param.timeStamp
      if (!showPhoneNum) {
        delete param.phoneNum
      }
      if (!showPhoneVerifyCode) {
        delete param.verifyCode
      }
      return !isChecked || Object.values(param).some((value) => !value)
    }
    return false
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
  const sendSmsCode = async (captchaId: string) => {
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

  // 图形验证码弹窗确认
  const confirm = () => {
    console.log('图形验证码确认', baseFormData.imgCode)
    // TODO: 处理图形验证码确认逻辑
  }

  // 图形验证码弹窗关闭
  const close = () => {
    console.log('图形验证码关闭')
  }

  // 点击图形验证码图片
  const clickImgSrc = () => {
    console.log('刷新图形验证码')
    // TODO: 刷新图形验证码
  }

  // 效果验证码确认
  const effectConfirm = () => {
    console.log('获取新验证码')
    // TODO: 获取新验证码
  }

  return (
    <View className={styles["real-name-page"]}>
      <View className={styles["real-name-content"]}>
        <FormTitle title={phoneDis ? '请确认你的信息' : '请填写你的信息'} />
        <Form>
          <Cell.Group inset>
            {/* ICCID */}
            <Field label="物联网 ICCID/接入号">
              <Input
                placeholder="请输入物联网 ICCID/接入号"
                value={baseFormData.iccid}
                disabled={iccIdDisabled}
                onChange={(e) => setBaseFormData({ ...baseFormData, iccid: e.detail.value })}
              />
            </Field>

            {/* 手机号 */}
            {showPhoneNum && (
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
            {showPhoneVerifyCode && (
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
              <Text className={styles["ag-forget"]} onClick={() => clickShow('user')}>
                《用户协议》
              </Text>
              <Text className={styles["ag-forget"]} onClick={() => clickShow('privacy')}>
                《隐私政策》
              </Text>
            </Checkbox>
          </View>

          <Button
            className={styles['mainBtn']}
            disabled={isdisabled()}
            onClick={nextStep}
            style={{ width: '100%' }}
          >
            快速验证
          </Button>
        </Form>
      </View>

      {/* 图形验证码弹窗 */}
      <Popup open={false} rounded>
        <View className={styles["popup-container"]}>
          <View className={styles["popup-title"]}>请输入图形验证码</View>
          <View className={styles["dialog-content"]}>
            <Input
              className={styles["checkNum"]}
              placeholder="请输入图形验证码"
              value={baseFormData.imgCode}
              onChange={(e) => setBaseFormData({ ...baseFormData, imgCode: e.detail.value })}
            />
            <Image className={styles["img-code"]} src={imgSrc} onClick={clickImgSrc} />
          </View>
          <View className={styles["popup-actions"]}>
            <Button className={styles["popup-btn-cancel"]} onClick={close}>取消</Button>
            <Button color="primary" className={styles["popup-btn-confirm"]} onClick={confirm}>确定</Button>
          </View>
        </View>
      </Popup>

      {/* 效果验证码弹窗 */}
      <Popup open={false} rounded>
        <View className={styles["popup-container"]}>
          <View className={styles["popup-title"]}>提示</View>
          <View className={styles["popup-content"]}>{effectCodeInfo}</View>
          <View className={styles["popup-actions-single"]}>
            <Button color="primary" className={styles["popup-btn-confirm"]} onClick={effectConfirm}>获取新验证码</Button>
          </View>
        </View>
      </Popup>

      {/* 用户协议/隐私政策弹窗 */}
      <Dialog open={show} title="提示" onConfirm={dialogConfirm} onCancel={dialogCancel}>
        <View>{dialogContent}</View>
      </Dialog>

      {/* 移动端提示 */}
      <Dialog open={isMobile} title="提示" showCancelButton={false} showConfirmButton={false}>
        <View>请使用移动端办理业务</View>
      </Dialog>

      {/* 滑动验证码组件 */}
      <SliderVerify ref={verifyRef} onSuccess={verifySuccess} />
    </View>
  )
}

export default UserRealName
