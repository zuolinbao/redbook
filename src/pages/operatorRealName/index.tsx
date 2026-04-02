import { useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Form, Input, Button, Cell, Field, Picker, Popup, Dialog, Checkbox, Navbar } from '@taroify/core'
import CTNavbar from '../../components/CTNavbar'
import FormTitle from '../../components/FormTitle'
import styles from './index.module.scss'

const OperatorRealName = () => {
  const [active] = useState(0)

  // Picker 弹窗状态
  const [platformPickerOpen, setPlatformPickerOpen] = useState(false)
  const [provincePickerOpen, setProvincePickerOpen] = useState(false)
  const [cityPickerOpen, setCityPickerOpen] = useState(false)
  const [cardTypePickerOpen, setCardTypePickerOpen] = useState(false)
  const [namePickerOpen, setNamePickerOpen] = useState(false)
  const [isChecked, setIsChecked] = useState(false)
  const [show, setShow] = useState(false)
  const [dialogContent, setDialogContent] = useState('')

  // 基础信息表单数据
  const [baseFormData, setBaseFormData] = useState({
    platform: 0, // 平台
    province: '', // 省
    city: '', // 市
    cardType: '', // 证件类型
    cardNum: '', // 企业证件号码
    name: '', // 客户名称
    custNum: '',
  })

  // 平台选项
  const platformArr = [
    { value: '0', label: 'CMP平台' },
    { value: '1', label: 'DCP平台' },
  ]

  // CMP平台证件类型
  const cmpCardArr = [
    { value: '999', label: '客户编码' },
    { value: '49', label: '统一社会信用代码证书' },
    { value: '499', label: '请输入8986/149/141/10649/开头的号' },
  ]

  // DCP平台证件类型
  const cardArr = [
    { value: '6', label: '营业执照' },
    { value: '7', label: '单位介绍信/公函+公章(仅用于党政军客户)' },
    { value: '15', label: '组织机构代码证' },
    { value: '39', label: '税务登记号' },
    { value: '49', label: '统一社会信用代码证书' },
    { value: '34', label: '事业单位法人证书' },
    { value: '43', label: '社会团体法人登记证书' },
    { value: '499', label: '请输入8986/149/141/10649/开头的号' },
  ]

  // 省份数据（示例）
  const [provinceArr, _setProvinceArr] = useState([
    { value: '110000', label: '北京市' },
    { value: '310000', label: '上海市' },
    { value: '440000', label: '广东省' },
  ])

  // 城市数据（示例）
  const [cityArr, _setCityArr] = useState<Array<{value: string, label: string}>>([
    { value: '110100', label: '北京市' },
    { value: '110200', label: '天津市' },
    { value: '110300', label: '河北省' },
  ])

  // 客户名称数据
  const [nameArr, _setNameArr] = useState<Array<{value: string, label: string}>>([])

  // 是否是号卡类型
  const isCardType = baseFormData.cardType === '499'

  // 下一步按钮文本
  const nextBtn = () => {
    switch (active) {
      case 0:
      case 1:
        return '下一步'
      case 2:
        return '开始验证'
      case 3:
        return '返回'
      default:
        return '下一步'
    }
  }

  // 是否禁用按钮
  const isdisabled = () => {
    if (active === 0) {
      if (baseFormData.platform === 1) {
        const obj = {
          platform: baseFormData.platform,
          cardType: baseFormData.cardType,
          cardNum: baseFormData.cardNum,
          name: baseFormData.name,
        }
        return Object.values(obj).some((value) => value === '')
      } else if (baseFormData.platform === 0 && isCardType) {
        const obj = {
          platform: baseFormData.platform,
          cardType: baseFormData.cardType,
          cardNum: baseFormData.cardNum,
          name: baseFormData.name,
          custNum: baseFormData.custNum,
        }
        return Object.values(obj).some((value) => value === '')
      } else {
        const obj = {
          platform: baseFormData.platform,
          province: baseFormData.province,
          city: baseFormData.city,
          cardType: baseFormData.cardType,
          cardNum: baseFormData.cardNum,
          name: baseFormData.name,
        }
        return Object.values(obj).some((value) => value === '')
      }
    }
    return false
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

  // 查询客户
  const handleSearchCust = () => {
    console.log('查询客户', baseFormData)
    // TODO: 调用查询客户接口
  }

  // 下一步
  const nextStep = () => {
    console.log('下一步', baseFormData)
    // TODO: 处理下一步逻辑
  }

  return (
    <View className={styles["real-name-page"]}>
      <CTNavbar title="经办人实名认证">
        <Navbar.NavLeft onClick={() => Taro.navigateBack()} />
      </CTNavbar>
      <View className={styles["real-name-content"]}>
        <FormTitle title="请填写你的信息" />
        <Form>
          <Cell.Group inset>
            {/* 平台选择 */}
            <Field label="平台" isLink onClick={() => setPlatformPickerOpen(true)}>
              <Input
                readonly
                placeholder="请选择平台"
                value={platformArr.find((item) => Number(item.value) === baseFormData.platform)?.label || ''}
              />
            </Field>
            <Popup
              open={platformPickerOpen}
              rounded
              placement="bottom"
              onClose={() => setPlatformPickerOpen(false)}
            >
              <Picker
                columns={[platformArr]}
                value={String(baseFormData.platform)}
                onCancel={() => setPlatformPickerOpen(false)}
                onConfirm={(value) => {
                  setBaseFormData({ ...baseFormData, platform: Number(value) })
                  setPlatformPickerOpen(false)
                }}
              />
            </Popup>

            {/* 省市选择 */}
            {baseFormData.platform === 0 && !isCardType && (
              <>
                <Field label="省份" isLink onClick={() => setProvincePickerOpen(true)}>
                  <Input
                    readonly
                    placeholder="请选择省份"
                    value={provinceArr.find((item) => item.value === baseFormData.province)?.label || ''}
                  />
                </Field>
                <Popup
                  open={provincePickerOpen}
                  rounded
                  placement="bottom"
                  onClose={() => setProvincePickerOpen(false)}
                >
                  <Picker
                    columns={[provinceArr]}
                    value={baseFormData.province}
                    onCancel={() => setProvincePickerOpen(false)}
                    onConfirm={(value) => {
                      setBaseFormData({ ...baseFormData, province: value as string })
                      setProvincePickerOpen(false)
                      // TODO: 根据省份加载城市数据
                    }}
                  />
                </Popup>
                <Field label="城市" isLink onClick={() => setCityPickerOpen(true)}>
                  <Input
                    readonly
                    placeholder="请选择城市"
                    value={cityArr.find((item) => item.value === baseFormData.city)?.label || ''}
                  />
                </Field>
                <Popup
                  open={cityPickerOpen}
                  rounded
                  placement="bottom"
                  onClose={() => setCityPickerOpen(false)}
                >
                  <Picker
                    columns={[cityArr]}
                    value={baseFormData.city}
                    onCancel={() => setCityPickerOpen(false)}
                    onConfirm={(value) => {
                      setBaseFormData({ ...baseFormData, city: value as string })
                      setCityPickerOpen(false)
                    }}
                  />
                </Popup>
              </>
            )}

            {/* 证件类型 */}
            <Field label="客户证件类型" isLink onClick={() => setCardTypePickerOpen(true)}>
              <Input
                readonly
                placeholder="请选择客户证件类型"
                value={
                  (baseFormData.platform === 1 ? cardArr : cmpCardArr).find(
                    (item) => item.value === baseFormData.cardType
                  )?.label || ''
                }
              />
            </Field>
            <Popup
              open={cardTypePickerOpen}
              rounded
              placement="bottom"
              onClose={() => setCardTypePickerOpen(false)}
            >
              <Picker
                columns={[baseFormData.platform === 1 ? cardArr : cmpCardArr]}
                value={baseFormData.cardType}
                onCancel={() => setCardTypePickerOpen(false)}
                onConfirm={(value) => {
                  setBaseFormData({ ...baseFormData, cardType: value as string })
                  setCardTypePickerOpen(false)
                }}
              />
            </Popup>

            {/* 证件号码 */}
            <Field label="企业证件号码">
              <Input
                placeholder={isCardType ? '请输入号卡信息' : '请输入企业证件号码'}
                value={baseFormData.cardNum}
                maxlength={baseFormData.cardType === '49' ? 20 : 60}
                onChange={(e) =>
                  setBaseFormData({ ...baseFormData, cardNum: e.detail.value })
                }
              />
              <Button
                size="small"
                color="primary"
                onClick={handleSearchCust}
              >
                查询客户
              </Button>
            </Field>

            {/* 客户编码 */}
            {baseFormData.platform === 0 && isCardType && (
              <Field label="客户编码">
                <Input
                  placeholder="客户编码展示框"
                  value={baseFormData.custNum}
                  maxlength={16}
                  disabled={isCardType}
                  onChange={(e) =>
                    setBaseFormData({ ...baseFormData, custNum: e.detail.value })
                  }
                />
              </Field>
            )}

            {/* 客户名称 */}
            <Field label="客户名称" isLink onClick={() => setNamePickerOpen(true)}>
              <Input
                readonly
                placeholder="请选择客户名称"
                value={nameArr.find((item) => item.value === baseFormData.name)?.label || ''}
              />
            </Field>
            <Popup
              open={namePickerOpen}
              rounded
              placement="bottom"
              onClose={() => setNamePickerOpen(false)}
            >
              <Picker
                columns={[nameArr]}
                value={baseFormData.name}
                onCancel={() => setNamePickerOpen(false)}
                onConfirm={(value) => {
                  setBaseFormData({ ...baseFormData, name: value as string })
                  setNamePickerOpen(false)
                }}
              />
            </Popup>
          </Cell.Group>
        </Form>

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
          {nextBtn()}
        </Button>
      </View>

      {/* 用户协议/隐私政策弹窗 */}
      <Dialog open={show} title="提示" onConfirm={dialogConfirm} onCancel={dialogCancel}>
        <View>{dialogContent}</View>
      </Dialog>
    </View>
  )
}

export default OperatorRealName
