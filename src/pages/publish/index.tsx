import { View, Text, Image, Textarea, Button, ScrollView } from '@tarojs/components'
import { useState } from 'react'
import Taro from '@tarojs/taro'
import './index.scss'

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
    <View className='publish-page'>
      <ScrollView scrollY className='content-scroll'>
        <View className='input-section'>
          <Textarea 
            className='content-input'
            placeholder='分享你的生活点滴...'
            value={content}
            onInput={(e) => setContent(e.detail.value)}
            maxlength={1000}
          />
          <View className='word-count'>
            <Text>{content.length}/1000</Text>
          </View>
        </View>

        <View className='images-section'>
          <View className='images-grid'>
            {images.map((img, index) => (
              <View key={index} className='image-item'>
                <Image src={img} mode='aspectFill' className='preview-image' />
                <View className='remove-btn' onClick={() => handleRemoveImage(index)}>
                  <Text>×</Text>
                </View>
              </View>
            ))}
            {images.length < 9 && (
              <View className='add-image' onClick={handleChooseImage}>
                <Text className='add-icon'>+</Text>
                <Text className='add-text'>添加图片</Text>
              </View>
            )}
          </View>
        </View>

        <View className='options-section'>
          <View className='option-item' onClick={() => {}}>
            <Text className='option-icon'>📍</Text>
            <Text className='option-label'>添加位置</Text>
            {selectedLocation ? (
              <Text className='option-value'>{selectedLocation}</Text>
            ) : (
              <Text className='option-arrow'>›</Text>
            )}
          </View>

          <View className='option-item' onClick={() => {}}>
            <Text className='option-icon'>🏷️</Text>
            <Text className='option-label'>添加话题</Text>
            {selectedTopic ? (
              <Text className='option-value'>{selectedTopic}</Text>
            ) : (
              <Text className='option-arrow'>›</Text>
            )}
          </View>

          <View className='option-item'>
            <Text className='option-icon'>👁️</Text>
            <Text className='option-label'>公开可见</Text>
            <Text className='option-switch'>✓</Text>
          </View>
        </View>

        <View className='topics-section'>
          <Text className='section-title'>热门话题</Text>
          <View className='topics-list'>
            {topics.map(topic => (
              <View 
                key={topic} 
                className={`topic-tag ${selectedTopic === topic ? 'active' : ''}`}
                onClick={() => setSelectedTopic(selectedTopic === topic ? '' : topic)}
              >
                <Text>#{topic}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View className='bottom-bar'>
        <View className='draft-btn'>
          <Text>存草稿</Text>
        </View>
        <View className='publish-btn' onClick={handlePublish}>
          <Text>发布</Text>
        </View>
      </View>
    </View>
  )
}
