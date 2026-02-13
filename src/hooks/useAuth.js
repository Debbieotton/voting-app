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
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    register
  }
}