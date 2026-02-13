import React, { useState, useEffect } from 'react'
import { Button } from '../ui/Button'

const Vote = ({ user }) => {
  const [view, setView] = useState('list')
  const [allPolls, setAllPolls] = useState([])
  const [votes, setVotes] = useState({})
  const [selectedCreator, setSelectedCreator] = useState(null)
  
  const [newPoll, setNewPoll] = useState({
    question: '',
    options: ['', '']
  })

  useEffect(() => {
    const storedPolls = JSON.parse(localStorage.getItem('allPolls') || '[]')
    setAllPolls(storedPolls)
    
    const userVotes = JSON.parse(localStorage.getItem(`votes_${user?.email}`) || '{}')
    setVotes(userVotes)
  }, [user])

  const savePollsToStorage = (polls) => {
    localStorage.setItem('allPolls', JSON.stringify(polls))
    setAllPolls(polls)
  }

  const saveVotesToStorage = (newVotes) => {
    localStorage.setItem(`votes_${user?.email}`, JSON.stringify(newVotes))
    setVotes(newVotes)
  }

  const addActivity = (text) => {
    const activities = JSON.parse(localStorage.getItem(`activities_${user?.email}`) || '[]')
    const newActivity = {
      text,
      time: new Date().toLocaleString()
    }
    const updatedActivities = [newActivity, ...activities].slice(0, 10)
    localStorage.setItem(`activities_${user?.email}`, JSON.stringify(updatedActivities))
  }

  const handleViewChange = (newView) => {
    setView(newView)
    if (newView === 'list') setSelectedCreator(null)
  }

  const handleOptionChange = (index, value) => {
    const newOptions = [...newPoll.options]
    newOptions[index] = value
    setNewPoll({ ...newPoll, options: newOptions })
  }

  const addOption = () => {
    setNewPoll({ ...newPoll, options: [...newPoll.options, ''] })
  }

  const removeOption = (index) => {
    if (newPoll.options.length > 2) {
      const newOptions = newPoll.options.filter((_, i) => i !== index)
      setNewPoll({ ...newPoll, options: newOptions })
    }
  }

  const handleCreatePoll = () => {
    if (!newPoll.question.trim()) {
      alert('Please enter a question')
      return
    }
    
    const validOptions = newPoll.options.filter(opt => opt.trim() !== '')
    if (validOptions.length < 2) {
      alert('Please enter at least 2 options')
      return
    }

    const poll = {
      id: Date.now().toString(),
      question: newPoll.question,
      options: validOptions.map((name, index) => ({ id: index + 1, name, votes: 0 })),
      createdBy: user?.email,
      createdAt: new Date().toISOString()
    }

    const updatedPolls = [...allPolls, poll]
    savePollsToStorage(updatedPolls)
    addActivity(`Created poll "${poll.question}"`)
    
    setNewPoll({ question: '', options: ['', ''] })
    setView('list')
  }

  const handleVote = (pollId) => {
    if (votes[pollId]?.selected) {
      const poll = allPolls.find(p => p.id === pollId)
      const selectedOption = poll?.options.find(o => o.id === votes[pollId].selected)
      
      const updatedPolls = allPolls.map(p => {
        if (p.id === pollId) {
          return {
            ...p,
            options: p.options.map(opt => 
              opt.id === votes[pollId].selected 
                ? { ...opt, votes: opt.votes + 1 }
                : opt
            )
          }
        }
        return p
      })
      
      savePollsToStorage(updatedPolls)
      saveVotesToStorage({
        ...votes,
        [pollId]: { ...votes[pollId], hasVoted: true }
      })
      addActivity(`Voted for "${selectedOption?.name}" in "${poll?.question}"`)
    }
  }

  const handleSelect = (pollId, optionId) => {
    saveVotesToStorage({
      ...votes,
      [pollId]: { ...votes[pollId], selected: optionId }
    })
  }

  const handleDeletePoll = (pollId) => {
    const updatedPolls = allPolls.filter(p => p.id !== pollId)
    savePollsToStorage(updatedPolls)
  }

  const handleViewCreatorProfile = (email) => {
    setSelectedCreator(email)
  }

  const getTotalVotes = (options) => {
    return options.reduce((sum, option) => sum + option.votes, 0)
  }

  const getUserDisplayName = (email) => {
    const users = JSON.parse(localStorage.getItem('userRegistry') || '{}')
    return users[email]?.username || email.split('@')[0]
  }

  const renderUserProfile = (email) => {
    const allPolls = JSON.parse(localStorage.getItem('allPolls') || '[]')
    const userVotes = JSON.parse(localStorage.getItem(`votes_${email}`) || '{}')
    
    const pollsCreated = allPolls.filter(p => p.createdBy === email).length
    const votesParticipated = Object.values(userVotes).filter(v => v.hasVoted).length
    
    return (
      <div className="profile-card">
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
            <span className="stat-number">{votesParticipated}</span>
            <span className="stat-label">Votes Cast</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{pollsCreated}</span>
            <span className="stat-label">Polls Created</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{allPolls.length > 0 ? Math.round((votesParticipated / allPolls.length) * 100) : 0}%</span>
            <span className="stat-label">Participation</span>
          </div>
        </div>

        <Button className="secondary" onClick={() => setSelectedCreator(null)}>
          Back to Polls
        </Button>
      </div>
    )
  }

  const renderCreatePoll = () => (
    <div className="vote-container">
      <h2>Create New Poll</h2>
      <div className="poll-card">
        <div className="form">
          <input
            type="text"
            className="input"
            placeholder="Enter your poll question"
            value={newPoll.question}
            onChange={(e) => setNewPoll({ ...newPoll, question: e.target.value })}
          />
          
          <div className="poll-options">
            <label style={{ fontWeight: 600, marginBottom: '0.5rem', display: 'block' }}>Options:</label>
            {newPoll.options.map((option, index) => (
              <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="text"
                  className="input"
                  placeholder={`Option ${index + 1}`}
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                />
                {newPoll.options.length > 2 && (
                  <Button className="secondary" onClick={() => removeOption(index)}>
                    X
                  </Button>
                )}
              </div>
            ))}
            <Button className="secondary" onClick={addOption}>
              + Add Option
            </Button>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <Button className="primary large" onClick={handleCreatePoll}>
              Launch Poll
            </Button>
            <Button className="secondary large" onClick={() => setView('list')}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  const renderPollList = () => (
    <div className="vote-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Active Polls</h2>
        <Button className="primary" onClick={() => handleViewChange('create')}>
          + Create Poll
        </Button>
      </div>
      
      {allPolls.length === 0 ? (
        <div className="poll-card" style={{ textAlign: 'center' }}>
          <p style={{ color: '#666', marginBottom: '1rem' }}>No polls created yet.</p>
          <Button className="primary" onClick={() => handleViewChange('create')}>
            Create Your First Poll
          </Button>
        </div>
      ) : (
        allPolls.map((poll) => {
          const totalVotes = getTotalVotes(poll.options)
          const pollState = votes[poll.id] || { selected: null, hasVoted: false }
          const isCreator = poll.createdBy === user?.email
          
          return (
            <div key={poll.id} className="poll-card">
              <div className="poll-question">
                <h3>{poll.question}</h3>
                <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
                  Created by: <span 
                    style={{ color: '#667eea', cursor: 'pointer', textDecoration: 'underline' }}
                    onClick={() => handleViewCreatorProfile(poll.createdBy)}
                  >
                    {getUserDisplayName(poll.createdBy)}
                  </span>
                </p>
                {isCreator && (
                  <button 
                    className="btn secondary" 
                    style={{ marginTop: '0.5rem', padding: '0.25rem 0.5rem', fontSize: '0.8rem' }}
                    onClick={() => handleDeletePoll(poll.id)}
                  >
                    Delete
                  </button>
                )}
              </div>
              
              {!pollState.hasVoted ? (
                <div className="poll-options">
                  {poll.options.map((option) => (
                    <div
                      key={option.id}
                      className={`poll-option ${pollState.selected === option.id ? 'selected' : ''}`}
                      onClick={() => handleSelect(poll.id, option.id)}
                    >
                      <span className="option-text">{option.name}</span>
                    </div>
                  ))}
                  <Button 
                    className="primary large" 
                    onClick={() => handleVote(poll.id)}
                    disabled={!pollState.selected}
                  >
                    Submit Vote
                  </Button>
                </div>
              ) : (
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
                          <div 
                            className="progress-fill" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  })}
                  <p className="total-votes">Total votes: {totalVotes}</p>
                </div>
              )}
            </div>
          )
        })
      )}
    </div>
  )

  return (
    <div className="page-content">
      {view === 'create' ? renderCreatePoll() : selectedCreator ? (
        <div className="vote-container">
          <h2>User Profile</h2>
          {renderUserProfile(selectedCreator)}
        </div>
      ) : renderPollList()}
    </div>
  )
}

export default Vote
