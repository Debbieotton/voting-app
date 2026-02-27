import React, { useEffect, useMemo, useState } from 'react'
import { Button } from '../ui/Button'
import { supabase } from '../../lib/supabase'

const Vote = ({ user }) => {
  const [view, setView] = useState('list')
  const [polls, setPolls] = useState([])
  const [selected, setSelected] = useState({})
  const [myVotes, setMyVotes] = useState({})
  const [loading, setLoading] = useState(true)

  const [newPoll, setNewPoll] = useState({
    question: '',
    options: ['', '']
  })

  const userId = user?.id
  const userEmail = user?.email

  const pollsWithOptions = useMemo(() => {
    return polls.map(p => ({
      ...p,
      options: (p.options || []).sort((a, b) => a.name.localeCompare(b.name))
    }))
  }, [polls])

  const loadPolls = async () => {
    setLoading(true)

    const { data: pollsData, error: pollsErr } = await supabase
      .from('polls')
      .select('id, question, created_by, creator_email, created_at, poll_options ( id, name )')
      .order('created_at', { ascending: false })

    if (pollsErr) {
      alert(pollsErr.message)
      setLoading(false)
      return
    }

    const normalized = (pollsData || []).map(p => ({
      ...p,
      options: p.poll_options || []
    }))

    setPolls(normalized)

    if (userId) {
      const { data: votesData, error: votesErr } = await supabase
        .from('votes')
        .select('poll_id, option_id')
        .eq('user_id', userId)

      if (!votesErr) {
        const map = {}
        for (const v of votesData || []) map[v.poll_id] = v.option_id
        setMyVotes(map)
      }
    }

    setLoading(false)
  }

  useEffect(() => {
    loadPolls()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId])

  const handleOptionChange = (index, value) => {
    const next = [...newPoll.options]
    next[index] = value
    setNewPoll({ ...newPoll, options: next })
  }

  const addOption = () => {
    setNewPoll({ ...newPoll, options: [...newPoll.options, ''] })
  }

  const removeOption = (index) => {
    if (newPoll.options.length <= 2) return
    const next = newPoll.options.filter((_, i) => i !== index)
    setNewPoll({ ...newPoll, options: next })
  }

  const handleCreatePoll = async () => {
    if (!userId) {
      alert('Please sign in')
      return
    }

    const question = newPoll.question.trim()
    if (!question) {
      alert('Please enter a question')
      return
    }

    const validOptions = newPoll.options.map(o => o.trim()).filter(Boolean)
    if (validOptions.length < 2) {
      alert('Please enter at least 2 options')
      return
    }

    const { data: pollRow, error: pollErr } = await supabase
      .from('polls')
      .insert({
        question,
        created_by: userId,
        creator_email: userEmail || null
      })
      .select('id')
      .single()

    if (pollErr) {
      alert(pollErr.message)
      return
    }

    const pollId = pollRow.id
    const optionRows = validOptions.map(name => ({ poll_id: pollId, name }))

    const { error: optErr } = await supabase
      .from('poll_options')
      .insert(optionRows)

    if (optErr) {
      alert(optErr.message)
      return
    }

    setNewPoll({ question: '', options: ['', ''] })
    setView('list')
    await loadPolls()
  }

  const handleSelect = (pollId, optionId) => {
    setSelected(prev => ({ ...prev, [pollId]: optionId }))
  }

  const handleVote = async (poll) => {
    if (!userId) {
      alert('Please sign in')
      return
    }

    if (poll.created_by === userId) {
      alert("You can't vote on your own poll")
      return
    }

    if (myVotes[poll.id]) {
      alert("You've already voted on this poll")
      return
    }

    const optionId = selected[poll.id]
    if (!optionId) {
      alert('Select an option first')
      return
    }

    const { error: voteErr } = await supabase
      .from('votes')
      .insert({
        poll_id: poll.id,
        option_id: optionId,
        user_id: userId,
        voter_email: userEmail || null
      })

    if (voteErr) {
      const msg = voteErr.message?.toLowerCase() || ''
      if (msg.includes('duplicate') || msg.includes('unique')) {
        alert("You've already voted on this poll")
      } else if (msg.includes('row-level security')) {
        alert("You can't vote on your own poll")
      } else {
        alert(voteErr.message)
      }
      return
    }

    await supabase.from('earnings').insert({
      user_id: userId,
      reason: 'vote_cast',
      amount: 1,
      poll_id: poll.id
    })

    setMyVotes(prev => ({ ...prev, [poll.id]: optionId }))
    await loadPolls()
    alert('Vote submitted! +1 token')
  }

  const handleDeletePoll = async (pollId) => {
    const { error } = await supabase.from('polls').delete().eq('id', pollId)
    if (error) {
      alert(error.message)
      return
    }
    await loadPolls()
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
        <Button className="primary" onClick={() => setView('create')}>
          + Create Poll
        </Button>
      </div>

      {loading ? (
        <div className="poll-card" style={{ textAlign: 'center' }}>
          <p style={{ color: '#666' }}>Loading polls...</p>
        </div>
      ) : pollsWithOptions.length === 0 ? (
        <div className="poll-card" style={{ textAlign: 'center' }}>
          <p style={{ color: '#666', marginBottom: '1rem' }}>No polls created yet.</p>
          <Button className="primary" onClick={() => setView('create')}>
            Create Your First Poll
          </Button>
        </div>
      ) : (
        pollsWithOptions.map((poll) => {
          const myChoice = myVotes[poll.id]
          const isCreator = poll.created_by === userId
          const canVote = !!userId && !isCreator && !myChoice

          return (
            <div key={poll.id} className="poll-card">
              <div className="poll-question">
                <h3>{poll.question}</h3>
                <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
                  Created by: {poll.creator_email || 'Unknown'}
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

              {!myChoice ? (
                <div className="poll-options">
                  {poll.options.map((option) => (
                    <div
                      key={option.id}
                      className={`poll-option ${selected[poll.id] === option.id ? 'selected' : ''}`}
                      onClick={() => canVote && handleSelect(poll.id, option.id)}
                      style={{ opacity: canVote ? 1 : 0.6, cursor: canVote ? 'pointer' : 'not-allowed' }}
                    >
                      <span className="option-text">{option.name}</span>
                    </div>
                  ))}

                  <Button
                    className="primary large"
                    onClick={() => handleVote(poll)}
                    disabled={!canVote || !selected[poll.id]}
                  >
                    Submit Vote
                  </Button>

                  {isCreator && (
                    <p style={{ marginTop: '0.75rem', color: '#666' }}>
                      You can’t vote on polls you created.
                    </p>
                  )}
                </div>
              ) : (
                <div className="poll-results">
                  <h4>Results</h4>
                  <PollResults pollId={poll.id} options={poll.options} />
                  <p className="total-votes">Your vote has been recorded.</p>
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
      {view === 'create' ? renderCreatePoll() : renderPollList()}
    </div>
  )
}

const PollResults = ({ pollId, options }) => {
  const [counts, setCounts] = useState({})
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('votes')
        .select('option_id')
        .eq('poll_id', pollId)

      if (error) return

      const map = {}
      for (const o of options) map[o.id] = 0
      for (const v of data || []) map[v.option_id] = (map[v.option_id] || 0) + 1

      const t = Object.values(map).reduce((a, b) => a + b, 0)
      setCounts(map)
      setTotal(t)
    }

    load()
  }, [pollId, options])

  return (
    <>
      {options.map((option) => {
        const votes = counts[option.id] || 0
        const percentage = total > 0 ? (votes / total) * 100 : 0
        return (
          <div key={option.id} className="result-bar">
            <div className="result-info">
              <span className="result-name">{option.name}</span>
              <span className="result-count">{votes} votes ({percentage.toFixed(1)}%)</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${percentage}%` }}></div>
            </div>
          </div>
        )
      })}
      <p className="total-votes">Total votes: {total}</p>
    </>
  )
}

export default Vote