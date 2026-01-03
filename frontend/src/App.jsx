import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './utils/authContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
import CreateUrlPage from './pages/CreateUrlPage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-white flex flex-col">
          <Navbar />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/create-url" element={<CreateUrlPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App