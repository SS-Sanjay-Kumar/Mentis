import React from 'react'
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
  useUser,
} from '@clerk/clerk-react'
import { Routes, Route, Navigate } from 'react-router'
import { Toaster } from 'react-hot-toast';

import HomePage from './pages/HomePage'
import ProblemsPage from './pages/ProblemsPage'
import DashboardPage from './pages/DashboardPage';

const App = () => {
  const { isSignedIn, isLoaded } = useUser();
  if (!isLoaded) return null
  return (
    <>
      <Routes>
        <Route path='/' element={!isSignedIn ? <HomePage /> : <Navigate to="/dashboard" />} />
        <Route path='/dashboard' element={isSignedIn ? <DashboardPage /> : <Navigate to="/" />} />
        <Route path='/problems' element={isSignedIn ? <ProblemsPage /> : <Navigate to="/" />} />
      </Routes>
      <Toaster position='top-right' />
    </>
    // todo: react-query (tanstack)
  )
}

export default App