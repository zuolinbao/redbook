import { View, Text, Image, MovableArea, MovableView } from '@tarojs/components'
import { useState, useRef, useCallback, forwardRef, useImperativeHandle } from 'react'
import Taro from '@tarojs/taro'
import { httpPost } from '../../utils/http'
import styles from './index.module.scss'
import Icon from '../Icon'

// 滑动验证码数据接口
interface CaptchaData {
  id: string | null
  backgroundImage: string
  sliderImage: string
  startTime: Date
  trackArr: TrackPoint[]
  movePercent: number
  backgroundImageWidth: number
  backgroundImageHeight: number
  sliderImageWidth: number
  sliderImageHeight: number
  end: number
  startX: number
  startY: number
  stopTime: Date
  moveX: number
}

// 轨迹点接口
interface TrackPoint {
  x: number
  y: number
  type: 'down' | 'move' | 'up'
  t: number
}

const buildTrackList = (endX: number, durationMs: number): TrackPoint[] => {
  const distance = Math.max(0, endX)
  const pointCount = Math.max(12, Math.min(60, Math.round(distance / 4)))
  const list: TrackPoint[] = []

  for (let i = 0; i < pointCount; i++) {
    const progress = pointCount === 1 ? 1 : i / (pointCount - 1)
    const eased = 1 - (1 - progress) ** 2
    const x = Number((distance * eased).toFixed(2))
    const y = Number((Math.sin(i / 2) * 2 + (i % 5 === 0 ? 0.5 : 0)).toFixed(2))
    const t = Math.round(durationMs * (progress ** 1.25))
    const type: TrackPoint['type'] = i === 0 ? 'down' : (i === pointCount - 1 ? 'up' : 'move')
    list.push({ x, y, t, type })
  }

  return list
}

// 组件属性接口
interface SliderVerifyProps {
  onSuccess: (captchaId: string) => void
}

// 验证码响应接口
interface CaptchaResponse {
  id: string
  backgroundImage: string
  templateImage: string
  backgroundImageWidth: number
  backgroundImageHeight: number
  templateImageWidth: number
  templateImageHeight: number
}

const getRpx2Px = (rpx: number) => {
    try {
      const info = Taro.getSystemInfoSync()
      return (info.windowWidth / 750) * rpx
    } catch (e) {
      return rpx / 2
    }
  }

  const baseWidth = getRpx2Px(80)

  const SliderVerify = forwardRef<{ open: () => void; close: () => void }, SliderVerifyProps>(
    ({ onSuccess }, ref) => {
      const [verifyShow, setVerifyShow] = useState(false)
      const [isActive, setIsActive] = useState(true)
      const [colorWidth, setColorWidth] = useState(baseWidth)
    const [leftDistance, setLeftDistance] = useState(0)
    const [isSuccess, setIsSuccess] = useState(false)
    const [isErr, setIsErr] = useState(false)
    const [errorText, setErrorText] = useState('验证失败，请重新尝试！')
    const [x, setX] = useState(0)
    // 使用 state 存储图片数据，确保组件重新渲染
    const [bgImage, setBgImage] = useState('')
    const [sliderImg, setSliderImg] = useState('')
    const xpos = useRef(0)

    const bgImgRef = useRef({ width: 0, height: 0 })
    const sliderImgRef = useRef({ width: 0, height: 0 })

    const captchaDataRef = useRef<CaptchaData>({
      id: null,
      backgroundImage: '',
      sliderImage: '',
      startTime: new Date(),
      trackArr: [],
      movePercent: 0,
      backgroundImageWidth: 0,
      backgroundImageHeight: 0,
      sliderImageWidth: 0,
      sliderImageHeight: 0,
      end: 206,
      startX: 0,
      startY: 0,
      stopTime: new Date(),
      moveX: 0,
    })

    // 防抖函数
    const debounceTimer = useRef<NodeJS.Timeout | null>(null)
    const debounce = useCallback((func: () => void, delay: number) => {
      return () => {
        if (debounceTimer.current) clearTimeout(debounceTimer.current)
        debounceTimer.current = setTimeout(() => {
          func()
        }, delay)
      }
    }, [])

    // 获取验证码数据
    const getVerifyData = useCallback(async () => {
      try {
        // 调用后端接口获取验证码数据
        const data = await httpPost<CaptchaResponse>('/captcha/generate', {
          type: '2', // 默认使用滑块验证码类型
        })

        console.log('获取验证码数据:', data)

        captchaDataRef.current.id = data.id
        captchaDataRef.current.backgroundImage = data.backgroundImage
        captchaDataRef.current.sliderImage = data.templateImage
        captchaDataRef.current.backgroundImageWidth = data.backgroundImageWidth
        captchaDataRef.current.backgroundImageHeight = data.backgroundImageHeight
        captchaDataRef.current.sliderImageWidth = data.templateImageWidth
        captchaDataRef.current.sliderImageHeight = data.templateImageHeight

        // 更新 state 触发重新渲染
        setBgImage(data.backgroundImage)
        setSliderImg(data.templateImage)

        // 获取图片实际尺寸
        setTimeout(() => {
          const query = Taro.createSelectorQuery()
          query.select('#bg').boundingClientRect((res: any) => {
            if (res) {
              bgImgRef.current.width = res.width
              bgImgRef.current.height = res.height
            }
          }).exec()
          query.select('#slider-img').boundingClientRect((res: any) => {
            if (res) {
              sliderImgRef.current.width = res.width
              sliderImgRef.current.height = res.height
            }
          }).exec()
          setTimeout(() => {
            captchaDataRef.current.end = bgImgRef.current.width - getRpx2Px(40)
            initConfig(
              bgImgRef.current.width,
              bgImgRef.current.height,
              sliderImgRef.current.width,
              sliderImgRef.current.height,
              captchaDataRef.current.end
            )
          }, 500)
        }, 0)
      } catch (error) {
        console.error('获取验证码异常:', error)
        Taro.showToast({
          title: '获取验证码异常',
          icon: 'none',
        })
      }
    }, [])

    // 初始化配置
    const initConfig = useCallback((
      bgImageWidth: number,
      bgImageHeight: number,
      sliderImageWidth: number,
      sliderImageHeight: number,
      end: number
    ) => {
      captchaDataRef.current.backgroundImageWidth = bgImageWidth
      captchaDataRef.current.backgroundImageHeight = bgImageHeight
      captchaDataRef.current.sliderImageWidth = sliderImageWidth
      captchaDataRef.current.sliderImageHeight = sliderImageHeight
      captchaDataRef.current.end = end
    }, [])

    // 打开验证码
    const open = useCallback(() => {
      debounce(getVerifyData, 80)()
      setVerifyShow(true)
    }, [debounce, getVerifyData])

    // 关闭验证码
    const close = useCallback(() => {
      setVerifyShow(false)
      setTimeout(() => {
        captchaDataRef.current = {
          id: null,
          backgroundImage: '',
          sliderImage: '',
          startTime: new Date(),
          trackArr: [],
          movePercent: 0,
          backgroundImageWidth: 0,
          backgroundImageHeight: 0,
          sliderImageWidth: 0,
          sliderImageHeight: 0,
          end: 206,
          startX: 0,
          startY: 0,
          stopTime: new Date(),
          moveX: 0,
        }
        setIsActive(false)
        setTimeout(() => {
          setIsActive(true)
        }, 0)
        setColorWidth(baseWidth)
        setX(xpos.current)
        setTimeout(() => {
          setX(0)
          setColorWidth(baseWidth)
        }, 0)
        setIsErr(false)
        setIsSuccess(false)
        setLeftDistance(0)
        setBgImage('')
        setSliderImg('')
      }, 0)
    }, [])

    // 暴露方法给父组件
    useImperativeHandle(ref, () => ({
      open,
      close,
    }))

    const touchstart = useCallback((e: any) => {
      const touch = e.changedTouches ? e.changedTouches[0] : e.touches[0]
      if (!touch) return

      captchaDataRef.current.startTime = new Date()
      captchaDataRef.current.trackArr = []
      const startX = touch.pageX
      const startY = touch.pageY

      captchaDataRef.current.startX = startX
      captchaDataRef.current.startY = startY

      const pageX = captchaDataRef.current.startX
      const pageY = captchaDataRef.current.startY

      const startTime = captchaDataRef.current.startTime
      const trackArr = captchaDataRef.current.trackArr

      trackArr.push({ x: pageX - startX, y: pageY - startY, type: 'down', t: new Date().getTime() - startTime.getTime() })
    }, [])

    // 触摸移动
    const touchmove = useCallback((e: any) => {
      const touch = e.changedTouches ? e.changedTouches[0] : e.touches[0]
      if (!touch) return

      const pageX = Math.round(touch.pageX)
      const pageY = Math.round(touch.pageY)
      const startX = captchaDataRef.current.startX
      const startY = captchaDataRef.current.startY
      const startTime = captchaDataRef.current.startTime
      const end = captchaDataRef.current.end
      const bgImageWidth = captchaDataRef.current.backgroundImageWidth
      const trackArr = captchaDataRef.current.trackArr
      let moveX = pageX - startX
      const track = {
        x: pageX - startX,
        y: pageY - startY,
        type: 'move' as const,
        t: new Date().getTime() - startTime.getTime(),
      }
      trackArr.push(track)
      if (moveX < 0) {
        moveX = 0
      } else if (moveX > end) {
        moveX = end
      }
      captchaDataRef.current.moveX = moveX
      captchaDataRef.current.movePercent = moveX / bgImageWidth
    }, [])

    // 刷新验证码
    const refresh = useCallback(() => {
      // 重置滑块位置
      setX(0)
      setLeftDistance(0)
      setColorWidth(baseWidth)
      // 清除状态
      setIsErr(false)
      setIsSuccess(false)
      captchaDataRef.current.trackArr = []
      // 重新获取验证码
      getVerifyData()
    }, [getVerifyData, baseWidth])

    const setVertifyData = useCallback(async () => {
      try {
        const res = await httpPost<boolean>('/captcha/check', {
          id: captchaDataRef.current.id,
          data: {
            bgImageWidth: captchaDataRef.current.backgroundImageWidth,
            bgImageHeight: captchaDataRef.current.backgroundImageHeight,
            templateImageWidth: captchaDataRef.current.sliderImageWidth,
            templateImageHeight: captchaDataRef.current.sliderImageHeight,
            startTime: captchaDataRef.current.startTime.getTime(),
            stopTime: captchaDataRef.current.stopTime.getTime(),
            trackList: captchaDataRef.current.trackArr.map((track: TrackPoint) => ({
              x: track.x,
              y: track.y,
              type: track.type,
              t: track.t,
            })),
          },
        })

        if (res) {
          setIsSuccess(true)
          setTimeout(() => {
            close()
            if (captchaDataRef.current.id) {
              onSuccess(captchaDataRef.current.id)
            }
          }, 1000)
        } else {
          setIsErr(true)
          setErrorText('验证失败，请重新尝试！')
          setTimeout(() => {
            refresh()
          }, 1000)
        }
      } catch (error: any) {
        console.error('验证码验证异常:', error)
        setIsErr(true)
        setErrorText(error?.msg || error?.message || '验证失败，请重新尝试！')
        setTimeout(() => {
          refresh()
        }, 1000)
      }
    }, [close, onSuccess, refresh])

    const touchend = useCallback((e: any) => {
      const touch = e.changedTouches ? e.changedTouches[0] : e.touches[0]
      if (!touch) return

      const startTime = captchaDataRef.current.startTime.getTime()
      const now = Date.now()
      const durationMs = Math.max(350, now - startTime)
      captchaDataRef.current.stopTime = new Date(startTime + durationMs)
      captchaDataRef.current.trackArr = buildTrackList(xpos.current, durationMs)
      setVertifyData()
    }, [setVertifyData])

    // 开始移动
    const StartMove = useCallback((e: any) => {
      xpos.current = e.detail.x
      setTimeout(() => {
        setColorWidth(xpos.current + baseWidth)
        setLeftDistance(xpos.current)
      }, 0)
    }, [])

    if (!verifyShow) return null

    return (
      <View className={styles['verify-wrap']} catchMove>
        <View className={styles['verify-code']}>
          <View className={styles['verify-tip']}>
            拖动下方滑块完成拼图
          </View>
          <View className={styles['verify-content']}>
            <View className={styles['verify-body']}>
              <View className={styles['verify-bg']}>
                {bgImage && (
                  <Image
                    id='bg'
                    src={bgImage}
                    mode='heightFix'
                    className={styles['bg-image']}
                  />
                )}
              </View>
              <View className={styles['verify-slider']}>
                {sliderImg && (
                  <Image
                    id='slider-img'
                    style={{ left: `${leftDistance}px` }}
                    src={sliderImg}
                    mode='heightFix'
                    className={styles['slider-image']}
                  />
                )}
              </View>
              {isSuccess && (
                <View className={`${styles['check-status']} ${styles['check-success']}`}>
                  <Text>验证成功</Text>
                </View>
              )}
              {isErr && (
                <View className={`${styles['check-status']} ${styles['check-error']}`}>
                  <Text>{errorText}</Text>
                </View>
              )}
            </View>
            {isActive && (
              <View
                className={styles['move-area']}
                onTouchStart={touchstart}
                onTouchMove={touchmove}
                onTouchEnd={touchend}
              >
                <MovableArea className={styles['move-block']}>
                  <View className={styles['color-change']} style={{ width: `${colorWidth}px` }} />
                  <View className={styles['move-shadow']} />
                  <MovableView
                    className={styles['block-button']}
                    x={x}
                    direction='horizontal'
                    onChange={StartMove}
                  >
                    <Text className={styles['icon-drag']}>➜</Text>
                  </MovableView>
                </MovableArea>
              </View>
            )}
          </View>
          <View className={styles['verify-opts']}>
            <Icon type="refresh" size={20} className={styles['icon-btn']} onClick={refresh} />
            <View className={styles.divide} />
            <Icon type="close" size={20} className={styles['icon-btn']} onClick={() => setVerifyShow(false)} />
          </View>
        </View>
      </View>
    )
  }
)

SliderVerify.displayName = 'SliderVerify'

export default SliderVerify
