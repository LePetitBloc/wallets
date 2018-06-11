import React from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import Header from '../components/Header';
import Footer from '../components/Footer';
import './index.css';

const TemplateWrapper = ({ children }) => (
  <div style={{ height: '100%' }}>
    <Helmet
      title="Cryptocurrencies core wallets configuration map in json"
      meta={[
        {
          name: 'description',
          content:
            'Cryptocurrencies core wallets configuration map in json, with ready to deploy images. This map is strongly focused on technicals details and masternodes coins',
        },
        {
          name: 'keywords',
          content: 'cryptocurrency, wallets, masternode, masternodes, MN, MNs, Dash, PIVX, ZXC, Zerocoin',
        },
      ]}
    >
      <link href="//fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
      <link href="//fonts.googleapis.com/css?family=Roboto+Mono" rel="stylesheet" />
      <link href="//fonts.googleapis.com/css?family=Source+Sans+Pro:600,700,900" rel="stylesheet" />
    </Helmet>
    <Header />
    {children()}
    <Footer />
  </div>
);

TemplateWrapper.propTypes = {
  children: PropTypes.func,
};

export default TemplateWrapper;
