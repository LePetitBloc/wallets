import React from 'react';

const pStyle = {
  textAlign: 'center',
  color: '#fff',
  fontFamily: 'Source Sans Pro,sans-serif',
};
const footerStyle = {
  background: '#343a40',
  padding: '0.375rem',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'space-between',
};

const Footer = () => (
  <div className="footer" style={footerStyle}>
    <p style={pStyle}>
      Crafted with{' '}
      <span role="img" aria-label="love">
        ❤️
      </span>{' '}
      by{' '}
      <a href="//lepetitbloc.net" target="_blank" rel="noreferrer noopener">
        LePetitBloc
      </a>{' '}
      in{' '}
      <span role="img" aria-label="france">
        🇫🇷
      </span>.
    </p>
    <p style={pStyle}>
      Hosted on{' '}
      <a href="//github.com/lepetitbloc/wallets" target="_blank" rel="noreferrer noopener">
        Github
      </a>.
    </p>
  </div>
);

export default Footer;
