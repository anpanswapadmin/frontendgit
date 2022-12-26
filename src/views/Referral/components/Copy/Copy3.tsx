import React from 'react'
import {Button} from '@anpanswap/uikit'
import { useTranslation } from 'contexts/Localization'
import  useCopyClipboard  from '../../hooks/useCopyClipboard'

export default function CopyHelper3({ toCopy }) {
  const [isCopied, setCopied] = useCopyClipboard()
  const { t } = useTranslation()

  return (
    <Button onClick={() => setCopied(toCopy)} as="a" external href={`https://telegram.me/share/url?url=https://anpanswap.finance/ref/${toCopy}&text=\uD83D\uDD1DFollow Anpanswap DEX with my referral link\uD83D\uDD1D %0a      Anpanswap - the DEX with a 6-type Referral Program.%0a      Enjoy profitable options on Anpanswap:%0a      \u2705 The Lowest Exchange fee 0.1%25%0a      \u2705 Up to 100%25 Fee Return%0a      \u2705 6%25 from friends' yields%0a      \u2705 High APRs on Farms %26 Stake`}>
      {t('Telegram')}
    </Button>
  )
}
