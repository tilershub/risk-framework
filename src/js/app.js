import { TradingState } from './trading-state.js';
import { PositionCalculator } from './position-calculator.js';
import { UIController } from './ui-controller.js';

class TradingApp {
  constructor() {
    this.tradingState = new TradingState();
    this.calculator = new PositionCalculator();
    this.uiController = new UIController(this.tradingState, this.calculator);
  }

  init() {
    console.log('FXFORECAST Trading Framework initialized');
    
    // Add smooth scrolling
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Setup navigation
    this.setupNavigation();
    
    // Add loading optimization
    this.optimizeLoading();
  }

  setupNavigation() {
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      });
    });
  }

  optimizeLoading() {
    // Add intersection observer for animations
    this.setupIntersectionObserver();
    
    // Optimize images and resources
    this.optimizeResources();
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: '50px'
    });

    // Observe cards for fade-in animation
    document.querySelectorAll('.card, .rule-card').forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(card);
    });
  }

  optimizeResources() {
    // Preload critical resources
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'style';
    preloadLink.href = 'src/styles/main.css';
    document.head.appendChild(preloadLink);

    // Add resource hints for external links
    const dnsLinks = ['https://ftmo.com', 'https://fonts.googleapis.com'];
    dnsLinks.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = url;
      document.head.appendChild(link);
    });
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.app = new TradingApp();
  window.app.init();
});

// Global functions for backward compatibility
window.calculatePosition = () => {
  window.app?.uiController?.calculatePosition();
};

window.simulateTrade = (isWin) => {
  window.app?.uiController?.simulateTrade(isWin);
};

window.resetAccount = () => {
  window.app?.uiController?.resetAccount();
};