import React, { useState, useEffect } from 'react'
import { Button } from '../ui/Button'

const Results = ({ user }) => {
  const [friends, setFriends] = useState([])
  const [friendEmail, setFriendEmail] = useState('')
  const [view, setView] = useState('list')
  const [selectedFriend, setSelectedFriend] = useState(null)
  const [friendPolls, setFriendPolls] = useState([])

  useEffect(() => {
    const storedFriends = JSON.parse(localStorage.getItem(`friends_${user?.email}`) || '[]')
    setFriends(storedFriends)
  }, [user])

  const saveFriends = (newFriends) => {
    localStorage.setItem(`friends_${user?.email}`, JSON.stringify(newFriends))
    setFriends(newFriends)
  }

  const addFriend = () => {
    if (!friendEmail.trim()) {
      alert('Please enter an email')
      return
    }
    
    const userRegistry = JSON.parse(localStorage.getItem('userRegistry') || '{}')
    if (!userRegistry[friendEmail]) {
      alert('User not found. They need to sign up first.')
      return
    }
    
    if (friendEmail === user?.email) {
      alert("You can't add yourself as a friend")
      return
    }
    
    if (friends.includes(friendEmail)) {
      alert('This friend is already added')
      return
    }
    
    saveFriends([...friends, friendEmail])
    setFriendEmail('')
  }

  const removeFriend = (email) => {
    saveFriends(friends.filter(f => f !== email))
  }

  const getUserDisplayName = (email) => {
    const users = JSON.parse(localStorage.getItem('userRegistry') || '{}')
    return users[email]?.username || email.split('@')[0]
  }

  const getUserStats = (email) => {
    const allPolls = JSON.parse(localStorage.getItem('allPolls') || '[]')
    const userVotes = JSON.parse(localStorage.getItem(`votes_${email}`) || '{}')
    
    const pollsCreated = allPolls.filter(p => p.createdBy === email).length
    const votesParticipated = Object.values(userVotes).filter(v => v.hasVoted).length
    
    return { pollsCreated, votesParticipated }
  }

  const viewFriendPolls = (email) => {
    const allPolls = JSON.parse(localStorage.getItem('allPolls') || '[]')
    const friendPollsData = allPolls.filter(p => p.createdBy === email)
    setFriendPolls(friendPollsData)
    setSelectedFriend(email)
    setView('polls')
  }

  const renderFriendCard = (email) => {
    const stats = getUserStats(email)
    return (
      <div key={email} className="poll-card">
        <div className="profile-header">
          <div className="avatar">
            {getUserDisplayName(email).charAt(0).toUpperCase()}
          </div>
          <div className="user-info">
            <h3>{getUserDisplayName(email)}</h3>
            <p>{email}</p>
          </div>
        </div>
        
        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-number">{stats.votesParticipated}</span>
            <span className="stat-label">Votes Cast</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.pollsCreated}</span>
            <span className="stat-label">Polls Created</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.votesParticipated > 0 ? 'Active' : 'New'}</span>
            <span className="stat-label">Status</span>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Button className="primary" onClick={() => viewFriendPolls(email)}>
            View Polls
          </Button>
          <Button className="secondary" onClick={() => removeFriend(email)}>
            Remove
          </Button>
        </div>
      </div>
    )
  }

  const renderFriendPolls = () => (
    <div className="vote-container">
      <Button className="secondary" onClick={() => setView('list')} style={{ marginBottom: '1rem' }}>
        ← Back to Friends
      </Button>
      <h2>{getUserDisplayName(selectedFriend)}'s Polls</h2>
      
      {friendPolls.length === 0 ? (
        <div className="poll-card" style={{ textAlign: 'center' }}>
          <p style={{ color: '#666' }}>No polls created yet.</p>
        </div>
      ) : (
        friendPolls.map((poll) => {
          const totalVotes = poll.options.reduce((sum, opt) => sum + opt.votes, 0)
          return (
            <div key={poll.id} className="poll-card">
              <div className="poll-question">
                <h3>{poll.question}</h3>
              </div>
              <div className="poll-results">
                <h4>Results</h4>
                {poll.options.map((option) => {
                  const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0
                  return (
                    <div key={option.id} className="result-bar">
                      <div className="result-info">
                        <span className="result-name">{option.name}</span>
                        <span className="result-count">{option.votes} votes ({percentage.toFixed(1)}%)</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  )
                })}
                <p className="total-votes">Total votes: {totalVotes}</p>
              </div>
            </div>
          )
        })
      )}
    </div>
  )

  return (
    <div className="page-content">
      <div className="vote-container">
        <h2>Friends & Results</h2>
        
        {view === 'list' && (
          <>
            <div className="poll-card" style={{ marginBottom: '2rem' }}>
              <h3 style={{ marginBottom: '1rem' }}>Add Friend</h3>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  type="email"
                  className="input"
                  placeholder="Enter friend's email"
                  value={friendEmail}
                  onChange={(e) => setFriendEmail(e.target.value)}
                  style={{ flex: 1 }}
                />
                <Button className="primary" onClick={addFriend}>
                  Add
                </Button>
              </div>
            </div>

            <h3 style={{ marginBottom: '1rem' }}>Your Friends</h3>
            
            {friends.length === 0 ? (
              <div className="poll-card" style={{ textAlign: 'center' }}>
                <p style={{ color: '#666', marginBottom: '1rem' }}>No friends added yet.</p>
                <p style={{ color: '#666', fontSize: '0.9rem' }}>Add friends by entering their email address above to view their polls and stats.</p>
              </div>
            ) : (
              friends.map(email => renderFriendCard(email))
            )}
          </>
        )}

        {view === 'polls' && renderFriendPolls()}
      </div>
    </div>
  )
}

export default Results
