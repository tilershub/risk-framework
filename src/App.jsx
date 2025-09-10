import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import { AuthProvider } from './contexts/AuthContext';
import { BlogProvider } from './contexts/BlogContext';
import { TrendingUp, Calculator, Users, BookOpen, ChartBar, Target, Brain, Coins, Bot, Globe, ChalkboardTeacher, University, DollarSign, Headphones, MoneyBillWave, Check } from 'lucide-react';
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState('home');

  return (
    <AuthProvider>
      <BlogProvider>
        <div className="App">
          <Routes>
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<MainWebsite activeSection={activeSection} setActiveSection={setActiveSection} />} />
          </Routes>
          <Toaster position="top-right" />
        </div>
      </BlogProvider>
    </AuthProvider>
  );
}

function MainWebsite({ activeSection, setActiveSection }) {
  return (
    <>
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <a href="#" className="logo">FXFORECAST</a>
          <ul className="nav-menu">
            <li><a href="#" className="nav-link" onClick={() => setActiveSection('home')}>Home</a></li>
            <li><a href="#" className="nav-link" onClick={() => setActiveSection('blog')}>Blog</a></li>
            <li><a href="#" className="nav-link" onClick={() => setActiveSection('calculator')}>Calculator</a></li>
            <li><a href="#" className="nav-link" onClick={() => setActiveSection('mentorship')}>Mentorship</a></li>
            <li><a href="/admin" className="nav-link">Admin</a></li>
          </ul>
        </div>
      </nav>

export default App
    </>
  );
}

export default App;