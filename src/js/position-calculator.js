export class PositionCalculator {
  constructor() {
    this.instrumentConfig = {
      // Forex pairs with JPY
      'USDJPY': { contractSize: 100000, pipSize: 0.01, pipMultiplier: 100 },
      'EURJPY': { contractSize: 100000, pipSize: 0.01, pipMultiplier: 100 },
      'GBPJPY': { contractSize: 100000, pipSize: 0.01, pipMultiplier: 100 },
      'AUDJPY': { contractSize: 100000, pipSize: 0.01, pipMultiplier: 100 },
      'NZDJPY': { contractSize: 100000, pipSize: 0.01, pipMultiplier: 100 },
      'CHFJPY': { contractSize: 100000, pipSize: 0.01, pipMultiplier: 100 },
      
      // Major forex pairs
      'EURUSD': { contractSize: 100000, pipSize: 0.0001, pipMultiplier: 10000 },
      'GBPUSD': { contractSize: 100000, pipSize: 0.0001, pipMultiplier: 10000 },
      'USDCHF': { contractSize: 100000, pipSize: 0.0001, pipMultiplier: 10000 },
      'AUDUSD': { contractSize: 100000, pipSize: 0.0001, pipMultiplier: 10000 },
      'NZDUSD': { contractSize: 100000, pipSize: 0.0001, pipMultiplier: 10000 },
      'USDCAD': { contractSize: 100000, pipSize: 0.0001, pipMultiplier: 10000 },
      
      // Minor pairs
      'EURGBP': { contractSize: 100000, pipSize: 0.0001, pipMultiplier: 10000 },
      'EURCHF': { contractSize: 100000, pipSize: 0.0001, pipMultiplier: 10000 },
      'GBPCHF': { contractSize: 100000, pipSize: 0.0001, pipMultiplier: 10000 },
      'AUDCHF': { contractSize: 100000, pipSize: 0.0001, pipMultiplier: 10000 },
      'NZDCHF': { contractSize: 100000, pipSize: 0.0001, pipMultiplier: 10000 },
      
      // Precious metals
      'XAUUSD': { contractSize: 100, pipSize: 0.1, pipMultiplier: 10 },
      'XAGUSD': { contractSize: 5000, pipSize: 0.01, pipMultiplier: 100 },
      
      // Indices
      'US30': { contractSize: 1, pipSize: 1, pipMultiplier: 1 },
      'US500': { contractSize: 1, pipSize: 1, pipMultiplier: 1 },
      'NAS100': { contractSize: 0.1, pipSize: 1, pipMultiplier: 1 },
      'UK100': { contractSize: 1, pipSize: 1, pipMultiplier: 1 },
      'GER40': { contractSize: 1, pipSize: 1, pipMultiplier: 1 },
      
      // Crypto
      'BTCUSD': { contractSize: 1, pipSize: 1, pipMultiplier: 1 },
      'ETHUSD': { contractSize: 1, pipSize: 1, pipMultiplier: 1 }
    };
  }

  calculate(params) {
    const { accountSize, riskPercent, entryPrice, stopLoss, currencyPair, leverage } = params;
    
    if (!this.validateInputs(params)) {
      throw new Error('Invalid input parameters');
    }

    const config = this.instrumentConfig[currencyPair] || this.instrumentConfig['EURUSD'];
    const riskAmount = (riskPercent / 100) * accountSize;
    const priceDifference = Math.abs(entryPrice - stopLoss);
    const isLong = entryPrice < stopLoss;

    const pipsAtRisk = priceDifference * config.pipMultiplier;
    const pipValue = this.calculatePipValue(currencyPair, entryPrice, config);
    const lotSize = riskAmount / (pipsAtRisk * pipValue);
    const marginRequired = this.calculateMargin(lotSize, entryPrice, leverage, config, currencyPair);
    const marginPercent = (marginRequired / accountSize) * 100;
    
    const potentialProfit = riskAmount; // 1:1 RR
    const profitPrice = isLong ? entryPrice + priceDifference : entryPrice - priceDifference;

    return {
      lotSize,
      riskAmount,
      marginRequired,
      marginPercent,
      potentialProfit,
      profitPrice,
      pipsAtRisk,
      isLong,
      direction: isLong ? 'LONG' : 'SHORT'
    };
  }

  validateInputs({ accountSize, riskPercent, entryPrice, stopLoss }) {
    return accountSize > 0 && 
           riskPercent > 0 && 
           entryPrice > 0 && 
           stopLoss > 0 && 
           entryPrice !== stopLoss;
  }

  calculatePipValue(currencyPair, entryPrice, config) {
    if (currencyPair.includes('JPY')) {
      return (config.contractSize * config.pipSize) / entryPrice;
    } else if (currencyPair.startsWith('XAU')) {
      return 1; // $1 per pip for gold
    } else if (currencyPair.startsWith('XAG')) {
      return 5; // $5 per pip for silver
    } else if (currencyPair.startsWith('USD')) {
      return config.contractSize * config.pipSize;
    } else {
      return (config.contractSize * config.pipSize) / entryPrice;
    }
  }

  calculateMargin(lotSize, entryPrice, leverage, config, currencyPair) {
    if (currencyPair.startsWith('USD')) {
      return (lotSize * config.contractSize) / leverage;
    } else {
      return (lotSize * config.contractSize * entryPrice) / leverage;
    }
  }
}