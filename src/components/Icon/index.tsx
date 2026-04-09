import { Image } from '@tarojs/components'
import { FC, CSSProperties } from 'react'

interface IconProps {
  type: 'refresh' | 'close' | 'card'
  size?: number
  color?: string
  className?: string
  style?: CSSProperties
  onClick?: () => void
}

// SVG 模板
const refreshSvg = (color: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="m400 148-21.12-24.57A191.43 191.43 0 0 0 240 64C134 64 48 150 48 256s86 192 192 192a192.09 192.09 0 0 0 181.07-128" fill="none" stroke="${color}" stroke-linecap="square" stroke-miterlimit="10" stroke-width="32"/><path d="M464 68.45V220a4 4 0 0 1-4 4H308.45a4 4 0 0 1-2.83-6.83L457.17 65.62a4 4 0 0 1 6.83 2.83z" fill="${color}"/></svg>`

const closeSvg = (color: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 36"><path d="m19.41 18 8.29-8.29a1 1 0 0 0-1.41-1.41L18 16.59l-8.29-8.3a1 1 0 0 0-1.42 1.42l8.3 8.29-8.3 8.29A1 1 0 1 0 9.7 27.7l8.3-8.29 8.29 8.29a1 1 0 0 0 1.41-1.41z" fill="${color}"/></svg>`

// Card SVG - 物联网卡图标
const cardSvg = () =>
  `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.8884 15.4897C8.14194 15.9804 7.94972 16.5837 7.45907 16.8372C5.12173 18.045 4 19.5734 4 21C4 22.3889 5.06077 23.8734 7.28171 25.0693C9.46192 26.2433 12.5425 27 16 27C19.4575 27 22.5381 26.2433 24.7183 25.0693C26.9392 23.8734 28 22.3889 28 21C28 19.5734 26.8783 18.045 24.5409 16.8372C24.0503 16.5837 23.8581 15.9804 24.1116 15.4897C24.3651 14.9991 24.9684 14.8069 25.4591 15.0604C28.0524 16.4005 30 18.4564 30 21C30 23.4772 28.1506 25.4927 25.6665 26.8303C23.1416 28.1898 19.7222 29 16 29C12.2778 29 8.85838 28.1898 6.33351 26.8303C3.84938 25.4927 2 23.4772 2 21C2 18.4564 3.94759 16.4005 6.54093 15.0604C7.03158 14.8069 7.63487 14.9991 7.8884 15.4897Z" fill="#4C596D"/><path fill-rule="evenodd" clip-rule="evenodd" d="M15.0287 3.12022C15.6328 2.78464 16.3672 2.78464 16.9713 3.12022L24.9713 7.56466C25.6062 7.9174 26 8.58664 26 9.31297V18.1362C26 18.8625 25.6062 19.5317 24.9713 19.8845L16.9713 24.3289C16.3672 24.6645 15.6328 24.6645 15.0287 24.3289L7.02871 19.8845C6.39379 19.5317 6 18.8625 6 18.1362V9.31298C6 8.58664 6.39378 7.9174 7.02871 7.56466L15.0287 3.12022ZM8 10.4241V18.1362L15 22.0251L15 14.313L8 10.4241ZM17 14.313L17 22.0251L24 18.1362V10.4241L17 14.313ZM22.9409 8.72457L16 4.86853L9.05913 8.72457L16 12.5806L22.9409 8.72457Z" fill="#3460F5"/></svg>`

// 将颜色转换为十六进制格式
const colorToHex = (color: string): string => {
  if (color === 'currentColor' || color.startsWith('#')) {
    return '#666666' // 默认灰色
  }
  return color
}

const Icon: FC<IconProps> = ({
  type,
  size = 24,
  color = 'currentColor',
  className,
  style,
  onClick,
}) => {
  let svgString: string

  if (type === 'card') {
    svgString = cardSvg()
  } else {
    const hexColor = colorToHex(color)
    svgString = type === 'refresh' ? refreshSvg(hexColor) : closeSvg(hexColor)
  }

  // 使用 URL 编码方式，兼容小程序环境
  const encodedSvg = encodeURIComponent(svgString).replace(/'/g, '%27').replace(/"/g, '%22')
  const dataUrl = `data:image/svg+xml,${encodedSvg}`

  const iconStyle: CSSProperties = {
    width: `${size}px`,
    height: `${size}px`,
    ...style,
  }

  return (
    <Image
      className={className}
      style={iconStyle}
      src={dataUrl}
      onClick={onClick}
      mode="aspectFit"
    />
  )
}

Icon.displayName = 'Icon'

export default Icon
