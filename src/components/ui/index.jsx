import React from 'react'

const Container = ({ children, className = '' }) => {
  const combinedClasses = `container ${className}`.trim()
  return <div className={combinedClasses}>{children}</div>
}

const Card = ({ children, className = '' }) => {
  const combinedClasses = `card ${className}`.trim()
  return <div className={combinedClasses}>{children}</div>
}

const Loading = ({ message = 'Loading...' }) => {
  return (
    <div className="loading">
      <div className="spinner"></div>
      <p>{message}</p>
    </div>
  )
}

export { Container, Card, Loading }