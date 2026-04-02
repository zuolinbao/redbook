import { Navbar } from '@taroify/core'
import ConfigProvider from '@taroify/core/config-provider'
import type { ConfigProviderThemeVars } from '@taroify/core/config-provider'
import { getEnv, ENV_TYPE } from '@tarojs/taro'
import type { ReactNode } from 'react'

interface CTNavbarProps {
  title: string
  children?: ReactNode
}

// Navbar 主题变量 - 灰黑色返回按钮
const themeVars: ConfigProviderThemeVars = {
  navbarIconColor: '#323233',
  navbarTextColor: '#323233',
}

/**
 * 平台适配的 Navbar 组件
 * - H5: 显示自定义 Navbar（带灰黑色返回按钮主题）
 * - 微信小程序: 使用原生导航栏，不显示自定义 Navbar
 *
 * 使用示例：
 * <CTNavbar title="页面标题">
 *   <Navbar.NavLeft onClick={() => Taro.navigateBack()} />
 * </CTNavbar>
 */
const CTNavbar = ({ title, children }: CTNavbarProps) => {
  // H5 环境下显示 Navbar
  if (getEnv() === ENV_TYPE.WEB) {
    return (
      <ConfigProvider theme={themeVars}>
        <Navbar title={title} nativeSafeTop placeholder>
          {children}
        </Navbar>
      </ConfigProvider>
    )
  }

  // 微信小程序使用原生导航栏，返回空
  return null
}

export default CTNavbar
