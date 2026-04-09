import React, { useContext, useEffect } from 'react'
import { authContext } from '../components/context/AuthContext'
import { useNavigate, Outlet } from 'react-router-dom'

const ProtectedRoutes = () => {

  const { user, loading } = useContext(authContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth")
    }
  }, [user, loading, navigate])

  if (loading) {
    return <h1 className='text-center mt-5'>Checking Authentication...</h1>
  }

  return user ? <Outlet /> : null
}

export default ProtectedRoutes