import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const Profile = ({ user }) => {
  const [stats, setStats] = useState({
    votesCreated: 0,
    votesParticipated: 0
  })

  useEffect(() => {
    if (!user?.id) return

    const loadStats = async () => {
      const { count: created } = await supabase
        .from('polls')
        .select('*', { count: 'exact', head: true })
        .eq('created_by', user.id)

      const { count: participated } = await supabase
        .from('votes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

      setStats({
        votesCreated: created || 0,
        votesParticipated: participated || 0
      })
    }

    loadStats()
  }, [user])

  const calculateParticipation = () => {
    if (stats.votesCreated === 0 && stats.votesParticipated === 0) return 0
    return Math.round((stats.votesParticipated / (stats.votesCreated + stats.votesParticipated || 1)) * 100)
  }

  return (
    <div className="page-content">
      <div className="profile-container">
        <h2>Profile</h2>
        <div className="profile-card">
          <div className="profile-header">
            <div className="avatar">
              {(user?.user_metadata?.username?.charAt(0).toUpperCase()) || (user?.email?.charAt(0).toUpperCase()) || 'U'}
            </div>
            <div className="user-info">
              <h3>{user?.user_metadata?.username || user?.email}</h3>
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
          <p style={{ color: '#666', textAlign: 'center', padding: '1rem' }}>
            {stats.votesParticipated > 0
              ? `You have participated in ${stats.votesParticipated} vote(s) and created ${stats.votesCreated} poll(s).`
              : 'No recent activity'}
          </p>
        </div>
      </div>
    </div>
  )
}

export default Profile
