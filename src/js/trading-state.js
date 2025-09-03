export class TradingState {
  constructor() {
    this.state = {
      startingCapital: 10000,
      currentEquity: 10000,
      dailyStartEquity: 10000,
      tradesCount: 0,
      winCount: 0,
      currentPair: 'None',
      sessionActive: false,
      daysSinceBreak: 0
    };
    
    this.observers = [];
  }

  subscribe(callback) {
    this.observers.push(callback);
  }

  notify() {
    this.observers.forEach(callback => callback(this.state));
  }

  updateEquity(amount) {
    this.state.currentEquity += amount;
    this.notify();
  }

  addTrade(isWin) {
    this.state.tradesCount++;
    if (isWin) this.state.winCount++;
    this.state.sessionActive = true;
    this.state.currentPair = 'EUR/USD';
    this.notify();
  }

  reset() {
    this.state = {
      startingCapital: 10000,
      currentEquity: 10000,
      dailyStartEquity: 10000,
      tradesCount: 0,
      winCount: 0,
      currentPair: 'None',
      sessionActive: false,
      daysSinceBreak: 0
    };
    this.notify();
  }

  getMetrics() {
    const dailyPnL = this.state.currentEquity - this.state.dailyStartEquity;
    const dailyPnLPercent = (dailyPnL / this.state.dailyStartEquity) * 100;
    const drawdownPercent = Math.max(0, ((this.state.startingCapital - this.state.currentEquity) / this.state.startingCapital) * 100);
    const winRate = this.state.tradesCount > 0 ? (this.state.winCount / this.state.tradesCount) * 100 : 0;
    const targetProgress = Math.min(Math.max(dailyPnLPercent, 0), 100);

    return {
      dailyPnL,
      dailyPnLPercent,
      drawdownPercent,
      winRate,
      targetProgress
    };
  }
}