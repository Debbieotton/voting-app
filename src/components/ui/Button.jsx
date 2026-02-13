import React from 'react'

const Button = ({ children, className = '', onClick, type = 'button', disabled = false }) => {
  const baseClasses = 'btn'
  const combinedClasses = `${baseClasses} ${className}`.trim()
  
  return (
    <button
      type={type}
      className={combinedClasses}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export { Button }