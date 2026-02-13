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
    localStorage.setItem('user', JSON.stringify(userData))
    
    const userRegistry = JSON.parse(localStorage.getItem('userRegistry') || '{}')
    userRegistry[userData.email] = { username: userData.username, email: userData.email }
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