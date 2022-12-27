import React, { useEffect, useMemo, useRef, useState } from 'react'
import { HashRouter, Route, Switch, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import { Heading, Flex, Image, Text } from '@anpanswap/uikit'
import orderBy from 'lodash/orderBy'
import partition from 'lodash/partition'
import { useTranslation } from 'contexts/Localization'
import usePersistState from 'hooks/usePersistState'
import { usePools, useFetchAnpanVault, useFetchPublicPoolsData, usePollFarmsData, useAnpanVault } from 'state/hooks'
import { latinise } from 'utils/latinise'
import FlexLayout from 'components/Layout/Flex'
import Page from 'components/Layout/Page'
import PageHeader from 'components/PageHeader'
import SearchInput from 'components/SearchInput'
import Select, { OptionProps } from 'components/Select/Select'
import { Pool } from 'state/types'
import ThreeCard from './components/ThreeCard'
import PoolCard from './components/PoolCard'
import AnpanVaultCard from './components/AnpanVaultCard'
import PoolTabButtons from './components/PoolTabButtons'
import BountyCard from './components/BountyCard'
import FarmCard from './components/FarmCard'
import StakeCard from './components/StakeCard'
import SwapCard from './components/SwapCard'
import HelpButton from './components/HelpButton'
import PoolsTable from './components/PoolsTable/PoolsTable'
import { ViewMode } from './components/ToggleView/ToggleView'
import { getAprData, getAnpanVaultEarnings } from './helpers'
import Home from './Home'
import Farm from './Farm'
import Stake from './Stake'
import Swap from './Swap'

const CardLayout = styled(FlexLayout)`
  justify-content: center;
`

const PoolControls = styled(Flex)`
  flex-direction: column;
  margin-bottom: 24px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
  }
`

const SearchSortContainer = styled(Flex)`
  gap: 10px;
  justify-content: space-between;
`

const ControlStretch = styled(Flex)`
  > div {
    flex: 1;
  }
`

const NUMBER_OF_POOLS_VISIBLE = 12

const Referral: React.FC = () => {
  const location = useLocation()
  const { t } = useTranslation()
  const { account } = useWeb3React()
  const { pools: poolsWithoutAutoVault, userDataLoaded } = usePools(account)
  const [stakedOnly, setStakedOnly] = usePersistState(false, { localStorageKey: 'anpans_pool_staked' })
  const [numberOfPoolsVisible, setNumberOfPoolsVisible] = useState(NUMBER_OF_POOLS_VISIBLE)
  const [observerIsSet, setObserverIsSet] = useState(false)
  const loadMoreRef = useRef<HTMLDivElement>(null)
  const [viewMode, setViewMode] = usePersistState(ViewMode.TABLE, { localStorageKey: 'anpans_farm_view' })
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOption, setSortOption] = useState('hot')
  const {
    userData: { anpanAtLastUserAction, userShares },
    fees: { performanceFee },
    pricePerFullShare,
    totalAnpanInVault,
  } = useAnpanVault()
  const accountHasVaultShares = userShares && userShares.gt(0)
  const performanceFeeAsDecimal = performanceFee && performanceFee / 100

  const pools = useMemo(() => {
    const anpanPool = poolsWithoutAutoVault.find((pool) => pool.sousId === 0)
    const anpanAutoVault = { ...anpanPool, isAutoVault: true }
    return [anpanAutoVault, ...poolsWithoutAutoVault]
  }, [poolsWithoutAutoVault])

  // TODO aren't arrays in dep array checked just by reference, i.e. it will rerender every time reference changes?
  const [finishedPools, openPools] = useMemo(() => partition(pools, (pool) => pool.isFinished), [pools])
  const stakedOnlyFinishedPools = useMemo(
    () =>
      finishedPools.filter((pool) => {
        if (pool.isAutoVault) {
          return accountHasVaultShares
        }
        return pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)
      }),
    [finishedPools, accountHasVaultShares],
  )
  const stakedOnlyOpenPools = useMemo(
    () =>
      openPools.filter((pool) => {
        if (pool.isAutoVault) {
          return accountHasVaultShares
        }
        return pool.userData && new BigNumber(pool.userData.stakedBalance).isGreaterThan(0)
      }),
    [openPools, accountHasVaultShares],
  )
  const hasStakeInFinishedPools = stakedOnlyFinishedPools.length > 0

  usePollFarmsData()
  useFetchAnpanVault()
  useFetchPublicPoolsData()



  const showFinishedPools = location.pathname.includes('history')

  const handleChangeSearchQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const handleSortOptionChange = (option: OptionProps): void => {
    setSortOption(option.value)
  }

  const sortPools = (poolsToSort: Pool[]) => {
    switch (sortOption) {
      case 'apr':
        // Ternary is needed to prevent pools without APR (like MIX) getting top spot
        return orderBy(
          poolsToSort,
          (pool: Pool) => (pool.apr ? getAprData(pool, performanceFeeAsDecimal).apr : 0),
          'desc',
        )
      case 'earned':
        return orderBy(
          poolsToSort,
          (pool: Pool) => {
            if (!pool.userData || !pool.earningTokenPrice) {
              return 0
            }
            return pool.isAutoVault
              ? getAnpanVaultEarnings(
                  account,
                  anpanAtLastUserAction,
                  userShares,
                  pricePerFullShare,
                  pool.earningTokenPrice,
                ).autoUsdToDisplay
              : pool.userData.pendingReward.times(pool.earningTokenPrice).toNumber()
          },
          'desc',
        )
      case 'totalStaked':
        return orderBy(
          poolsToSort,
          (pool: Pool) => (pool.isAutoVault ? totalAnpanInVault.toNumber() : pool.totalStaked.toNumber()),
          'desc',
        )
      default:
        return poolsToSort
    }
  }

  const poolsToShow = () => {
    let chosenPools = []
    if (showFinishedPools) {
      chosenPools = stakedOnly ? stakedOnlyFinishedPools : finishedPools
    } else {
      chosenPools = stakedOnly ? stakedOnlyOpenPools : openPools
    }

    if (searchQuery) {
      const lowercaseQuery = latinise(searchQuery.toLowerCase())
      chosenPools = chosenPools.filter((pool) =>
        latinise(pool.earningToken.symbol.toLowerCase()).includes(lowercaseQuery),
      )
    }

    return sortPools(chosenPools).slice(0, numberOfPoolsVisible)
  }

  const cardLayout = (
    <CardLayout>
      {poolsToShow().map((pool) =>
        pool.isAutoVault ? (
          <AnpanVaultCard key="auto-anpan" pool={pool} showStakedOnly={stakedOnly} />
        ) : (
          <PoolCard key={pool.sousId} pool={pool} account={account} />
        ),
      )}
    </CardLayout>
  )

  const tableLayout = <PoolsTable pools={poolsToShow()} account={account} userDataLoaded={userDataLoaded} />

  return (
    <>
      <PageHeader>
        <Flex justifyContent="space-between" flexDirection={['column', null, null, 'row']}>
          <Flex flex="1" flexDirection="column" mr={['8px', 0]}>
            <Heading as="h1" scale="xl" color="secondary" mb="20px">
              {t('Invite your friends. Earn cryptocurrency together')}
            </Heading>
            <Heading scale="md" color="text">
              {t('Earn up to 20% from friends’ swap commission on Anpanswap and 6% from their earnings on Farms & Stake')}
            </Heading>
            <Heading scale="md" color="text">
              {t('Read more')}
            </Heading>
          </Flex>
          {account?(
          <Flex flex="1" height="fit-content" justifyContent="center" alignItems="center" mt={['20px', null, '0']}>
            <BountyCard />
          </Flex>
          ) : (null)
          }
        </Flex>
        {account?(
        <Flex>
        <Flex justifyContent="center" alignItems="center" flexDirection={['column', null, null, 'row']} mt="32px">
          <Flex mr='16px'>
          <FarmCard/>
          </Flex>
          <Flex mr='16px'>
          <StakeCard/>
          </Flex>
          <Flex mr='16px'>
          <SwapCard/>
          </Flex>
        </Flex>
        </Flex>   
        ) : (null)
        }       
      </PageHeader>
      <Page>
      {account? (
        <PoolControls justifyContent="space-between">
                  <HashRouter>
          <Switch>
            <Route exact strict path="/" component={Home} />
            <Route exact strict path="/farm" component={Farm} />
            <Route exact strict path="/pool" component={Stake} />
            <Route exact strict path="/swap" component={Swap} />
          </Switch>                    
        </HashRouter>
          <PoolTabButtons
            stakedOnly={stakedOnly}
            setStakedOnly={setStakedOnly}
            hasStakeInFinishedPools={hasStakeInFinishedPools}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />
          <SearchSortContainer>
            <Flex flexDirection="column" width="50%">
              <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase">
                {t('Sort by')}
              </Text>
              <ControlStretch>
                <Select
                  options={[
                    {
                      label: t('Hot'),
                      value: 'hot',
                    },
                    {
                      label: t('APR'),
                      value: 'apr',
                    },
                    {
                      label: t('Earned'),
                      value: 'earned',
                    },
                    {
                      label: t('Total staked'),
                      value: 'totalStaked',
                    },
                  ]}
                  onChange={handleSortOptionChange}
                />
              </ControlStretch>
            </Flex>
            <Flex flexDirection="column" width="50%">
              <Text fontSize="12px" bold color="textSubtle" textTransform="uppercase">
                {t('Search')}
              </Text>
              <ControlStretch>
                <SearchInput onChange={handleChangeSearchQuery} placeholder="Search Pools" />
              </ControlStretch>
            </Flex>
          </SearchSortContainer>
        </PoolControls>
        ) : 
        (
          <ThreeCard />
        )}
      </Page>

    </>
  )
}

export default Referral
