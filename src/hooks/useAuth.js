import { useState, useEffect } from 'react'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser')
    if (currentUser) {
      setUser(JSON.parse(currentUser))
      setIsAuthenticated(true)
    }
  }, [])

  const login = (userData) => {
    setUser(userData)
    setIsAuthenticated(true)
    localStorage.setItem('currentUser', JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('currentUser')
  }

  const register = (userData) => {
    const userRegistry = JSON.parse(localStorage.getItem('userRegistry') || '{}')
    
    if (userRegistry[userData.email]) {
      throw new Error('Email already registered')
    }
    
    userRegistry[userData.email] = { 
      username: userData.username, 
      email: userData.email,
      password: userData.password 
    }
    localStorage.setItem('userRegistry', JSON.stringify(userRegistry))
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    register
  }
}