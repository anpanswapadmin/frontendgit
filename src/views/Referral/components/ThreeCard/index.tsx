import React from 'react'
import { Button, Link, Heading, Flex, Text, AnalyticsIcon, LiquidityIcon, SwapAIcon } from '@anpanswap/uikit'
import { useTranslation } from 'contexts/Localization'
import useTheme from 'hooks/useTheme'
import IconCard, { IconCardData } from '../../../Home/components/IconCard'
import StatCardContent from './StatCardContent'
import OrangeWordFooting from '../../../Home/components/OrangeWordFooting'

const Stats = () => {
  const { t } = useTranslation()
  const { theme } = useTheme()

  const SwapCardData: IconCardData = {
    icon: <SwapAIcon color="primary" width="36px" />,
  }

  const LiquidityCardData: IconCardData = {
    icon: <LiquidityIcon color="secondary" width="36px" />,
  }

  const AnalyticsCardData: IconCardData = {
    icon: < AnalyticsIcon color="failure" width="36px" />,
  }

  return (
    <Flex justifyContent="center" alignItems="center" flexDirection="column">
      <Heading textAlign="center" scale="xl" mb="16px">
        {t('How to invite friends')}
      </Heading>
      <Flex flexDirection={['column', null, null, 'row']}>
        <IconCard {...SwapCardData} mr={[null, null, null, '16px']} mb={['16px', null, null, '0']}>
          <StatCardContent
            headingText={t('Get a referral link')}
            bodyText={t('Connect a wallet and generate your referral link in the Referral section.')}
            highlightColor={theme.colors.primary}
          />

        </IconCard>
        <IconCard {...LiquidityCardData} mr={[null, null, null, '16px']} mb={['16px', null, null, '0']}>
          <StatCardContent
            headingText={t('Invite friends')}
            bodyText={t('Invite your friends to register via your referral link')}
            highlightColor={theme.colors.secondary}
          />

        </IconCard>
        <IconCard {...AnalyticsCardData}>
          <StatCardContent
            headingText={t('Earn crypto')}
            bodyText={t('Receive referral rewards in BSW tokens from your friends’ earnings & swaps')}
            highlightColor={theme.colors.failure}
          />

        </IconCard>
      </Flex>
      <Flex flexDirection={['column', null, null, 'row']} mt="48px">
        <Flex flexDirection="column">
          <Heading scale="xl" mb="16px">
            {t('Farms Referral Rewards')}
          </Heading>
          <Text color="textSubtle" fontSize="16px" mr="8px">
            {t('Gain 6% from your friends earnings on Farms! Your rewards will be displayed on the referral balance at the moment your invited friends withdraw their earned BSW tokens.')}
          </Text>
          <Text as={Link} href="https://docs.anpanswap.finance/code/smart-contracts" target="_blank" textAlign="center" color="failure" fontSize="16px">
            {t('Read more')}
          </Text>
        </Flex>
        <Flex flexDirection="column">
          <Heading scale="xl" mb="16px">
            {t('Stake Referral Rewards')}
          </Heading>
          <Text color="textSubtle" fontSize="16px" mr="8px">
            {t('Get 6% of from friends’ profit obtained in Launchpools! The reward is only valid for the pool in which BSW is staked in return for more BSW.')}
          </Text>
          <Text as={Link} href="https://docs.anpanswap.finance/code/smart-contracts" target="_blank" textAlign="center" color="failure" fontSize="16px">
            {t('Read more')}
          </Text>
        </Flex>
        <Flex flexDirection="column">
          <Heading scale="xl" mb="16px">
            {t('Swapping Referral Rewards')}
          </Heading>
          <Text color="textSubtle" fontSize="16px" mr="8px">
            {t('Get up to 20% from friends’ swap commission each time your friend makes a swap! Receive your reward immediately after the swap is made. Swaps referral program will be active for certain pairs only.')}
          </Text>
          <Text as={Link} href="https://docs.anpanswap.finance/code/smart-contracts" target="_blank" textAlign="center" color="failure" fontSize="16px">
            {t('Read more')}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Stats
