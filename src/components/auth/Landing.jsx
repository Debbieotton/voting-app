import React from 'react'
import { Button } from '../ui/Button'

const Landing = ({ onNavigate }) => {
  return (
    <div className="page landing-page">
      <div className="container">
        <h1>Welcome to Voting App</h1>
        <p>Sign up to continue</p>
        <Button className="primary large" onClick={() => onNavigate('signup')}>
          Sign Up
        </Button>
      </div>
    </div>
  )
}

export default Landing