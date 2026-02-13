import React from 'react'

const Layout = ({ children, navbar, footer }) => {
  return (
    <div className="layout">
      {navbar}
      <main className="main">
        {children}
      </main>
      {footer}
    </div>
  )
}

export default Layout