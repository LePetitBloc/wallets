import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import GitHubForkRibbon from 'react-github-fork-ribbon'
import Header from '../components/Header'
import './index.css'

const TemplateWrapper = ({ children }) => (
  <div style={{ height: '100%' }}>
    <GitHubForkRibbon
      href="//github.com/lepetitbloc/wallets"
      target="_blank"
      position="right"
    >
      Fork me on GitHub
    </GitHubForkRibbon>
    <Helmet
      title="Cryptocurrencies core wallets - Wallet source, information and configurations values"
      meta={[
        {
          name: 'description',
          content:
            'Cryptocurrencies core wallets configuration map in json, with ready to deploy images. This map is strongly focused on technicals details and masternodes coins',
        },
        {
          name: 'keywords',
          content:
            'cryptocurrency, wallets, masternode, masternodes, MN, MNs, Dash, PIVX, ZXC, Zerocoin',
        },
      ]}
    >
      <link
        href="https://fonts.googleapis.com/icon?family=Material+Icons"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css?family=Roboto+Mono"
        rel="stylesheet"
      />
    </Helmet>
    <Header />
    {children()}
  </div>
)

TemplateWrapper.propTypes = {
  children: PropTypes.func,
}

export default TemplateWrapper
