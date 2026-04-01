import React, { useState, useEffect } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { Form, Input, Button, Cell, Popup, Dialog, Checkbox } from '@taroify/core'
import styles from './index.module.scss'

const OrdinaryUserRealName = () => {
  const [phoneDis, setPhoneDis] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const [show, setShow] = useState(false)
  const [dialogContent, setDialogContent] = useState('')
  const [isMobile, setIsMobile] = useState(false)
  const [sendText, setSendText] = useState('获取验证码')
  const [btnDisabled, setBtnDisabled] = useState(false)
  const [imgSrc, setImgSrc] = useState('')
  const [effectCodeInfo, setEffectCodeInfo] = useState('')
  const [codeType, setCodeType] = useState(-1)

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
    if (phoneDis) {
      return !isChecked
    } else {
      const param = { ...baseFormData }
      delete param.imgCode
      delete param.timeStamp
      return !isChecked || Object.values(param).some((value) => value === '')
    }
  }

  // 获取验证码
  const handleSearchCode = () => {
    console.log('获取验证码', baseFormData)
    // TODO: 调用获取验证码接口
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
      <View className={styles["real-index"]}>
        <View className={styles["real-name-content"]}>
          <View className={styles["form-content"]}>
            <View className={styles["form-main"]}>
              <View className={styles["form-title"]}>{phoneDis ? '请确认你的信息' : '请填写你的信息'}</View>
              <Form>
                <Cell.Group inset>
                  {/* ICCID */}
                  <Cell title="物联网ICCID/接入号">
                    <Input
                      placeholder="请输入物联网ICCID/接入号"
                      value={baseFormData.iccid}
                      disabled={phoneDis}
                      onChange={(e) => setBaseFormData({ ...baseFormData, iccid: e.detail.value })}
                    />
                  </Cell>

                  {/* 手机号 */}
                  {!phoneDis && (
                    <Cell title="手机号">
                      <Input
                        placeholder="请输入手机号"
                        value={baseFormData.phoneNum}
                        onChange={(e) => setBaseFormData({ ...baseFormData, phoneNum: e.detail.value })}
                      />
                      <Button
                        className={styles["codeButton"]}
                        disabled={btnDisabled}
                        onClick={handleSearchCode}
                      >
                        {sendText}
                      </Button>
                    </Cell>
                  )}

                  {/* 验证码 */}
                  {!phoneDis && (
                    <Cell title="验证码">
                      <Input
                        placeholder="请输入6位数字验证码"
                        value={baseFormData.verifyCode}
                        maxlength={6}
                        onChange={(e) => setBaseFormData({ ...baseFormData, verifyCode: e.detail.value })}
                      />
                    </Cell>
                  )}
                </Cell.Group>
              </Form>
            </View>
          </View>

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
            className={isdisabled() ? styles['disabledBtn'] : styles['nextBtn']}
            disabled={isdisabled()}
            onClick={nextStep}
          >
            快速验证
          </Button>
        </View>
      </View>

      {/* 图形验证码弹窗 */}
      <Popup open={false} position="center" round>
        <Popup.Header>请输入图形验证码</Popup.Header>
        <View className={styles["dialog-content"]}>
          <Input
            className={styles["checkNum"]}
            placeholder="请输入图形验证码"
            value={baseFormData.imgCode}
            onChange={(e) => setBaseFormData({ ...baseFormData, imgCode: e.detail.value })}
          />
          <Image className={styles["img-code"]} src={imgSrc} onClick={clickImgSrc} />
        </View>
        <Popup.Footer>
          <Popup.Button onClick={close}>取消</Popup.Button>
          <Popup.Button onClick={confirm} primary>
            确定
          </Popup.Button>
        </Popup.Footer>
      </Popup>

      {/* 效果验证码弹窗 */}
      <Popup open={false} position="center" round>
        <Popup.Header>提示</Popup.Header>
        <View>{effectCodeInfo}</View>
        <Popup.Footer>
          <Popup.Button onClick={effectConfirm} primary>
            获取新验证码
          </Popup.Button>
        </Popup.Footer>
      </Popup>

      {/* 用户协议/隐私政策弹窗 */}
      <Dialog open={show} title="提示" onConfirm={dialogConfirm} onCancel={dialogCancel}>
        <View>{dialogContent}</View>
      </Dialog>

      {/* 移动端提示 */}
      <Dialog open={isMobile} title="提示" showCancelButton={false} showConfirmButton={false}>
        <View>请使用移动端办理业务</View>
      </Dialog>
    </View>
  )
}

export default OrdinaryUserRealName
