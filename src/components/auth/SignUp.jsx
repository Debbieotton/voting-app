import React, { useState } from 'react'
import { Button } from '../ui/Button'
import { Form, Input } from '../ui/Form'

const SignUp = ({ onSignUp, onNavigate }) => {
  const [formData, setFormData] = useState({
    username: '',
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
    onSignUp(formData)
  }

  return (
    <div className="page signup-page">
      <div className="container">
        <h2>Sign Up</h2>
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
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
            Sign Up
          </Button>
        </Form>
        <p className="auth-link">
          Already have an account? 
          <Button className="link" onClick={() => onNavigate('signin')}>
            Sign In
          </Button>
        </p>
      </div>
    </div>
  )
}

export default SignUp