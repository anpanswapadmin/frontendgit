import React, { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import {
  Card,
  CardBody,
  Text,
  Flex,
  HelpIcon,
  Button,
  Heading,
  Skeleton,
  useModal,
  Box,
  useTooltip,
} from '@anpanswap/uikit'
import { useTranslation } from 'contexts/Localization'
import { getBalanceNumber } from 'utils/formatBalance'
import { useAnpanVault, usePriceAnpanBusd } from 'state/hooks'
import Balance from 'components/Balance'
import BountyModal from './BountyModal'

const StyledCard = styled(Card)`
  width: 100%;
  flex: 1;
  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 240px;
  }
`

const SwapCard = () => {
  const { t } = useTranslation()
  const {
    estimatedAnpanBountyReward,
    fees: { callFee },
  } = useAnpanVault()
  const anpanPriceBusd = usePriceAnpanBusd()

  const estimatedDollarBountyReward = useMemo(() => {
    return new BigNumber(estimatedAnpanBountyReward).multipliedBy(anpanPriceBusd)
  }, [anpanPriceBusd, estimatedAnpanBountyReward])

  const hasFetchedDollarBounty = estimatedDollarBountyReward.gte(0)
  const hasFetchedAnpanBounty = estimatedAnpanBountyReward ? estimatedAnpanBountyReward.gte(0) : false
  const dollarBountyToDisplay = hasFetchedDollarBounty ? getBalanceNumber(estimatedDollarBountyReward, 18) : 0
  const anpanBountyToDisplay = hasFetchedAnpanBounty ? getBalanceNumber(estimatedAnpanBountyReward, 18) : 0

  const TooltipComponent = ({ fee }: { fee: number }) => (
    <>
      <Text mb="16px">{t('This bounty is given as a reward for providing a service to other users.')}</Text>
      <Text mb="16px">
        {t(
          'Whenever you successfully claim the bounty, you’re also helping out by activating the Auto ANPAN Pool’s compounding function for everyone.',
        )}
      </Text>
      <Text style={{ fontWeight: 'bold' }}>
        {t('Auto-Compound Bounty: %fee%% of all Auto ANPAN pool users pending yield', { fee: fee / 100 })}
      </Text>
    </>
  )

  const [onPresentBountyModal] = useModal(<BountyModal TooltipComponent={TooltipComponent} />)

  const { targetRef, tooltip, tooltipVisible } = useTooltip(<TooltipComponent fee={callFee} />, {
    placement: 'bottom-end',
    tooltipOffset: [20, 10],
  })

  return (
    <>
      {tooltipVisible && tooltip}
      <StyledCard>
        <CardBody>
          <Flex flexDirection="column">
            <Flex alignItems="center" mb="12px">
              <Text fontSize="16px" bold color="textSubtle" mr="24px">
                {t('Swap Referral')}
              </Text>
              <Button
              disabled={!dollarBountyToDisplay || !anpanBountyToDisplay || !callFee}
              onClick={onPresentBountyModal}
              scale="sm"
              id="clickClaimVaultBounty"
            >
              {t('History')}
            </Button>
            </Flex>
          </Flex>
          <Flex alignItems="center" justifyContent="space-between">
            <Flex flexDirection="column" mr="12px">
              <Heading>
                {hasFetchedAnpanBounty ? (
                  <Balance fontSize="20px" bold value={anpanBountyToDisplay} decimals={3} unit=" ANPAN"/>
                ) : (
                  <Skeleton height={20} width={96} mb="2px" />
                )}
              </Heading>
            </Flex>
          </Flex>
          <Button
              disabled={!dollarBountyToDisplay || !anpanBountyToDisplay || !callFee}
              onClick={onPresentBountyModal}
              scale="sm"
              id="clickClaimVaultBounty"
              mt='16px'
            >
              {t('Withdraw')}
            </Button>
        </CardBody>
      </StyledCard>
    </>
  )
}

export default SwapCard
