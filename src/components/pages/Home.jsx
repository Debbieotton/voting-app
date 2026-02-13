import React from 'react'

const Home = ({ user }) => {
  return (
    <div className="page-content">
      <div className="welcome-section">
        <h2>Welcome, {user?.username}!</h2>
        <p>Use the navigation above to vote or manage your profile.</p>
      </div>
      <div className="features-grid">
        <div className="feature-card">
          <h3>🗳️ Voting</h3>
          <p>Participate in active polls and make your voice heard.</p>
        </div>
        <div className="feature-card">
          <h3>👤 Profile</h3>
          <p>Manage your account settings and view your voting history.</p>
        </div>
        <div className="feature-card">
          <h3>📊 Results</h3>
          <p>View real-time results and statistics for ongoing polls.</p>
        </div>
      </div>
    </div>
  )
}

export default Home