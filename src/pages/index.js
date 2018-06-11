import React from 'react';
import Masternodes from '../components/Wallets';
import walletsMap from '../../wallets.json';

const list = Object.keys(walletsMap).map(key => ({
  ...walletsMap[key],
  name: key,
  config: `${walletsMap[key].basedir}${walletsMap[key].configFile}`,
}));

const IndexPage = () => (
  <div style={{ height: '100%' }}>
    <Masternodes list={list} />
  </div>
);

export default IndexPage;
