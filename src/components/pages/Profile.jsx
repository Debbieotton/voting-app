import React, { useState, useEffect } from 'react'

const Profile = ({ user }) => {
  const [stats, setStats] = useState({
    votesCreated: 0,
    votesParticipated: 0,
    activities: []
  })

  useEffect(() => {
    if (user?.email) {
      const allPolls = JSON.parse(localStorage.getItem('allPolls') || '[]')
      const userVotes = JSON.parse(localStorage.getItem(`votes_${user.email}`) || '{}')
      const activities = JSON.parse(localStorage.getItem(`activities_${user.email}`) || '[]')
      
      const votesCreated = allPolls.filter(p => p.createdBy === user.email).length
      const votesParticipated = Object.values(userVotes).filter(v => v.hasVoted).length

      setStats({
        votesCreated,
        votesParticipated,
        activities
      })
    }
  }, [user])

  const calculateParticipation = () => {
    if (stats.votesCreated === 0 && stats.votesParticipated === 0) return 0
    const allPolls = JSON.parse(localStorage.getItem('allPolls') || '[]')
    if (allPolls.length === 0) return 0
    return Math.round((stats.votesParticipated / allPolls.length) * 100)
  }

  return (
    <div className="page-content">
      <div className="profile-container">
        <h2>Profile</h2>
        <div className="profile-card">
          <div className="profile-header">
            <div className="avatar">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="user-info">
              <h3>{user?.username}</h3>
              <p>{user?.email}</p>
            </div>
          </div>
          
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-number">{stats.votesParticipated}</span>
              <span className="stat-label">Votes Cast</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{stats.votesCreated}</span>
              <span className="stat-label">Polls Created</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{calculateParticipation()}%</span>
              <span className="stat-label">Participation</span>
            </div>
          </div>
          
          <div className="profile-actions">
            <button className="btn secondary">Edit Profile</button>
            <button className="btn secondary">Change Password</button>
          </div>
        </div>
        
        <div className="recent-activity">
          <h3>Recent Activity</h3>
          {stats.activities.length === 0 ? (
            <p style={{ color: '#666', textAlign: 'center', padding: '1rem' }}>No recent activity</p>
          ) : (
            <div className="activity-list">
              {stats.activities.map((activity, index) => (
                <div key={index} className="activity-item">
                  <span className="activity-text">{activity.text}</span>
                  <span className="activity-time">{activity.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile
