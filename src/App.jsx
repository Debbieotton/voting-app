import React, { useEffect, useState } from 'react'
import { useAuth } from './hooks/useAuth'
import './App.css'

import Layout from './components/layout/Layout'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

import Landing from './components/auth/Landing'
import SignUp from './components/auth/SignUp'
import SignIn from './components/auth/SignIn'

import Home from './components/pages/Home'
import Vote from './components/vote/Vote'
import Profile from './components/pages/Profile'
import Results from './components/pages/Results'

function App() {
  const [currentPage, setCurrentPage] = useState('landing')
  const [showSignOutModal, setShowSignOutModal] = useState(false)
  const { user, isAuthenticated, login, logout, register } = useAuth()

  useEffect(() => {
    setCurrentPage(isAuthenticated ? 'home' : 'landing')
  }, [isAuthenticated])

  const handleSignUp = async (userData) => {
    try {
      await register({ email: userData.email, password: userData.password })
      setCurrentPage('signin')
    } catch (error) {
      alert(error.message)
    }
  }

  const handleSignIn = async (credentials) => {
    try {
      await login({ email: credentials.email, password: credentials.password })
      setCurrentPage('home')
    } catch (error) {
      alert(error.message)
    }
  }

  const handleSignOutClick = () => {
    setShowSignOutModal(true)
  }

  const handleConfirmSignOut = async () => {
    try {
      await logout()
      setShowSignOutModal(false)
      setCurrentPage('landing')
    } catch (error) {
      alert(error.message)
    }
  }

  const handleCancelSignOut = () => {
    setShowSignOutModal(false)
  }

  const handleNavigate = (page) => {
    setCurrentPage(page)
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <Landing onNavigate={handleNavigate} />

      case 'signup':
        return <SignUp onSignUp={handleSignUp} onNavigate={handleNavigate} />

      case 'signin':
        return <SignIn onSignIn={handleSignIn} onNavigate={handleNavigate} />

      case 'home':
        return <Home user={user} onNavigate={handleNavigate} />

      case 'vote':
        return <Vote user={user} />

      case 'profile':
        return <Profile user={user} />

      case 'results':
        return <Results user={user} />

      default:
        return <Landing onNavigate={handleNavigate} />
    }
  }

  const showNavbar = isAuthenticated && ['home', 'vote', 'profile', 'results'].includes(currentPage)
  const showFooter = isAuthenticated

  return (
    <Layout
      navbar={showNavbar ? <Navbar onSignOut={handleSignOutClick} onNavigate={handleNavigate} /> : null}
      footer={showFooter ? <Footer /> : null}
    >
      {renderPage()}

      {showSignOutModal && (
        <div className="modal-overlay" onClick={handleCancelSignOut}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Sign Out</h3>
            <p>Are you sure you want to sign out?</p>
            <div className="modal-buttons">
              <button className="btn primary" onClick={handleConfirmSignOut}>
                Yes
              </button>
              <button className="btn secondary" onClick={handleCancelSignOut}>
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default App