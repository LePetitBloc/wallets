import React from 'react'
import Masternodes from '../components/Wallets'
import walletsMap from '../../wallets.json'
import Immutable from 'immutable'

const list = Immutable.fromJS(
  Object.keys(walletsMap).map(key => ({
    ...walletsMap[key],
    name: key,
    config: `${walletsMap[key].basedir}${walletsMap[key].configFile}`,
  }))
)

const IndexPage = () => (
  <div style={{ height: '100%' }}>
    <p
      style={{
        padding: '0px 1.0875rem 0.875rem',
        paddingTop: 0,
      }}
    >
      Community maintained list of core <strong>wallets</strong>,{' '}
      <strong>masternodes coins</strong> and their respective{' '}
      <strong>configuration</strong> values.
    </p>
    <Masternodes list={list} />
  </div>
)

export default IndexPage
