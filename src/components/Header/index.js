import React from 'react'
import Link from 'gatsby-link'

const Header = () => (
  <div
    style={{
      background: '#2196F3',
      marginBottom: '1.45rem',
    }}
  >
    <div
      style={{
        padding: '1.45rem 1.0875rem',
      }}
    >
      <h1 style={{ margin: 0 }}>
        <Link
          to="/"
          style={{
            color: 'white',
            textDecoration: 'none',
          }}
        >
          Wallets
        </Link>
      </h1>
    </div>
  </div>
)

export default Header
