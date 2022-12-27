import { CurrencyAmount, JSBI, Token, Trade } from '@anpanswap-libs/sdk'
import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ArrowDown } from 'react-feather'
import { CardBody, ArrowDownIcon, Button, IconButton, Text } from '@anpanswap/uikit'
import { ThemeContext } from 'styled-components'

import { useTranslation } from 'contexts/Localization'
import CardNav from '../CardNav'


const Swap = () => {

  const { t } = useTranslation()


  const [dismissTokenWarning, setDismissTokenWarning] = useState<boolean>(false)
  const [transactionWarning, setTransactionWarning] = useState<{
    selectedToken: string | null
    purchaseType: string | null
  }>({
    selectedToken: null,
    purchaseType: null,
  })

  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true)
  }, [])

  const handleConfirmWarning = () => {
    setTransactionWarning({
      selectedToken: null,
      purchaseType: null,
    })
  }

  const theme = useContext(ThemeContext)

  // modal and loading
  const [{ showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash }, setSwapState] = useState<{
    showConfirm: boolean
    tradeToConfirm: Trade | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    showConfirm: false,
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  })



  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  // errors
  const [showInverted, setShowInverted] = useState<boolean>(false)

  // This will check to see if the user has selected Honey or SafeMoon to either buy or sell.
  // If so, they will be alerted with a warning message.
  const checkForWarning = useCallback(
    (selected: string, purchaseType: string) => {
      if (['HONEY', 'SAFEMOON'].includes(selected)) {
        setTransactionWarning({
          selectedToken: selected,
          purchaseType,
        })
      }
    },
    [setTransactionWarning]
  )

  return (
    <>
      <CardNav />
      <Text>
        Swap
      </Text>
    </>
  )
}

export default Swap
