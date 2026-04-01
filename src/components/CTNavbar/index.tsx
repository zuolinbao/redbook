import { Navbar } from '@taroify/core'
import Taro, { getEnv, ENV_TYPE } from '@tarojs/taro'
import type { ReactNode } from 'react'

interface CTNavbarProps {
  title: string
  children?: ReactNode
}

/**
 * 平台适配的 Navbar 组件
 * - H5: 显示自定义 Navbar
 * - 微信小程序: 使用原生导航栏，不显示自定义 Navbar
 *
 * 使用示例：
 * <CTNavbar title="页面标题">
 *   <CTNavbar.NavLeft onClick={() => Taro.navigateBack()} />
 * </CTNavbar>
 */
const CTNavbar = ({ title, children }: CTNavbarProps) => {
  // H5 环境下显示 Navbar
  if (getEnv() === ENV_TYPE.WEB) {
    return (
      <Navbar title={title} nativeSafeTop placeholder>
        {children}
      </Navbar>
    )
  }

  // 微信小程序使用原生导航栏，返回空
  return null
}

/**
 * Navbar 左侧返回按钮组件
 * 仅在 H5 环境下有效
 */
CTNavbar.NavLeft = ({ onClick }: { onClick?: () => void }) => {
  if (getEnv() === ENV_TYPE.WEB) {
    return <Navbar.NavLeft onClick={onClick} />
  }
  return null
}

export default CTNavbar
