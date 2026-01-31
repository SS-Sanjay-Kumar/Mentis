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

const App = () => {
  const { isSignedIn } = useUser();
  return (
    <>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/problems' element={isSignedIn ? <ProblemsPage /> : <Navigate to="/" />} />
      </Routes>
      <Toaster position='top-right' />
    </>
    // todo: react-query (tanstack)
  )
}

export default App