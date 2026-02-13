import React, { useState } from 'react'
import { Button } from '../ui/Button'

const Vote = () => {
  const [votes, setVotes] = useState({
    programming: { selected: null, hasVoted: false },
    president: { selected: null, hasVoted: false }
  })

  const polls = [
    {
      id: 'programming',
      question: 'What is your favourite programming language?',
      options: [
        { id: 1, name: 'JavaScript', votes: 45 },
        { id: 2, name: 'Python', votes: 38 },
        { id: 3, name: 'Rust', votes: 22 },
        { id: 4, name: 'Go', votes: 18 }
      ]
    },
    {
      id: 'president',
      question: 'Vote for Nigerian President 2027',
      options: [
        { id: 1, name: 'Bola Ahmed Tinubu', votes: 32 },
        { id: 2, name: 'Atiku Abubakar', votes: 28 },
        { id: 3, name: 'Peter Obi', votes: 35 },
        { id: 4, name: 'Rabiu Kwankwaso', votes: 15 },
        { id: 5, name: 'Others', votes: 8 }
      ]
    }
  ]

  const handleVote = (pollId) => {
    if (votes[pollId].selected) {
      setVotes({
        ...votes,
        [pollId]: { ...votes[pollId], hasVoted: true }
      })
    }
  }

  const handleSelect = (pollId, optionId) => {
    setVotes({
      ...votes,
      [pollId]: { ...votes[pollId], selected: optionId }
    })
  }

  const getTotalVotes = (options) => {
    return options.reduce((sum, option) => sum + option.votes, 0)
  }

  return (
    <div className="page-content">
      <div className="vote-container">
        <h2>Active Polls</h2>
        
        {polls.map((poll) => {
          const totalVotes = getTotalVotes(poll.options)
          const pollState = votes[poll.id]
          
          return (
            <div key={poll.id} className="poll-card">
              <div className="poll-question">
                <h3>{poll.question}</h3>
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
        })}
      </div>
    </div>
  )
}

export default Vote