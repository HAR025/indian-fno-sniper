const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Master Indian FnO Instruments Database
// tvSymbol: optimized for TradingView Widget without NSE embed block
// officialSymbol: for opening directly on TradingView official website
const FNO_INSTRUMENTS = [
  {
    id: 'nifty',
    name: 'NIFTY 50',
    symbol: 'NSE:NIFTY',
    tvSymbol: 'CAPITALCOM:NIFTY50',
    etfSymbol: 'NSE:NIFTYBEES',
    officialSymbol: 'NSE:NIFTY',
    category: 'Index',
    basePrice: 25420.50,
    lotSize: 25,
    strikeStep: 50,
    change: '+0.68%',
    isPositive: true,
    dayHigh: 25480.00,
    dayLow: 25310.20
  },
  {
    id: 'banknifty',
    name: 'BANK NIFTY',
    symbol: 'NSE:BANKNIFTY',
    tvSymbol: 'CAPITALCOM:BANKNIFTY',
    etfSymbol: 'NSE:BANKBEES',
    officialSymbol: 'NSE:BANKNIFTY',
    category: 'Index',
    basePrice: 52940.80,
    lotSize: 15,
    strikeStep: 100,
    change: '+1.12%',
    isPositive: true,
    dayHigh: 53120.00,
    dayLow: 52650.00
  },
  {
    id: 'sensex',
    name: 'BSE SENSEX',
    symbol: 'BSE:SENSEX',
    tvSymbol: 'BSE:SENSEX',
    etfSymbol: 'BSE:SENSEX',
    officialSymbol: 'BSE:SENSEX',
    category: 'Index',
    basePrice: 83180.20,
    lotSize: 10,
    strikeStep: 100,
    change: '+0.72%',
    isPositive: true,
    dayHigh: 83350.00,
    dayLow: 82890.00
  },
  {
    id: 'finnifty',
    name: 'FIN NIFTY',
    symbol: 'NSE:FINNIFTY',
    tvSymbol: 'CAPITALCOM:FINNIFTY',
    etfSymbol: 'NSE:NIFTYBEES',
    officialSymbol: 'NSE:FINNIFTY',
    category: 'Index',
    basePrice: 24150.30,
    lotSize: 25,
    strikeStep: 50,
    change: '+0.54%',
    isPositive: true,
    dayHigh: 24220.00,
    dayLow: 24080.00
  },
  {
    id: 'midcpnifty',
    name: 'MIDCAP NIFTY',
    symbol: 'NSE:MIDCPNIFTY',
    tvSymbol: 'CAPITALCOM:NIFTY50',
    etfSymbol: 'NSE:NIFTYBEES',
    officialSymbol: 'NSE:MIDCPNIFTY',
    category: 'Index',
    basePrice: 13240.60,
    lotSize: 50,
    strikeStep: 25,
    change: '-0.22%',
    isPositive: false,
    dayHigh: 13310.00,
    dayLow: 13190.00
  },
  {
    id: 'reliance',
    name: 'RELIANCE',
    symbol: 'BSE:RELIANCE',
    tvSymbol: 'BSE:RELIANCE',
    etfSymbol: 'NSE:RELIANCE',
    officialSymbol: 'NSE:RELIANCE',
    category: 'Stock',
    basePrice: 2985.40,
    lotSize: 250,
    strikeStep: 20,
    change: '+1.45%',
    isPositive: true,
    dayHigh: 3010.00,
    dayLow: 2955.00
  },
  {
    id: 'hdfcbank',
    name: 'HDFC BANK',
    symbol: 'BSE:HDFCBANK',
    tvSymbol: 'BSE:HDFCBANK',
    etfSymbol: 'NSE:HDFCBANK',
    officialSymbol: 'NSE:HDFCBANK',
    category: 'Stock',
    basePrice: 1675.20,
    lotSize: 550,
    strikeStep: 10,
    change: '+0.95%',
    isPositive: true,
    dayHigh: 1688.00,
    dayLow: 1662.00
  },
  {
    id: 'icicibank',
    name: 'ICICI BANK',
    symbol: 'BSE:ICICIBANK',
    tvSymbol: 'BSE:ICICIBANK',
    etfSymbol: 'NSE:ICICIBANK',
    officialSymbol: 'NSE:ICICIBANK',
    category: 'Stock',
    basePrice: 1245.80,
    lotSize: 700,
    strikeStep: 10,
    change: '+1.20%',
    isPositive: true,
    dayHigh: 1255.00,
    dayLow: 1232.00
  },
  {
    id: 'tatamotors',
    name: 'TATA MOTORS',
    symbol: 'BSE:TATAMOTORS',
    tvSymbol: 'BSE:TATAMOTORS',
    etfSymbol: 'NSE:TATAMOTORS',
    officialSymbol: 'NSE:TATAMOTORS',
    category: 'Stock',
    basePrice: 978.60,
    lotSize: 1425,
    strikeStep: 10,
    change: '-0.85%',
    isPositive: false,
    dayHigh: 992.00,
    dayLow: 971.00
  },
  {
    id: 'tcs',
    name: 'TCS',
    symbol: 'BSE:TCS',
    tvSymbol: 'BSE:TCS',
    etfSymbol: 'NSE:TCS',
    officialSymbol: 'NSE:TCS',
    category: 'Stock',
    basePrice: 4290.00,
    lotSize: 175,
    strikeStep: 50,
    change: '+0.40%',
    isPositive: true,
    dayHigh: 4320.00,
    dayLow: 4265.00
  },
  {
    id: 'infy',
    name: 'INFOSYS',
    symbol: 'BSE:INFY',
    tvSymbol: 'BSE:INFY',
    etfSymbol: 'NSE:INFY',
    officialSymbol: 'NSE:INFY',
    category: 'Stock',
    basePrice: 1912.30,
    lotSize: 400,
    strikeStep: 20,
    change: '-0.35%',
    isPositive: false,
    dayHigh: 1930.00,
    dayLow: 1898.00
  },
  {
    id: 'sbin',
    name: 'SBI (SBIN)',
    symbol: 'BSE:SBIN',
    tvSymbol: 'BSE:SBIN',
    etfSymbol: 'NSE:SBIN',
    officialSymbol: 'NSE:SBIN',
    category: 'Stock',
    basePrice: 792.40,
    lotSize: 1500,
    strikeStep: 5,
    change: '+1.05%',
    isPositive: true,
    dayHigh: 798.50,
    dayLow: 785.00
  },
  {
    id: 'bajfinance',
    name: 'BAJAJ FINANCE',
    symbol: 'BSE:BAJFINANCE',
    tvSymbol: 'BSE:BAJFINANCE',
    etfSymbol: 'NSE:BAJFINANCE',
    officialSymbol: 'NSE:BAJFINANCE',
    category: 'Stock',
    basePrice: 7540.00,
    lotSize: 125,
    strikeStep: 50,
    change: '+1.80%',
    isPositive: true,
    dayHigh: 7590.00,
    dayLow: 7420.00
  },
  {
    id: 'bhartiartl',
    name: 'BHARTI AIRTEL',
    symbol: 'BSE:BHARTIARTL',
    tvSymbol: 'BSE:BHARTIARTL',
    etfSymbol: 'NSE:BHARTIARTL',
    officialSymbol: 'NSE:BHARTIARTL',
    category: 'Stock',
    basePrice: 1650.00,
    lotSize: 475,
    strikeStep: 10,
    change: '+0.30%',
    isPositive: true,
    dayHigh: 1665.00,
    dayLow: 1640.00
  }
];

app.get('/api/fno-list', (req, res) => {
  res.json({
    status: 'success',
    timestamp: new Date().toISOString(),
    instruments: FNO_INSTRUMENTS
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`⚡ Indian FnO Sniper Terminal is running!`);
  console.log(`📡 Local URL: http://localhost:${PORT}`);
  console.log(`🔒 Secret Private Mode: Active`);
  console.log(`====================================================`);
});
