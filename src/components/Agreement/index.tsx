import { View, Text } from '@tarojs/components'
import { Checkbox, Dialog } from '@taroify/core'
import styles from './index.module.scss'
import UserAgreement from './UserAgreement'
import PrivacyPolicy from './PrivacyPolicy'

interface AgreementProps {
  checked: boolean
  onChange: (checked: boolean) => void
  onUserAgreementClick?: () => void
  onPrivacyPolicyClick?: () => void
}

const Agreement = ({
  checked,
  onChange,
  onUserAgreementClick,
  onPrivacyPolicyClick,
}: AgreementProps) => {
  const showAgreementDialog = (type: 'user' | 'privacy') => {
    const handleConfirm = () => {
      onChange(true)
    }

    Dialog.confirm({
      selector: '#agreement-dialog',
      style: {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10001,
      },
      title: type === 'user' ? '用户协议' : '隐私政策',
      message: type === 'user' ? <UserAgreement /> : <PrivacyPolicy />,
      cancel: '取消',
      confirm: '确定',
      onConfirm: handleConfirm,
    })
  }

  const handleUserAgreementClick = () => {
    showAgreementDialog('user')
    onUserAgreementClick?.()
  }

  const handlePrivacyPolicyClick = () => {
    showAgreementDialog('privacy')
    onPrivacyPolicyClick?.()
  }

  return (
    <>
      <View className={styles['agreement']}>
        <Checkbox checked={checked} onChange={onChange}>
          <Text className={styles['ag-text']}>我已认真阅读并同意</Text>
        </Checkbox>
        <Text className={styles['ag-link']} onClick={handleUserAgreementClick}>
          《用户协议》
        </Text>
        <Text className={styles['ag-link']} onClick={handlePrivacyPolicyClick}>
          《隐私政策》
        </Text>
      </View>
      <Dialog id="agreement-dialog" />
    </>
  )
}

export default Agreement
