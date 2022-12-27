import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { ButtonMenu, ButtonMenuItem } from '@anpanswap/uikit'
import { useTranslation } from 'contexts/Localization'

const StyledNav = styled.div`
  display: flex;
  margin-bottom: 20px;
  margin-top: 16px;
  min-width: 240px;
  justify-content: space-between;
  align-items: center;
`
/*eslint-disable */
function Nav({ activeIndex = 0 }: { activeIndex?: number }) {
  const { t } = useTranslation()
  return (
    <StyledNav>
      <ButtonMenu activeIndex={activeIndex} scale="sm" variant="secondary">
      <ButtonMenuItem id="farm-nav-link" to="/" as={Link} mr="16px">
          {t('Referral list')}
        </ButtonMenuItem>
        <ButtonMenuItem id="farm-nav-link" to="/farm" as={Link} mr="16px">
          {t('Farms')}
        </ButtonMenuItem>
        <ButtonMenuItem id="stake-nav-link" to="/pool" as={Link} mr="16px">
          {t('Stake')}
        </ButtonMenuItem>
        <ButtonMenuItem id="swap-nav-link" to="/swap" as={Link} mr="16px">
          {t('Swap')}
        </ButtonMenuItem>
      </ButtonMenu>
    </StyledNav>
  )
}

export default Nav
