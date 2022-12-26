import React, { useMemo } from 'react'
import BigNumber from 'bignumber.js'
import styled from 'styled-components'
import { useWeb3React } from '@web3-react/core'
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
import { Link } from 'react-router-dom'
import BountyModal from './BountyModal'
import ReferralLink from './ReferralLink'
import ReferralLink2 from './ReferralLink2'
import ReferralLink3 from './ReferralLink3'

/*eslint-disable */
var url = require('url')

const StyledCard = styled(Card)`
  width: 100%;
  flex: 1;
  ${({ theme }) => theme.mediaQueries.sm} {
    min-width: 240px;
  }
`

const BountyCard = () => {
  const { t } = useTranslation()
  const { account } = useWeb3React()
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

  function socialWindow(url) {
    const left = (screen.width -570) / 2;
    const top = (screen.height -570) / 2;
    const params = "menubar=no,toolbar=no,status=no,width=570,height=570,top=" + top + ",left=" + left;  window.open(url,"NewWindow",params);}

  function setShareLinks() {
    const pageUrl = encodeURIComponent(document.URL);
    const tweet = encodeURIComponent($("meta[property='og:description']").attr("content"));

    $(".social-share.facebook").on("click", function() { url="https://www.facebook.com/sharer.php?u=" + pageUrl;
    socialWindow(url);
    });

    $(".social-share.twitter").on("click", function() {
    url = "https://twitter.com/intent/tweet?url=" + pageUrl + "&text=" + tweet;
    socialWindow(url);
    });

    $(".social-share.linkedin").on("click", function() {
    url = "https://www.linkedin.com/shareArticle?mini=true&url=" + pageUrl;
    socialWindow(url);
    })
  }



  return (
    <>
      {tooltipVisible && tooltip}
      <StyledCard>
        <CardBody>
          <Flex flexDirection="column">
            <Flex alignItems="center" mb="12px">
              <Text fontSize="16px" bold color="textSubtle" mr="4px">
                {t('My Referral Link')}
              </Text>
            </Flex>
          </Flex>
          <Flex alignItems="center" justifyContent="space-between">
            {account? (
                <Flex flexDirection="row" mr="12px">
                  https://anpanswap.finance/...
                  <ReferralLink/>
                </Flex>
            ) : (null)
            }
            <ReferralLink2/>
            <ReferralLink3/>
          </Flex>
        </CardBody>
      </StyledCard>
    </>
  )
}

export default BountyCard
