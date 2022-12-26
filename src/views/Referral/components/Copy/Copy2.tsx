import React from 'react'
import {Button} from '@anpanswap/uikit'
import { useTranslation } from 'contexts/Localization'
import  useCopyClipboard  from '../../hooks/useCopyClipboard'

export default function CopyHelper2({ toCopy }) {
  const [isCopied, setCopied] = useCopyClipboard()
  const { t } = useTranslation()

  return (
    <Button onClick={() => setCopied(toCopy)} as="a" external href={`https://twitter.com/intent/tweet?text=Anpanswap - the DEX with a 6-type Referral Program.%0a  Enjoy profitable options on Anpanswap:%0a   \u2705 The Lowest Exchange fee 0.1%25%0a   \u2705 Up to 100%25 Fee Return%0a   \u2705 6%25 from friends' yields%0a   \u2705 High APRs on Farms %26 Stake&url=%0a&hashtags=anpanswap_ref + https://anpanswap.finance/ref/${toCopy}`}>
      {t('Twitter')}
    </Button>
  )
}
