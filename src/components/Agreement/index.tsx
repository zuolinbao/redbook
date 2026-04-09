import { View, Text } from '@tarojs/components'
import { useState } from 'react'
import { Checkbox, Dialog, Button } from '@taroify/core'
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
  const [open, setOpen] = useState(false)
  const [dialogType, setDialogType] = useState<'user' | 'privacy'>('user')

  const showAgreementDialog = (type: 'user' | 'privacy') => {
    setDialogType(type)
    setOpen(true)
  }

  const handleConfirm = () => {
    onChange(true)
    setOpen(false)
  }

  const handleCancel = () => {
    setOpen(false)
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
          <Text className={styles['ag-text']}>我已阅读并同意</Text>
        </Checkbox>
        <Text className={styles['ag-link']} onClick={handleUserAgreementClick}>
          《用户协议》
        </Text>
        <Text className={styles['ag-link']} onClick={handlePrivacyPolicyClick}>
          《隐私政策》
        </Text>
      </View>
      <Dialog
        open={open}
        onClose={handleCancel}
        backdrop={{ closeable: false }}
        style={{
          position: 'fixed',
          zIndex: 9999,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <Dialog.Header>{dialogType === 'user' ? '用户协议' : '隐私政策'}</Dialog.Header>
        <Dialog.Content>
          {dialogType === 'user' ? <UserAgreement /> : <PrivacyPolicy />}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onClick={handleCancel}>取消</Button>
          <Button variant="text" color="primary" onClick={handleConfirm}>
            确定
          </Button>
        </Dialog.Actions>
      </Dialog>
    </>
  )
}

export default Agreement
