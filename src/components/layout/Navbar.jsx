import React from 'react'

const Navbar = ({ user, onSignOut, onNavigate }) => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <h1>Voting App</h1>
        <div className="nav-links">
          <button className="nav-btn" onClick={() => onNavigate('vote')}>
            Vote
          </button>
          <button className="nav-btn" onClick={() => onNavigate('profile')}>
            Profile
          </button>
          <button className="nav-btn" onClick={onSignOut}>
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar