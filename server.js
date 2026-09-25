const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Master Indian FnO Instruments Database with Yahoo Finance & TradingView symbols
const FNO_INSTRUMENTS = [
  {
    id: 'nifty',
    name: 'NIFTY 50',
    symbol: 'NSE:NIFTY',
    tvSymbol: 'CAPITALCOM:NIFTY50',
    etfSymbol: 'NSE:NIFTYBEES',
    officialSymbol: 'NSE:NIFTY',
    yfSymbol: '^NSEI',
    category: 'Index',
    basePrice: 23040.30,
    lotSize: 75,
    strikeStep: 50,
    change: '-1.24%',
    isPositive: false,
    dayHigh: 23489.00,
    dayLow: 23021.10
  },
  {
    id: 'banknifty',
    name: 'BANK NIFTY',
    symbol: 'NSE:BANKNIFTY',
    tvSymbol: 'CAPITALCOM:BANKNIFTY',
    etfSymbol: 'NSE:BANKBEES',
    officialSymbol: 'NSE:BANKNIFTY',
    yfSymbol: '^NSEBANK',
    category: 'Index',
    basePrice: 55522.40,
    lotSize: 30,
    strikeStep: 100,
    change: '-1.49%',
    isPositive: false,
    dayHigh: 56671.00,
    dayLow: 55341.60
  },
  {
    id: 'sensex',
    name: 'BSE SENSEX',
    symbol: 'BSE:SENSEX',
    tvSymbol: 'BSE:SENSEX',
    etfSymbol: 'BSE:SENSEX',
    officialSymbol: 'BSE:SENSEX',
    yfSymbol: '^BSESN',
    category: 'Index',
    basePrice: 73609.66,
    lotSize: 20,
    strikeStep: 100,
    change: '-1.18%',
    isPositive: false,
    dayHigh: 75034.16,
    dayLow: 73447.36
  },
  {
    id: 'finnifty',
    name: 'FIN NIFTY',
    symbol: 'NSE:FINNIFTY',
    tvSymbol: 'CAPITALCOM:FINNIFTY',
    etfSymbol: 'NSE:NIFTYBEES',
    officialSymbol: 'NSE:FINNIFTY',
    yfSymbol: 'NIFTY_FIN_SERVICE.NS',
    category: 'Index',
    basePrice: 24984.10,
    lotSize: 65,
    strikeStep: 50,
    change: '-2.14%',
    isPositive: false,
    dayHigh: 25652.70,
    dayLow: 24901.15
  },
  {
    id: 'reliance',
    name: 'RELIANCE',
    symbol: 'BSE:RELIANCE',
    tvSymbol: 'BSE:RELIANCE',
    etfSymbol: 'NSE:RELIANCE',
    officialSymbol: 'NSE:RELIANCE',
    yfSymbol: 'RELIANCE.NS',
    category: 'Stock',
    basePrice: 1215.90,
    lotSize: 500,
    strikeStep: 20,
    change: '-1.55%',
    isPositive: false,
    dayHigh: 1252.80,
    dayLow: 1215.00
  },
  {
    id: 'hdfcbank',
    name: 'HDFC BANK',
    symbol: 'BSE:HDFCBANK',
    tvSymbol: 'BSE:HDFCBANK',
    etfSymbol: 'NSE:HDFCBANK',
    officialSymbol: 'NSE:HDFCBANK',
    yfSymbol: 'HDFCBANK.NS',
    category: 'Stock',
    basePrice: 734.70,
    lotSize: 550,
    strikeStep: 10,
    change: '+0.53%',
    isPositive: true,
    dayHigh: 749.30,
    dayLow: 725.95
  },
  {
    id: 'icicibank',
    name: 'ICICI BANK',
    symbol: 'BSE:ICICIBANK',
    tvSymbol: 'BSE:ICICIBANK',
    etfSymbol: 'NSE:ICICIBANK',
    officialSymbol: 'NSE:ICICIBANK',
    yfSymbol: 'ICICIBANK.NS',
    category: 'Stock',
    basePrice: 1327.30,
    lotSize: 700,
    strikeStep: 10,
    change: '-1.34%',
    isPositive: false,
    dayHigh: 1351.90,
    dayLow: 1326.20
  },
  {
    id: 'tcs',
    name: 'TCS',
    symbol: 'BSE:TCS',
    tvSymbol: 'BSE:TCS',
    etfSymbol: 'NSE:TCS',
    officialSymbol: 'NSE:TCS',
    yfSymbol: 'TCS.NS',
    category: 'Stock',
    basePrice: 2079.20,
    lotSize: 225,
    strikeStep: 50,
    change: '-0.52%',
    isPositive: false,
    dayHigh: 2144.50,
    dayLow: 2039.80
  },
  {
    id: 'infy',
    name: 'INFOSYS',
    symbol: 'BSE:INFY',
    tvSymbol: 'BSE:INFY',
    etfSymbol: 'NSE:INFY',
    officialSymbol: 'NSE:INFY',
    yfSymbol: 'INFY.NS',
    category: 'Stock',
    basePrice: 994.90,
    lotSize: 400,
    strikeStep: 20,
    change: '-4.30%',
    isPositive: false,
    dayHigh: 1044.50,
    dayLow: 991.70
  },
  {
    id: 'sbin',
    name: 'SBI (SBIN)',
    symbol: 'BSE:SBIN',
    tvSymbol: 'BSE:SBIN',
    etfSymbol: 'NSE:SBIN',
    officialSymbol: 'NSE:SBIN',
    yfSymbol: 'SBIN.NS',
    category: 'Stock',
    basePrice: 979.30,
    lotSize: 750,
    strikeStep: 5,
    change: '-1.23%',
    isPositive: false,
    dayHigh: 999.20,
    dayLow: 975.90
  },
  {
    id: 'bajfinance',
    name: 'BAJAJ FINANCE',
    symbol: 'BSE:BAJFINANCE',
    tvSymbol: 'BSE:BAJFINANCE',
    etfSymbol: 'NSE:BAJFINANCE',
    officialSymbol: 'NSE:BAJFINANCE',
    yfSymbol: 'BAJFINANCE.NS',
    category: 'Stock',
    basePrice: 985.70,
    lotSize: 750,
    strikeStep: 50,
    change: '-4.80%',
    isPositive: false,
    dayHigh: 1043.20,
    dayLow: 974.00
  },
  {
    id: 'bhartiartl',
    name: 'BHARTI AIRTEL',
    symbol: 'BSE:BHARTIARTL',
    tvSymbol: 'BSE:BHARTIARTL',
    etfSymbol: 'NSE:BHARTIARTL',
    officialSymbol: 'NSE:BHARTIARTL',
    yfSymbol: 'BHARTIARTL.NS',
    category: 'Stock',
    basePrice: 1788.40,
    lotSize: 475,
    strikeStep: 10,
    change: '-3.27%',
    isPositive: false,
    dayHigh: 1853.80,
    dayLow: 1787.50
  }
];

app.get('/api/fno-list', (req, res) => {
  res.json({
    status: 'success',
    timestamp: new Date().toISOString(),
    instruments: FNO_INSTRUMENTS
  });
});

// Endpoint to fetch real live candlestick data from live markets
app.get('/api/candles', async (req, res) => {
  const id = req.query.id || 'nifty';
  const interval = req.query.interval || '5m';
  const inst = FNO_INSTRUMENTS.find(x => x.id === id) || FNO_INSTRUMENTS[0];
  const yfSymbol = encodeURIComponent(inst.yfSymbol || '^NSEI');

  try {
    const range = interval === '1d' ? '3mo' : (interval === '15m' ? '5d' : '1d');
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${yfSymbol}?interval=${interval}&range=${range}`;
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });

    if (!response.ok) {
      throw new Error(`Upstream returned ${response.status}`);
    }

    const data = await response.json();
    const result = data.chart.result[0];
    const timestamps = result.timestamp || [];
    const quote = result.indicators.quote[0];
    const meta = result.meta;

    const candles = [];
    for (let i = 0; i < timestamps.length; i++) {
      if (quote.open[i] != null && quote.close[i] != null) {
        candles.push({
          time: timestamps[i] * 1000,
          open: parseFloat(quote.open[i].toFixed(2)),
          high: parseFloat(quote.high[i].toFixed(2)),
          low: parseFloat(quote.low[i].toFixed(2)),
          close: parseFloat(quote.close[i].toFixed(2)),
          volume: quote.volume[i] || 0
        });
      }
    }

    res.json({
      status: 'success',
      symbol: inst.name,
      regularMarketPrice: meta.regularMarketPrice,
      regularMarketDayHigh: meta.regularMarketDayHigh,
      regularMarketDayLow: meta.regularMarketDayLow,
      candles: candles
    });
  } catch (err) {
    console.error('Candle fetch error:', err.message);
    res.status(500).json({ status: 'error', message: err.message });
  }
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
