import React from 'react'
import { Button } from '../ui/Button'

const Home = ({ user, onNavigate }) => {
  return (
    <div className="page-content">
      <div className="welcome-section">
        <h2>Welcome, {user?.username}!</h2>
        <p>Use the navigation above to vote or manage your profile.</p>
      </div>
      <div className="features-grid">
        <div className="feature-card" onClick={() => onNavigate('vote')} style={{ cursor: 'pointer' }}>
          <h3>🗳️ Voting</h3>
          <p>Participate in active polls and make your voice heard.</p>
        </div>
        <div className="feature-card">
          <h3>👤 Profile</h3>
          <p>Manage your account settings and view your voting history.</p>
        </div>
        <div className="feature-card" onClick={() => onNavigate('results')} style={{ cursor: 'pointer' }}>
          <h3>📊 Results</h3>
          <p>View friends' polls and statistics.</p>
        </div>
      </div>
    </div>
  )
}

export default Home
