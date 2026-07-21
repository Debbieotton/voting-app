import React, { useEffect, useState } from 'react'
import { Button } from '../ui/Button'
import { supabase } from '../../lib/supabase'

const Results = ({ user }) => {
  const [friends, setFriends] = useState([])
  const [friendEmail, setFriendEmail] = useState('')
  const [view, setView] = useState('list')
  const [selectedFriend, setSelectedFriend] = useState(null)
  const [friendPolls, setFriendPolls] = useState([])
  const [tokenBalance, setTokenBalance] = useState(0)

  useEffect(() => {
    const storedFriends = JSON.parse(localStorage.getItem(`friends_${user?.email}`) || '[]')
    setFriends(storedFriends)
  }, [user])

  useEffect(() => {
    const loadBalance = async () => {
      if (!user?.id) return
      const { data, error } = await supabase
        .from('earnings')
        .select('amount')
        .eq('user_id', user.id)

      if (error) return
      const total = (data || []).reduce((sum, r) => sum + (r.amount || 0), 0)
      setTokenBalance(total)
    }

    loadBalance()
  }, [user])

  const saveFriends = (newFriends) => {
    localStorage.setItem(`friends_${user?.email}`, JSON.stringify(newFriends))
    setFriends(newFriends)
  }

  const addFriend = () => {
    const email = friendEmail.trim().toLowerCase()
    if (!email) {
      alert('Please enter an email')
      return
    }

    if (email === user?.email?.toLowerCase()) {
      alert("You can't add yourself as a friend")
      return
    }

    if (friends.includes(email)) {
      alert('This friend is already added')
      return
    }

    saveFriends([...friends, email])
    setFriendEmail('')
  }

  const removeFriend = (email) => {
    saveFriends(friends.filter(f => f !== email))
  }

  const viewFriendPolls = async (email) => {
    const { data, error } = await supabase
      .from('polls')
      .select('id, question, creator_email, created_at, poll_options ( id, name )')
      .eq('creator_email', email)
      .order('created_at', { ascending: false })

    if (error) {
      alert(error.message)
      return
    }

    const normalized = (data || []).map(p => ({
      ...p,
      options: p.poll_options || []
    }))

    setFriendPolls(normalized)
    setSelectedFriend(email)
    setView('polls')
  }

  const renderFriendPolls = () => (
    <div className="vote-container">
      <Button className="secondary" onClick={() => setView('list')} style={{ marginBottom: '1rem' }}>
        ← Back to Friends
      </Button>

      <h2>{selectedFriend}'s Polls</h2>

      {friendPolls.length === 0 ? (
        <div className="poll-card" style={{ textAlign: 'center' }}>
          <p style={{ color: '#666' }}>No polls found for this email.</p>
        </div>
      ) : (
        friendPolls.map((poll) => (
          <div key={poll.id} className="poll-card">
            <div className="poll-question">
              <h3>{poll.question}</h3>
            </div>

            <div className="poll-results">
              <h4>Results</h4>
              <PollResults pollId={poll.id} options={poll.options} />
            </div>
          </div>
        ))
      )}
    </div>
  )

  return (
    <div className="page-content">
      <div className="vote-container">
        <h2>Friends & Results</h2>

        <div className="poll-card" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>Your Token Balance</h3>
          <p style={{ fontSize: '1.4rem', fontWeight: 700 }}>{tokenBalance} tokens</p>
        </div>

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
              <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.75rem' }}>
                Tip: Your friend’s polls will show once they create polls.
              </p>
            </div>

            <h3 style={{ marginBottom: '1rem' }}>Your Friends</h3>

            {friends.length === 0 ? (
              <div className="poll-card" style={{ textAlign: 'center' }}>
                <p style={{ color: '#666' }}>No friends added yet.</p>
              </div>
            ) : (
              friends.map(email => (
                <div key={email} className="poll-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ marginBottom: '0.25rem' }}>{email}</h3>
                      <p style={{ color: '#666', fontSize: '0.9rem' }}>View their polls + results</p>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <Button className="primary" onClick={() => viewFriendPolls(email)}>
                        View Polls
                      </Button>
                      <Button className="secondary" onClick={() => removeFriend(email)}>
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {view === 'polls' && renderFriendPolls()}
      </div>
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

export default Results