import React from 'react';
import Link from 'gatsby-link';
import GithubIcon from './Icons/Github';

const headerStyle = {
  background: '#343a40',
  marginBottom: '0.875rem',
  padding: '0.375rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const lightText = {
  fontFamily: 'Source Sans Pro,sans-serif',
  color: 'white',
};

const Header = () => (
  <div style={headerStyle}>
    <div />
    <div>
      <h1 style={{ margin: 0, textAlign: 'center' }}>
        <Link
          to="/"
          style={{
            ...lightText,
            textDecoration: 'none',
            textTransform: 'uppercase',
          }}
        >
          Wallets
        </Link>
      </h1>
      <p
        style={{
          ...lightText,
          padding: '0 0 0.375rem 0',
          paddingTop: 0,
          textAlign: 'center',
        }}
      >
        Open-source list of core wallets configuration.
      </p>
    </div>
    <a
      href="//github.com/lepetitbloc/wallets"
      title="See source on Github"
      target="_blank"
      rel="noreferrer noopener"
      style={{
        justifySelf: 'flex-end',
        marginRight: 8,
      }}
    >
      <GithubIcon color="white" size={42} />
    </a>
  </div>
);

export default Header;
