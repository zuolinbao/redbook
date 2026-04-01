import { View, Text } from '@tarojs/components'
import styles from './index.module.scss'

interface FormTitleProps {
  title?: string
}

const FormTitle = ({ title = '请填写你的信息' }: FormTitleProps) => {
  return (
    <View className={styles['form-title']}>
      <View className={styles['title-bar']} />
      <Text className={styles['title-text']}>{title}</Text>
    </View>
  )
}

export default FormTitle
