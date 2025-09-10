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

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

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

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <h1>FXFORECAST</h1>
          <p>Professional forex trading education, market analysis, and funded trading opportunities</p>
          <div className="cta-buttons">
            <button className="btn-primary" onClick={() => setActiveSection('calculator')}>
              <Calculator className="icon" />
              Trading Calculator
            </button>
            <button className="btn-secondary" onClick={() => setActiveSection('mentorship')}>
              <Users className="icon" />
              Get Mentorship
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="main-content">
        {activeSection === 'home' && (
          <section id="home" class="section active">
            <div className="section-header">
              <h2>Welcome to FXFORECAST</h2>
              <p>Your complete forex trading education and market analysis platform</p>
            </div>
            
            <div className="features-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <TrendingUp className="icon" />
                </div>
                <h3>Market Analysis</h3>
                <p>Real-time market insights and professional trading signals to guide your decisions.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <Calculator className="icon" />
                </div>
                <h3>Trading Tools</h3>
                <p>Advanced calculators for position sizing, risk management, and profit calculations.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <BookOpen className="icon" />
                </div>
                <h3>Education Hub</h3>
                <p>Comprehensive trading courses from beginner basics to advanced strategies.</p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <Users className="icon" />
                </div>
                <h3>Mentorship</h3>
                <p>One-on-one guidance from experienced traders to accelerate your learning.</p>
              </div>
            </div>

            {/* Additional Features */}
            <div className="additional-features">
              <div className="feature-row">
                <div className="feature-item">
                  <div className="feature-icon">
                    <i className="fas fa-chart-line"></i>
                  </div>
                  <h3 className="feature-title">Forex Market Analysis</h3>
                  <p>Professional market forecasts and analysis tools to optimize your forex trading performance.</p>
                </div>
                
                <div className="feature-item">
                  <div className="feature-icon">
                    <i className="fas fa-graduation-cap"></i>
                  </div>
                  <h3 className="feature-title">Forex Education</h3>
                  <p>Learn from experienced forex traders with proven track records in currency markets.</p>
                </div>
                
                <div className="feature-item">
                  <div className="feature-icon">
                    <i className="fas fa-users"></i>
                  </div>
                  <h3 className="feature-title">Community Support</h3>
                  <p>Join our active community of traders sharing insights and strategies.</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeSection === 'blog' && (
          <section id="blog" className="section">
            <div className="section-header">
              <h2>Forex Insights & Market Analysis</h2>
              <p>Stay updated with the latest forex market analysis and trading strategies</p>
            </div>
            
            <div className="blog-grid">
              <article className="blog-card">
                <div className="blog-image">
                  <ChartBar className="icon" />
                </div>
                <div className="blog-content">
                  <h3>Understanding Market Volatility</h3>
                  <p>Learn how to navigate volatile markets and turn uncertainty into opportunity.</p>
                  <span className="blog-date">March 15, 2024</span>
                </div>
              </article>
              
              <article className="blog-card">
                <div className="blog-image">
                  <Target className="icon" />
                </div>
                <div className="blog-content">
                  <h3>Risk Management Strategies</h3>
                  <p>Essential techniques to protect your capital and maximize long-term profits.</p>
                  <span className="blog-date">March 12, 2024</span>
                </div>
              </article>
              
              <article className="blog-card">
                <div className="blog-image">
                  <Brain className="icon" />
                </div>
                <div className="blog-content">
                  <h3>Trading Psychology Mastery</h3>
                  <p>Develop the mental discipline required for consistent trading success.</p>
                  <span className="blog-date">March 10, 2024</span>
                </div>
              </article>
            </div>
          </section>
        )}

        {activeSection === 'calculator' && (
          <section id="calculator" className="section">
            <div className="section-header">
              <h2>Trading Calculator Suite</h2>
              <p>Professional tools to optimize your trading performance</p>
            </div>
            
            <div className="calculator-grid">
              <div className="calculator-card">
                <div className="calc-header">
                  <Calculator className="icon" />
                  <h3>Position Size Calculator</h3>
                </div>
                <div className="calc-form">
                  <div className="form-group">
                    <label>Account Balance ($)</label>
                    <input type="number" placeholder="10000" />
                  </div>
                  <div className="form-group">
                    <label>Risk Percentage (%)</label>
                    <input type="number" placeholder="2" />
                  </div>
                  <div className="form-group">
                    <label>Stop Loss (pips)</label>
                    <input type="number" placeholder="50" />
                  </div>
                  <button className="calc-button">Calculate Position</button>
                  <div className="calc-result">
                    <span>Recommended Position: 0.4 lots</span>
                  </div>
                </div>
              </div>
              
              <div className="calculator-card">
                <div className="calc-header">
                  <DollarSign className="icon" />
                  <h3>Profit/Loss Calculator</h3>
                </div>
                <div className="calc-form">
                  <div className="form-group">
                    <label>Position Size (lots)</label>
                    <input type="number" placeholder="0.1" />
                  </div>
                  <div className="form-group">
                    <label>Entry Price</label>
                    <input type="number" placeholder="1.2500" />
                  </div>
                  <div className="form-group">
                    <label>Exit Price</label>
                    <input type="number" placeholder="1.2550" />
                  </div>
                  <button className="calc-button">Calculate P&L</button>
                  <div className="calc-result">
                    <span>Profit: $50.00</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeSection === 'mentorship' && (
          <section id="mentorship" className="section">
            <div className="section-header">
              <h2>Professional Trading Mentorship</h2>
              <p>Accelerate your trading journey with expert guidance</p>
            </div>
            
            <div className="mentorship-content">
              <div className="mentorship-features">
                <div className="mentor-card">
                  <div className="mentor-icon">
                    <ChalkboardTeacher className="icon" />
                  </div>
                  <h3>1-on-1 Coaching</h3>
                  <p>Personalized sessions tailored to your trading goals and experience level.</p>
                </div>
                
                <div className="mentor-card">
                  <div className="mentor-icon">
                    <University className="icon" />
                  </div>
                  <h3>Structured Curriculum</h3>
                  <p>Progressive learning path from basics to advanced trading strategies.</p>
                </div>
                
                <div className="mentor-card">
                  <div className="mentor-icon">
                    <Headphones className="icon" />
                  </div>
                  <h3>24/7 Support</h3>
                  <p>Get answers to your questions and guidance whenever you need it.</p>
                </div>
              </div>
              
              <div className="pricing-section">
                <h3>Mentorship Packages</h3>
                <div className="pricing-grid">
                  <div className="pricing-card">
                    <h4>Starter</h4>
                    <div className="price">$297/month</div>
                    <ul>
                      <li><Check className="check-icon" />2 Sessions per month</li>
                      <li><Check className="check-icon" />Email support</li>
                      <li><Check className="check-icon" />Trading plan review</li>
                    </ul>
                    <button className="pricing-button">Get Started</button>
                  </div>
                  
                  <div className="pricing-card featured">
                    <h4>Professional</h4>
                    <div className="price">$497/month</div>
                    <ul>
                      <li><Check className="check-icon" />4 Sessions per month</li>
                      <li><Check className="check-icon" />Priority support</li>
                      <li><Check className="check-icon" />Live trading sessions</li>
                      <li><Check className="check-icon" />Custom strategies</li>
                    </ul>
                    <button className="pricing-button">Most Popular</button>
                  </div>
                  
                  <div className="pricing-card">
                    <h4>Elite</h4>
                    <div className="price">$997/month</div>
                    <ul>
                      <li><Check className="check-icon" />Unlimited sessions</li>
                      <li><Check className="check-icon" />24/7 direct access</li>
                      <li><Check className="check-icon" />Portfolio management</li>
                      <li><Check className="check-icon" />Funded account opportunities</li>
                    </ul>
                    <button className="pricing-button">Go Elite</button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>FXFORECAST</h3>
            <p>Professional trading education and tools for serious traders.</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#" onClick={() => setActiveSection('home')}>Home</a></li>
              <li><a href="#" onClick={() => setActiveSection('blog')}>Blog</a></li>
              <li><a href="#" onClick={() => setActiveSection('calculator')}>Calculator</a></li>
              <li><a href="#" onClick={() => setActiveSection('mentorship')}>Mentorship</a></li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact</h4>
            <p>Email: info@fxforecast.com</p>
            <p>Phone: +1 (555) 123-4567</p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 FXFORECAST. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}

export default App;