import React from 'react'
import Masternodes from '../components/Masternodes'
import Link from 'gatsby-link'
import masternodesMap from '../../masternodes.json'
import Immutable from 'immutable'

const list = Immutable.fromJS(
  Object.keys(masternodesMap).map(key => ({
    ...masternodesMap[key],
    name: key,
    config: `${masternodesMap[key].basedir}${masternodesMap[key].configFile}`,
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
      Community maintained list of <strong>masternodes coins</strong> and their
      respective <strong>configuration</strong> values.
    </p>
    <Masternodes list={list} />
  </div>
)

export default IndexPage
