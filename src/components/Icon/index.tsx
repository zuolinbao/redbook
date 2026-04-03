import { Image } from '@tarojs/components'
import { FC, CSSProperties } from 'react'

interface IconProps {
  type: 'refresh' | 'close'
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
  const hexColor = colorToHex(color)
  const svgString = type === 'refresh' ? refreshSvg(hexColor) : closeSvg(hexColor)
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
