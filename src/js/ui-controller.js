export class UIController {
  constructor(tradingState, calculator) {
    this.tradingState = tradingState;
    this.calculator = calculator;
    this.init();
  }

  init() {
    this.tradingState.subscribe((state) => this.updateDisplay(state));
    this.setupEventListeners();
    this.updateDisplay(this.tradingState.state);
  }

  setupEventListeners() {
    // Calculator inputs
    const inputs = ['accountSize', 'riskPercent', 'entryPrice', 'exitPrice', 'leverage', 'currencyPair'];
    inputs.forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener('input', () => this.calculatePosition());
        element.addEventListener('change', () => this.calculatePosition());
      }
    });

    // Demo buttons
    document.getElementById('winTradeBtn')?.addEventListener('click', () => this.simulateTrade(true));
    document.getElementById('loseTradeBtn')?.addEventListener('click', () => this.simulateTrade(false));
    document.getElementById('resetBtn')?.addEventListener('click', () => this.resetAccount());
    document.getElementById('calculateBtn')?.addEventListener('click', () => this.calculatePosition());
  }

  updateDisplay(state) {
    const metrics = this.tradingState.getMetrics();
    
    // Update basic metrics
    this.updateElement('startingCapital', state.startingCapital.toLocaleString());
    this.updateElement('currentEquity', state.currentEquity.toLocaleString());
    this.updateElement('tradesCount', state.tradesCount);
    this.updateElement('currentPair', state.currentPair);
    this.updateElement('sessionActive', state.sessionActive ? 'Yes' : 'No');
    this.updateElement('daysSinceBreak', state.daysSinceBreak);

    // Update daily P&L with color
    const dailyPnLElement = document.getElementById('dailyPnL');
    if (dailyPnLElement) {
      dailyPnLElement.textContent = (metrics.dailyPnL >= 0 ? '+' : '') + '$' + metrics.dailyPnL.toFixed(2);
      dailyPnLElement.style.color = metrics.dailyPnL >= 0 ? '#00ff9d' : '#ff3838';
    }

    // Update drawdown with color
    const drawdownElement = document.getElementById('drawdownPercent');
    if (drawdownElement) {
      drawdownElement.textContent = metrics.drawdownPercent.toFixed(2) + '%';
      drawdownElement.style.color = metrics.drawdownPercent > 3 ? '#ff3838' : '#00ff9d';
    }

    // Update win rate
    this.updateElement('winRate', metrics.winRate.toFixed(1) + '%');

    // Update progress ring
    this.updateProgressRing(metrics.targetProgress);

    // Update status indicators
    this.updateStatusIndicators();

    // Check for alerts
    this.checkAlerts(metrics.drawdownPercent, metrics.dailyPnLPercent);
  }

  updateElement(id, value) {
    const element = document.getElementById(id);
    if (element) element.textContent = value;
  }

  updateProgressRing(progress) {
    const circumference = 2 * Math.PI * 50;
    const offset = circumference - (progress / 100) * circumference;
    
    const progressElement = document.getElementById('targetProgress');
    const textElement = document.getElementById('targetText');
    
    if (progressElement) progressElement.style.strokeDashoffset = offset;
    if (textElement) textElement.textContent = progress.toFixed(0) + '%';
  }

  updateStatusIndicators() {
    const indicators = [
      { id: 'marginStatus', class: 'status-safe' },
      { id: 'riskStatus', class: 'status-safe' },
      { id: 'sessionStatus', class: this.tradingState.state.sessionActive ? 'status-safe' : 'status-warning' }
    ];

    indicators.forEach(({ id, class: className }) => {
      const element = document.getElementById(id);
      if (element) {
        element.className = `status-indicator ${className}`;
      }
    });

    this.updateElement('marginUsage', '15%');
    this.updateElement('riskPerTrade', '0.5%');
  }

  checkAlerts(drawdownPercent, dailyPnLPercent) {
    this.clearAlerts();

    if (drawdownPercent >= 5) {
      this.showAlert('danger', 'MANDATORY BREAK: 5% drawdown reached. Take minimum 1-week break!');
    } else if (drawdownPercent >= 3) {
      this.showAlert('warning', 'WARNING: Approaching 5% drawdown limit');
    }

    if (dailyPnLPercent >= 1) {
      this.showAlert('success', 'TARGET ACHIEVED: 1% daily target reached. Consider exiting market!');
    }
  }

  clearAlerts() {
    const resultDiv = document.getElementById('calculationResult');
    if (resultDiv) {
      const alerts = resultDiv.querySelectorAll('.alert');
      alerts.forEach(alert => {
        if (alert.textContent.includes('MANDATORY') || 
            alert.textContent.includes('WARNING') || 
            alert.textContent.includes('TARGET')) {
          alert.remove();
        }
      });
    }
  }

  showAlert(type, message) {
    const resultDiv = document.getElementById('calculationResult');
    if (resultDiv) {
      const alertDiv = document.createElement('div');
      alertDiv.className = `alert alert-${type}`;
      alertDiv.textContent = message;
      resultDiv.appendChild(alertDiv);
    }
  }

  calculatePosition() {
    const params = {
      accountSize: parseFloat(document.getElementById('accountSize')?.value) || 10000,
      riskPercent: parseFloat(document.getElementById('riskPercent')?.value) || 0.5,
      entryPrice: parseFloat(document.getElementById('entryPrice')?.value) || 1.1650,
      stopLoss: parseFloat(document.getElementById('exitPrice')?.value) || 1.1600,
      currencyPair: document.getElementById('currencyPair')?.value || 'EURUSD',
      leverage: parseFloat(document.getElementById('leverage')?.value) || 100
    };

    try {
      const result = this.calculator.calculate(params);
      this.displayCalculationResult(result, params);
      
      if (params.riskPercent > 0.5) {
        this.showAlert('warning', 'Risk exceeds maximum 0.5% per trade rule');
      }
      
      if (result.marginPercent > 20) {
        this.showAlert('danger', 'MARGIN VIOLATION: Exceeds 20% maximum margin rule!');
      }
    } catch (error) {
      this.showAlert('danger', error.message);
    }
  }

  displayCalculationResult(result, params) {
    const resultDiv = document.getElementById('calculationResult');
    if (!resultDiv) return;

    // Remove existing calculation results
    const existingResults = resultDiv.querySelectorAll('.calculation-result');
    existingResults.forEach(el => el.remove());

    const resultsHTML = `
      <div class="calculation-result" style="background: rgba(0, 255, 157, 0.1); border: 1px solid rgba(0, 255, 157, 0.3); border-radius: 12px; padding: 25px; margin-top: 20px;">
        <h4 style="color: #00ff9d; margin-bottom: 20px; font-size: 1.2rem;">Position Calculation Results</h4>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-bottom: 20px;">
          <div class="metric">
            <span class="metric-label">Position Size</span>
            <span class="metric-value">${result.lotSize.toFixed(2)} lots</span>
          </div>
          <div class="metric">
            <span class="metric-label">Risk Amount</span>
            <span class="metric-value">$${result.riskAmount.toFixed(2)}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Margin Required</span>
            <span class="metric-value">$${result.marginRequired.toFixed(2)}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Margin %</span>
            <span class="metric-value" style="color: ${result.marginPercent > 20 ? '#ff3838' : '#00ff9d'}">${result.marginPercent.toFixed(2)}%</span>
          </div>
          <div class="metric">
            <span class="metric-label">Potential Profit</span>
            <span class="metric-value">$${result.potentialProfit.toFixed(2)}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Take Profit Price</span>
            <span class="metric-value">${result.profitPrice.toFixed(4)}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Pips at Risk</span>
            <span class="metric-value">${result.pipsAtRisk.toFixed(1)}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Direction</span>
            <span class="metric-value">${result.direction}</span>
          </div>
        </div>
        <div style="padding: 20px; background: rgba(0, 255, 157, 0.05); border-radius: 10px;">
          <h5 style="color: #00ff9d; margin-bottom: 12px; font-size: 1.1rem;">Trade Summary</h5>
          <p style="margin-bottom: 8px; font-size: 0.95rem;">
            ${result.direction} ${result.lotSize.toFixed(2)} lots of ${params.currencyPair} at ${params.entryPrice.toFixed(4)}
          </p>
          <p style="margin-bottom: 8px; font-size: 0.95rem;">
            Stop Loss: ${params.stopLoss.toFixed(4)} | Take Profit: ${result.profitPrice.toFixed(4)}
          </p>
          <p style="font-size: 0.95rem;">
            Risk/Reward: $${result.riskAmount.toFixed(2)} / $${result.potentialProfit.toFixed(2)} (1:1 ratio)
          </p>
        </div>
      </div>
    `;

    resultDiv.insertAdjacentHTML('beforeend', resultsHTML);
  }

  simulateTrade(isWin) {
    const riskAmount = 50;
    
    this.tradingState.addTrade(isWin);
    this.tradingState.updateEquity(isWin ? riskAmount : -riskAmount);
    
    this.showAlert(
      isWin ? 'success' : 'danger', 
      `${isWin ? 'Winning' : 'Losing'} trade simulated: ${isWin ? '+' : '-'}$${riskAmount.toFixed(2)}`
    );
  }

  resetAccount() {
    this.tradingState.reset();
    
    const resultDiv = document.getElementById('calculationResult');
    if (resultDiv) resultDiv.innerHTML = '';
    
    this.showAlert('success', 'Account reset to starting values');
  }
}