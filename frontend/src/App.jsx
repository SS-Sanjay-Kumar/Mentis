import { useUser } from '@clerk/clerk-react';
import { Toaster } from 'react-hot-toast';
import { Navigate, Route, Routes } from 'react-router';

import DashboardPage from './pages/DashboardPage';
import HomePage from './pages/HomePage';
import ProblemPage from './pages/ProblemPage';
import ProblemsPage from './pages/ProblemsPage';
import SessionsPage from './pages/SessionsPage';
import ThemesPage from './pages/ThemesPage';

const App = () => {
  const { isSignedIn, isLoaded } = useUser();
  if (!isLoaded) return null
  return (
    <>
      <Routes>
        <Route path="/themes" element={<ThemesPage />} />
        <Route path='/' element={!isSignedIn ? <HomePage /> : <Navigate to={"/dashboard"} />} />
        <Route path='/dashboard' element={isSignedIn ? <DashboardPage /> : <Navigate to={"/"} />} />
        <Route path='/problems' element={isSignedIn ? <ProblemsPage /> : <Navigate to={"/"} />} />
        <Route path='/problem/:id' element={isSignedIn ? <ProblemPage /> : <Navigate to={"/"} />} />
        <Route path='/session/:id' element={isSignedIn ? <SessionsPage /> : <Navigate to={"/"} />} />
      </Routes>
      <Toaster position='top-right' />
    </>
    // todo: react-query (tanstack)
  )
}

export default App