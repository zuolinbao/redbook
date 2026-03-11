import { View, Text, Image, Textarea, ScrollView } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import styles from './index.module.scss'

export default function Publish() {
  const [content, setContent] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [selectedTopic, setSelectedTopic] = useState('')
  const [selectedLocation, setSelectedLocation] = useState('')

  const topics = ['穿搭', '美食', '旅行', '美妆', '健身', '家居', '数码', '读书']

  const handleChooseImage = () => {
    Taro.chooseImage({
      count: 9 - images.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        setImages([...images, ...res.tempFilePaths])
      }
    })
  }

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }

  const handlePublish = () => {
    if (!content.trim() && images.length === 0) {
      Taro.showToast({
        title: '请输入内容或添加图片',
        icon: 'none'
      })
      return
    }

    Taro.showLoading({ title: '发布中...' })
    setTimeout(() => {
      Taro.hideLoading()
      Taro.showToast({
        title: '发布成功',
        icon: 'success'
      })
      setContent('')
      setImages([])
      setSelectedTopic('')
      setSelectedLocation('')
    }, 1500)
  }

  return (
    <View className={styles['publish-page']}>
      <ScrollView scrollY className={styles['content-scroll']}>
        <View className={styles['input-section']}>
          <Textarea 
            className={styles['content-input']}
            placeholder='分享你的生活点滴...'
            value={content}
            onInput={(e) => setContent(e.detail.value)}
            maxlength={1000}
          />
          <View className={styles['word-count']}>
            <Text>{content.length}/1000</Text>
          </View>
        </View>

        <View className={styles['images-section']}>
          <View className={styles['images-grid']}>
            {images.map((img, index) => (
              <View key={index} className={styles['image-item']}>
                <Image src={img} mode='aspectFill' className={styles['preview-image']} />
                <View className={styles['remove-btn']} onClick={() => handleRemoveImage(index)}>
                  <Text>×</Text>
                </View>
              </View>
            ))}
            {images.length < 9 && (
              <View className={styles['add-image']} onClick={handleChooseImage}>
                <Text className={styles['add-icon']}>+</Text>
                <Text className={styles['add-text']}>添加图片</Text>
              </View>
            )}
          </View>
        </View>

        <View className={styles['options-section']}>
          <View className={styles['option-item']} onClick={() => {}}>
            <Text className={styles['option-icon']}>📍</Text>
            <Text className={styles['option-label']}>添加位置</Text>
            {selectedLocation ? (
              <Text className={styles['option-value']}>{selectedLocation}</Text>
            ) : (
              <Text className={styles['option-arrow']}>›</Text>
            )}
          </View>

          <View className={styles['option-item']} onClick={() => {}}>
            <Text className={styles['option-icon']}>🏷️</Text>
            <Text className={styles['option-label']}>添加话题</Text>
            {selectedTopic ? (
              <Text className={styles['option-value']}>{selectedTopic}</Text>
            ) : (
              <Text className={styles['option-arrow']}>›</Text>
            )}
          </View>

          <View className={styles['option-item']}>
            <Text className={styles['option-icon']}>👁️</Text>
            <Text className={styles['option-label']}>公开可见</Text>
            <Text className={styles['option-switch']}>✓</Text>
          </View>
        </View>

        <View className={styles['topics-section']}>
          <Text className={styles['section-title']}>热门话题</Text>
          <View className={styles['topics-list']}>
            {topics.map(topic => (
              <View 
                key={topic} 
                className={`${styles['topic-tag']} ${selectedTopic === topic ? styles.active : ''}`}
                onClick={() => setSelectedTopic(selectedTopic === topic ? '' : topic)}
              >
                <Text>#{topic}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View className={styles['bottom-bar']}>
        <View className={styles['draft-btn']}>
          <Text>存草稿</Text>
        </View>
        <View className={styles['publish-btn']} onClick={handlePublish}>
          <Text>发布</Text>
        </View>
      </View>
    </View>
  )
}
