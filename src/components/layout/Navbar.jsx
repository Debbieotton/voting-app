import React from 'react'

const Navbar = ({ onSignOut, onNavigate }) => {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <h1 className="navbar-logo" onClick={() => onNavigate('home')}>
          Voting App
        </h1>
        <div className="nav-links">
          <button className="nav-btn" onClick={() => onNavigate('home')}>
            Home
          </button>
          <button className="nav-btn" onClick={() => onNavigate('vote')}>
            Create Vote
          </button>
          <button className="nav-btn" onClick={() => onNavigate('results')}>
            Results
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