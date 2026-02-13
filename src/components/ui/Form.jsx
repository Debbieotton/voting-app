import React from 'react'

const Form = ({ children, onSubmit, className = '' }) => {
  const combinedClasses = `form ${className}`.trim()
  
  return (
    <form className={combinedClasses} onSubmit={onSubmit}>
      {children}
    </form>
  )
}

const Input = ({ type, name, placeholder, value, onChange, required = false, className = '' }) => {
  const combinedClasses = `input ${className}`.trim()
  
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      required={required}
      className={combinedClasses}
    />
  )
}

export { Form, Input }