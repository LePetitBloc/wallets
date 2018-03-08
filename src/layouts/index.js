import React from 'react'
import PropTypes from 'prop-types'
import Helmet from 'react-helmet'
import GitHubForkRibbon from 'react-github-fork-ribbon'
import Header from '../components/Header'
import './index.css'

const TemplateWrapper = ({ children }) => (
  <div style={{ height: '100%' }}>
    <GitHubForkRibbon
      href="//github.com/lepetitbloc/masternodes"
      target="_blank"
      position="right"
    >
      Fork me on GitHub
    </GitHubForkRibbon>
    <Helmet
      title="Masternodes coins - Wallet source, information and configurations values"
      meta={[
        {
          name: 'description',
          content: 'List of masternode coins and their configurations values',
        },
        {
          name: 'keywords',
          content:
            'masternode, masternodes, MN, MNs, Dash, PIVX, ZXC, Zerocoin',
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
