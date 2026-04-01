import React, { useState, useEffect } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { Form, Input, Button, Cell, Picker } from '@taroify/core'
import styles from './index.module.scss'

const ResponsibleRealName = () => {
  const [active, setActive] = useState(0)

  // 基础信息表单数据
  const [baseFormData, setBaseFormData] = useState({
    platform: 0, // 平台
    province: '', // 省
    city: '', // 市
    cardType: '', // 证件类型
    cardNum: '', // 企业证件号码
    name: '', // 客户名称
    contacts: '', // 联系人姓名
    contactPhone: '', // 联系人号码
    custNum: '',
  })

  // 平台选项
  const platformArr = [
    { value: 0, text: 'CMP平台' },
    { value: 1, text: 'DCP平台' },
  ]

  // CMP平台证件类型
  const cmpCardArr = [
    { value: '999', text: '客户编码' },
    { value: '49', text: '统一社会信用代码证书' },
    { value: '499', text: '请输入8986/149/141/10649/开头的号' },
  ]

  // DCP平台证件类型
  const cardArr = [
    { value: '6', text: '营业执照' },
    { value: '7', text: '单位介绍信/公函+公章(仅用于党政军客户)' },
    { value: '15', text: '组织机构代码证' },
    { value: '39', text: '税务登记号' },
    { value: '49', text: '统一社会信用代码证书' },
    { value: '34', text: '事业单位法人证书' },
    { value: '43', text: '社会团体法人登记证书' },
    { value: '499', text: '请输入8986/149/141/10649/开头的号' },
  ]

  // 省份数据（示例）
  const [provinceArr, setProvinceArr] = useState([
    { value: '110000', text: '北京市' },
    { value: '310000', text: '上海市' },
    { value: '440000', text: '广东省' },
  ])

  // 城市数据（示例）
  const [cityArr, setCityArr] = useState([])

  // 客户名称数据
  const [nameArr, setNameArr] = useState([])

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
          contacts: baseFormData.contacts,
          contactPhone: baseFormData.contactPhone,
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
          contacts: baseFormData.contacts,
          contactPhone: baseFormData.contactPhone,
        }
        return Object.values(obj).some((value) => value === '')
      }
    }
    return false
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
      <View className={styles["real-index"]}>
        <View className={styles["real-name-content"]}>
          {active === 0 && (
            <View className={styles["form-content"]}>
              <View className={styles["form-main"]}>
                <View className={styles["form-title"]}>请填写你的信息</View>
                <Form>
                  <Cell.Group inset>
                    {/* 平台选择 */}
                    <Cell title="平台" align="center">
                      <Picker
                        columns={[platformArr]}
                        value={baseFormData.platform}
                        onConfirm={(value) =>
                          setBaseFormData({ ...baseFormData, platform: value })
                        }
                      >
                        {({ value, open }) => (
                          <Cell
                            title={platformArr.find((item) => item.value === value)?.text || '请选择平台'}
                            isLink
                            onClick={open}
                          />
                        )}
                      </Picker>
                    </Cell>

                    {/* 省市选择 */}
                    {baseFormData.platform === 0 && !isCardType && (
                      <>
                        <Cell title="省份" align="center">
                          <Picker
                            columns={[provinceArr]}
                            value={baseFormData.province}
                            onConfirm={(value) => {
                              setBaseFormData({ ...baseFormData, province: value })
                              // TODO: 根据省份加载城市数据
                            }}
                          >
                            {({ value, open }) => (
                              <Cell
                                title={provinceArr.find((item) => item.value === value)?.text || '请选择省'}
                                isLink
                                onClick={open}
                              />
                            )}
                          </Picker>
                        </Cell>
                        <Cell title="城市" align="center">
                          <Picker
                            columns={[cityArr]}
                            value={baseFormData.city}
                            onConfirm={(value) => setBaseFormData({ ...baseFormData, city: value })}
                          >
                            {({ value, open }) => (
                              <Cell
                                title={cityArr.find((item) => item.value === value)?.text || '请选择市'}
                                isLink
                                onClick={open}
                              />
                            )}
                          </Picker>
                        </Cell>
                      </>
                    )}

                    {/* 证件类型 */}
                    <Cell title="客户证件类型" align="center">
                      <Picker
                        columns={[baseFormData.platform === 1 ? cardArr : cmpCardArr]}
                        value={baseFormData.cardType}
                        onConfirm={(value) => setBaseFormData({ ...baseFormData, cardType: value })}
                      >
                        {({ value, open }) => (
                          <Cell
                            title={
                              (baseFormData.platform === 1 ? cardArr : cmpCardArr).find(
                                (item) => item.value === value
                              )?.text || '请选择客户证件类型'
                            }
                            isLink
                            onClick={open}
                          />
                        )}
                      </Picker>
                    </Cell>

                    {/* 证件号码 */}
                    <Cell title="企业证件号码">
                      <Input
                        placeholder={isCardType ? '请输入号卡信息' : '请输入企业证件号码'}
                        value={baseFormData.cardNum}
                        maxlength={baseFormData.cardType === '49' ? 20 : 60}
                        onChange={(e) =>
                          setBaseFormData({ ...baseFormData, cardNum: e.detail.value })
                        }
                      />
                      <View className={styles["codeButton"]} onClick={handleSearchCust}>
                        查询客户
                      </View>
                    </Cell>

                    {/* 客户编码 */}
                    <Cell title="客户编码">
                      <Input
                        placeholder="客户编码展示框"
                        value={baseFormData.custNum}
                        maxlength={16}
                        disabled={isCardType}
                        onChange={(e) =>
                          setBaseFormData({ ...baseFormData, custNum: e.detail.value })
                        }
                      />
                    </Cell>

                    {/* 客户名称 */}
                    <Cell title="客户名称" align="center">
                      <Picker
                        columns={[nameArr]}
                        value={baseFormData.name}
                        onConfirm={(value) => setBaseFormData({ ...baseFormData, name: value })}
                      >
                        {({ value, open }) => (
                          <Cell
                            title={nameArr.find((item) => item.value === value)?.text || '请选择客户名称'}
                            isLink
                            onClick={open}
                          />
                        )}
                      </Picker>
                    </Cell>

                    {/* 联系人姓名 */}
                    {baseFormData.platform === 0 && (
                      <Cell title="联系人姓名">
                        <Input
                          placeholder="请输入联系人姓名"
                          value={baseFormData.contacts}
                          maxlength={16}
                          onChange={(e) =>
                            setBaseFormData({ ...baseFormData, contacts: e.detail.value })
                          }
                        />
                      </Cell>
                    )}

                    {/* 联系人号码 */}
                    {baseFormData.platform === 0 && (
                      <Cell title="联系人号码">
                        <Input
                          placeholder="请输入联系号码"
                          value={baseFormData.contactPhone}
                          maxlength={20}
                          type="number"
                          onChange={(e) =>
                            setBaseFormData({ ...baseFormData, contactPhone: e.detail.value })
                          }
                        />
                      </Cell>
                    )}
                  </Cell.Group>
                </Form>
              </View>
            </View>
          )}
          <View className="tips">提示：获取客户名称请点击查询客户</View>
          <View className="tips">
            请确认客户编码与物联网CRM受理的客户编码一致，避免实名信息同步失败
          </View>
          <Button
            className={isdisabled() ? styles['disabledBtn'] : styles['nextBtn']}
            disabled={isdisabled()}
            onClick={nextStep}
          >
            {nextBtn()}
          </Button>
        </View>
      </View>
    </View>
  )
}

export default ResponsibleRealName
