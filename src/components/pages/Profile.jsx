import React from 'react'

const Profile = ({ user }) => {
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
              <span className="stat-number">12</span>
              <span className="stat-label">Votes Cast</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">3</span>
              <span className="stat-label">Polls Created</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">98%</span>
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
          <div className="activity-list">
            <div className="activity-item">
              <span className="activity-text">Voted in "Favorite Programming Language"</span>
              <span className="activity-time">2 hours ago</span>
            </div>
            <div className="activity-item">
              <span className="activity-text">Created poll "Best Framework 2026"</span>
              <span className="activity-time">1 day ago</span>
            </div>
            <div className="activity-item">
              <span className="activity-text">Voted in "Preferred Development Environment"</span>
              <span className="activity-time">3 days ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile