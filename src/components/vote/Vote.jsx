import React, { useState } from 'react'
import { Button } from '../ui/Button'

const Vote = () => {
  const [selectedOption, setSelectedOption] = useState('')
  const [hasVoted, setHasVoted] = useState(false)

  const pollOptions = [
    { id: 1, option: 'Option A', votes: 45 },
    { id: 2, option: 'Option B', votes: 32 },
    { id: 3, option: 'Option C', votes: 23 }
  ]

  const handleVote = () => {
    if (selectedOption) {
      setHasVoted(true)
    }
  }

  const totalVotes = pollOptions.reduce((sum, option) => sum + option.votes, 0)

  return (
    <div className="page-content">
      <div className="vote-container">
        <h2>Current Poll</h2>
        <div className="poll-question">
          <h3>What is your favorite programming language?</h3>
        </div>
        
        {!hasVoted ? (
          <div className="poll-options">
            {pollOptions.map((option) => (
              <div
                key={option.id}
                className={`poll-option ${selectedOption === option.id ? 'selected' : ''}`}
                onClick={() => setSelectedOption(option.id)}
              >
                <span className="option-text">{option.option}</span>
              </div>
            ))}
            <Button 
              className="primary large" 
              onClick={handleVote}
              disabled={!selectedOption}
            >
              Submit Vote
            </Button>
          </div>
        ) : (
          <div className="poll-results">
            <h3>Results</h3>
            {pollOptions.map((option) => {
              const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0
              return (
                <div key={option.id} className="result-bar">
                  <div className="result-info">
                    <span>{option.option}</span>
                    <span>{option.votes} votes ({percentage.toFixed(1)}%)</span>
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
    </div>
  )
}

export default Vote