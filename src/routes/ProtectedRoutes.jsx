import React, { useContext } from 'react'
import { authContext } from '../components/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Outlet } from 'react-router-dom'

const ProtectedRoutes = () => {

  const { user, loading } = useContext(authContext)

  const navigate = useNavigate()


  if (!user) {

    navigate("/auth")

  }

  if (loading) {

    return <h1 className='text-center mt-5' >checking Authentication......</h1>

  }
  return (
    <Outlet />
  )
}

export default ProtectedRoutes