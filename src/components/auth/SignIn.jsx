import React, { useState } from 'react'
import { Button } from '../ui/Button'
import { Form, Input } from '../ui/Form'

const SignIn = ({ onSignIn, onNavigate }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSignIn(formData)
  }

  return (
    <div className="page signin-page">
      <div className="container">
        <h2>Sign In</h2>
        <Form onSubmit={handleSubmit}>
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <Button type="submit" className="primary full-width">
            Sign In
          </Button>
        </Form>
        <p className="auth-link">
          Don't have an account? 
          <Button className="link" onClick={() => onNavigate('signup')}>
            Sign Up
          </Button>
        </p>
      </div>
    </div>
  )
}

export default SignIn