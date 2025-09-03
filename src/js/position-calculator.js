export class PositionCalculator {
constructor() {
this.instrumentConfig = {
// Forex pairs with JPY
‘USDJPY’: { contractSize: 100000, pipSize: 0.01, pipMultiplier: 100 },
‘EURJPY’: { contractSize: 100000, pipSize: 0.01, pipMultiplier: 100 },
‘GBPJPY’: { contractSize: 100000, pipSize: 0.01, pipMultiplier: 100 },
‘AUDJPY’: { contractSize: 100000, pipSize: 0.01, pipMultiplier: 100 },
‘NZDJPY’: { contractSize: 100000, pipSize: 0.01, pipMultiplier: 100 },
‘CHFJPY’: { contractSize: 100000, pipSize: 0.01, pipMultiplier: 100 },

```
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
```

}

calculate(params) {
console.log(‘Input params:’, params);

```
const { accountSize, riskPercent, entryPrice, stopLoss, currencyPair, leverage = 100 } = params;

if (!this.validateInputs(params)) {
  console.error('Validation failed for params:', params);
  throw new Error('Invalid input parameters');
}

const config = this.instrumentConfig[currencyPair] || this.instrumentConfig['EURUSD'];
console.log('Using config for', currencyPair, ':', config);

const riskAmount = (riskPercent / 100) * accountSize;
const priceDifference = Math.abs(entryPrice - stopLoss);
const isLong = stopLoss < entryPrice; // Fixed: Long means SL is below entry

console.log('Risk amount:', riskAmount);
console.log('Price difference:', priceDifference);
console.log('Is long:', isLong);

const pipsAtRisk = priceDifference * config.pipMultiplier;
const pipValue = this.calculatePipValue(currencyPair, entryPrice, config);

console.log('Pips at risk:', pipsAtRisk);
console.log('Pip value:', pipValue);

if (pipValue === 0 || isNaN(pipValue)) {
  throw new Error(`Invalid pip value calculated: ${pipValue} for ${currencyPair}`);
}

const lotSize = riskAmount / (pipsAtRisk * pipValue);
const marginRequired = this.calculateMargin(lotSize, entryPrice, leverage, config, currencyPair);
const marginPercent = (marginRequired / accountSize) * 100;

const potentialProfit = riskAmount; // 1:1 RR
const profitPrice = isLong ? entryPrice + priceDifference : entryPrice - priceDifference;

const result = {
  lotSize: Number(lotSize.toFixed(4)),
  riskAmount: Number(riskAmount.toFixed(2)),
  marginRequired: Number(marginRequired.toFixed(2)),
  marginPercent: Number(marginPercent.toFixed(2)),
  potentialProfit: Number(potentialProfit.toFixed(2)),
  profitPrice: Number(profitPrice.toFixed(5)),
  pipsAtRisk: Number(pipsAtRisk.toFixed(1)),
  isLong,
  direction: isLong ? 'LONG' : 'SHORT',
  pipValue: Number(pipValue.toFixed(4)),
  currencyPair,
  entryPrice,
  stopLoss,
  leverage
};

console.log('Final result:', result);
return result;
```

}

validateInputs({ accountSize, riskPercent, entryPrice, stopLoss, currencyPair }) {
console.log(‘Validating inputs:’, { accountSize, riskPercent, entryPrice, stopLoss, currencyPair });

```
const isValid = accountSize > 0 && 
       riskPercent > 0 && 
       riskPercent <= 100 &&
       entryPrice > 0 && 
       stopLoss > 0 && 
       entryPrice !== stopLoss &&
       currencyPair && 
       typeof currencyPair === 'string';
       
console.log('Validation result:', isValid);
return isValid;
```

}

calculatePipValue(currencyPair, entryPrice, config) {
// For JPY pairs (XXX/JPY)
if (currencyPair.endsWith(‘JPY’)) {
return (config.contractSize * config.pipSize);
}
// For CHF pairs where CHF is the base (CHF/XXX)
else if (currencyPair.startsWith(‘CHF’)) {
return (config.contractSize * config.pipSize) * entryPrice;
}
// For precious metals
else if (currencyPair === ‘XAUUSD’) {
return config.contractSize * config.pipSize; // 100 * 0.1 = $10 per pip
}
else if (currencyPair === ‘XAGUSD’) {
return config.contractSize * config.pipSize; // 5000 * 0.01 = $50 per pip
}
// For USD base pairs (USD/XXX)
else if (currencyPair.startsWith(‘USD’)) {
return (config.contractSize * config.pipSize);
}
// For USD quote pairs (XXX/USD)
else if (currencyPair.endsWith(‘USD’)) {
return config.contractSize * config.pipSize;
}
// For cross pairs (XXX/XXX, neither USD)
else {
// This needs the USD conversion rate for the quote currency
// For now, return a basic calculation
return (config.contractSize * config.pipSize);
}
}

calculateMargin(lotSize, entryPrice, leverage, config, currencyPair) {
const notionalValue = lotSize * config.contractSize;

```
// For precious metals and indices, margin is based on notional value
if (currencyPair.startsWith('XAU') || currencyPair.startsWith('XAG') || 
    ['US30', 'US500', 'NAS100', 'UK100', 'GER40'].includes(currencyPair)) {
  return (notionalValue * entryPrice) / leverage;
}
// For crypto
else if (currencyPair.includes('BTC') || currencyPair.includes('ETH')) {
  return (notionalValue * entryPrice) / leverage;
}
// For forex pairs where USD is the quote currency
else if (currencyPair.endsWith('USD')) {
  return notionalValue / leverage;
}
// For other forex pairs, convert to USD equivalent
else {
  return (notionalValue * entryPrice) / leverage;
}
```

}

// Helper method to get account currency conversion rate if needed
getAccountCurrencyRate(currencyPair, accountCurrency = ‘USD’) {
// This would need to be implemented based on current exchange rates
// For now, assuming USD account
return 1;
}
}