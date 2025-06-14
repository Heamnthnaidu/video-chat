import React, { useState } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import SignUp from './pages/SignUp'
import Login from './pages/Login'
import OnBoarding from './pages/OnBoarding'
import Call from './pages/Call'
import ChatPage from './pages/Chat'
import Notifications from './pages/Notifications'
import { Toaster } from 'react-hot-toast'
import PageLoader from './components/PageLoader'
import useAuthUser from './hooks/useAuthUser'
import Layout from './components/Layout'
import { useThemeStore } from './store/useThemeStore'

const App = () => {

  const {isLoading, authUser} = useAuthUser()

  const isAuthenticated = Boolean(authUser)
  const isOnboarded = authUser?.isOnboarded

  const {theme} = useThemeStore()

  if(isLoading) return <PageLoader />

  return (
    <div className='h-screen' data-theme={theme}>
      <Toaster />
      <Routes>
        <Route path='/' element={isAuthenticated && isOnboarded ? (<Layout showSidebar={true}><Home /></Layout>) : (<Navigate to={!isAuthenticated ? '/login' : '/onboarding'} />)} />
        <Route path='/signup' element={!isAuthenticated ? <SignUp /> : <Navigate to={isOnboarded ? '/' : '/onboarding'} />} />
        <Route path='/login' element={!isAuthenticated ? <Login /> : <Navigate to={isOnboarded ? '/' : '/onboarding'} />} />
        <Route path='/onboarding' element={isAuthenticated ? (!isOnboarded ? (<OnBoarding />) : (<Navigate to='/' />)) : (<Navigate to='/login' />)} />
        <Route path='/call/:id' element={isAuthenticated && isOnboarded ? (<Call />) : (<Navigate to={!isAuthenticated ? '/login' : '/onboarding'} />) } />
        <Route path='/chat/:id' element={isAuthenticated && isOnboarded ? (<Layout showSidebar={false}> <ChatPage /> </Layout>) : (<Navigate to={!isAuthenticated ? '/login' : '/onboarding' } />)} />
        <Route path='/notifications' element={isAuthenticated && isOnboarded? (<Layout showSidebar={true}> <Notifications /> </Layout>) : (<Navigate to={isAuthenticated ? '/login' : '/onboarding'} />)} />
      </Routes>
    </div>
  )
}

export default App