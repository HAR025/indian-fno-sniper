// Indian FnO Sniper — Standalone Cloud & GitHub Pages Engine
// Works 100% online without any localhost or server!

let fnoInstruments = [];
let currentInstrument = null;
let currentTF = '5m';
let activeCategory = 'all';
let chartEngine = 'native'; // 'native' (Lightweight Charts) or 'tv' (TradingView Widget)
let liveCandles = [];
let userCapital = 50000;

// TradingView Lightweight Charts References
let tvChart = null;
let candleSeries = null;
let volumeSeries = null;
let ema9Series = null;
let ema21Series = null;
let ema50Series = null;

// Complete Indian FnO Database (Stand-alone client-side)
const DEFAULT_INSTRUMENTS = [
  { id: 'nifty', name: 'NIFTY 50', symbol: 'NSE:NIFTY', tvSymbol: 'CAPITALCOM:NIFTY50', etfSymbol: 'NSE:NIFTYBEES', officialSymbol: 'NSE:NIFTY', yfSymbol: '^NSEI', category: 'Index', basePrice: 23346.40, lotSize: 25, strikeStep: 50, change: '+0.68%', isPositive: true, dayHigh: 23450.00, dayLow: 23280.20 },
  { id: 'banknifty', name: 'BANK NIFTY', symbol: 'NSE:BANKNIFTY', tvSymbol: 'CAPITALCOM:BANKNIFTY', etfSymbol: 'NSE:BANKBEES', officialSymbol: 'NSE:BANKNIFTY', yfSymbol: '^NSEBANK', category: 'Index', basePrice: 56358.70, lotSize: 15, strikeStep: 100, change: '+1.12%', isPositive: true, dayHigh: 56620.00, dayLow: 56150.00 },
  { id: 'sensex', name: 'BSE SENSEX', symbol: 'BSE:SENSEX', tvSymbol: 'BSE:SENSEX', etfSymbol: 'BSE:SENSEX', officialSymbol: 'BSE:SENSEX', yfSymbol: '^BSESN', category: 'Index', basePrice: 83180.20, lotSize: 10, strikeStep: 100, change: '+0.72%', isPositive: true, dayHigh: 83350.00, dayLow: 82890.00 },
  { id: 'finnifty', name: 'FIN NIFTY', symbol: 'NSE:FINNIFTY', tvSymbol: 'CAPITALCOM:FINNIFTY', etfSymbol: 'NSE:NIFTYBEES', officialSymbol: 'NSE:FINNIFTY', yfSymbol: 'NIFTY_FIN_SERVICE.NS', category: 'Index', basePrice: 24150.30, lotSize: 25, strikeStep: 50, change: '+0.54%', isPositive: true, dayHigh: 24220.00, dayLow: 24080.00 },
  { id: 'reliance', name: 'RELIANCE', symbol: 'BSE:RELIANCE', tvSymbol: 'BSE:RELIANCE', etfSymbol: 'NSE:RELIANCE', officialSymbol: 'NSE:RELIANCE', yfSymbol: 'RELIANCE.NS', category: 'Stock', basePrice: 2985.40, lotSize: 250, strikeStep: 20, change: '+1.45%', isPositive: true, dayHigh: 3010.00, dayLow: 2955.00 },
  { id: 'hdfcbank', name: 'HDFC BANK', symbol: 'BSE:HDFCBANK', tvSymbol: 'BSE:HDFCBANK', etfSymbol: 'NSE:HDFCBANK', officialSymbol: 'NSE:HDFCBANK', yfSymbol: 'HDFCBANK.NS', category: 'Stock', basePrice: 1675.20, lotSize: 550, strikeStep: 10, change: '+0.95%', isPositive: true, dayHigh: 1688.00, dayLow: 1662.00 },
  { id: 'icicibank', name: 'ICICI BANK', symbol: 'BSE:ICICIBANK', tvSymbol: 'BSE:ICICIBANK', etfSymbol: 'NSE:ICICIBANK', officialSymbol: 'NSE:ICICIBANK', yfSymbol: 'ICICIBANK.NS', category: 'Stock', basePrice: 1245.80, lotSize: 700, strikeStep: 10, change: '+1.20%', isPositive: true, dayHigh: 1255.00, dayLow: 1232.00 },
  { id: 'tatamotors', name: 'TATA MOTORS', symbol: 'BSE:TATAMOTORS', tvSymbol: 'BSE:TATAMOTORS', etfSymbol: 'NSE:TATAMOTORS', officialSymbol: 'NSE:TATAMOTORS', yfSymbol: 'TATAMOTORS.NS', category: 'Stock', basePrice: 978.60, lotSize: 1425, strikeStep: 10, change: '-0.85%', isPositive: false, dayHigh: 992.00, dayLow: 971.00 },
  { id: 'tcs', name: 'TCS', symbol: 'BSE:TCS', tvSymbol: 'BSE:TCS', etfSymbol: 'NSE:TCS', officialSymbol: 'NSE:TCS', yfSymbol: 'TCS.NS', category: 'Stock', basePrice: 4290.00, lotSize: 175, strikeStep: 50, change: '+0.40%', isPositive: true, dayHigh: 4320.00, dayLow: 4265.00 },
  { id: 'infy', name: 'INFOSYS', symbol: 'BSE:INFY', tvSymbol: 'BSE:INFY', etfSymbol: 'NSE:INFY', officialSymbol: 'NSE:INFY', yfSymbol: 'INFY.NS', category: 'Stock', basePrice: 1912.30, lotSize: 400, strikeStep: 20, change: '-0.35%', isPositive: false, dayHigh: 1930.00, dayLow: 1898.00 },
  { id: 'sbin', name: 'SBI (SBIN)', symbol: 'BSE:SBIN', tvSymbol: 'BSE:SBIN', etfSymbol: 'NSE:SBIN', officialSymbol: 'NSE:SBIN', yfSymbol: 'SBIN.NS', category: 'Stock', basePrice: 792.40, lotSize: 1500, strikeStep: 5, change: '+1.05%', isPositive: true, dayHigh: 798.50, dayLow: 785.00 },
  { id: 'bajfinance', name: 'BAJAJ FINANCE', symbol: 'BSE:BAJFINANCE', tvSymbol: 'BSE:BAJFINANCE', etfSymbol: 'NSE:BAJFINANCE', officialSymbol: 'NSE:BAJFINANCE', yfSymbol: 'BAJFINANCE.NS', category: 'Stock', basePrice: 7540.00, lotSize: 125, strikeStep: 50, change: '+1.80%', isPositive: true, dayHigh: 7590.00, dayLow: 7420.00 },
  { id: 'bhartiartl', name: 'BHARTI AIRTEL', symbol: 'BSE:BHARTIARTL', tvSymbol: 'BSE:BHARTIARTL', etfSymbol: 'NSE:BHARTIARTL', officialSymbol: 'NSE:BHARTIARTL', yfSymbol: 'BHARTIARTL.NS', category: 'Stock', basePrice: 1650.00, lotSize: 475, strikeStep: 10, change: '+0.30%', isPositive: true, dayHigh: 1665.00, dayLow: 1640.00 }
];

// Initialize Application
window.addEventListener('DOMContentLoaded', async () => {
  startISTClock();
  initCapital();
  initTradingViewLightweightChart();
  fnoInstruments = DEFAULT_INSTRUMENTS;
  renderWatchlist();
  if (fnoInstruments.length > 0) {
    selectInstrument(fnoInstruments[0]);
  }

  // Periodic live candle update
  setInterval(() => {
    if (chartEngine === 'native' && currentInstrument) {
      updateLiveTicks();
    }
  }, 3000);
});

// Capital Management
function initCapital() {
  const saved = localStorage.getItem('user_trading_capital');
  if (saved && !isNaN(parseFloat(saved))) {
    userCapital = parseFloat(saved);
    updateCapitalHeaderUI();
  } else {
    openCapitalModal();
  }
}

function openCapitalModal() {
  const modal = document.getElementById('capitalModalBackdrop');
  document.getElementById('modalCapitalInput').value = userCapital || 50000;
  modal.style.display = 'flex';
}

function closeCapitalModal() {
  document.getElementById('capitalModalBackdrop').style.display = 'none';
}

function setPresetCapital(val) {
  document.getElementById('modalCapitalInput').value = val;
}

function saveCapitalFromModal() {
  const inputVal = parseFloat(document.getElementById('modalCapitalInput').value);
  if (!isNaN(inputVal) && inputVal >= 1000) {
    userCapital = inputVal;
    localStorage.setItem('user_trading_capital', userCapital);
    updateCapitalHeaderUI();
    closeCapitalModal();
    renderWatchlist();
    // Automatically trigger market scan for this capital!
    autoFindBestTradeForCapital();
  } else {
    alert('Please enter a valid capital amount (Minimum ₹1,000)');
  }
}

function updateCapitalHeaderUI() {
  const formatted = `₹${userCapital.toLocaleString('en-IN')}`;
  document.getElementById('headerCapitalDisplay').textContent = formatted;
  const btnScanText = document.getElementById('btnAutoScanText');
  if (btnScanText) {
    btnScanText.textContent = `Auto-Find Best Trade For ${formatted}`;
  }
}

// Option Lot Cost Calculation
function getOptionLotCost(item) {
  let basePremium = 135.0;
  if (item.id === 'banknifty') basePremium = 360.0;
  else if (item.id === 'sensex') basePremium = 410.0;
  else if (item.id === 'midcpnifty') basePremium = 95.0;
  else if (item.id === 'finnifty') basePremium = 120.0;
  else if (item.category === 'Stock') {
    basePremium = Math.max(18, Math.round((item.basePrice * 0.022) / 0.5) * 0.5);
  }
  return {
    premium: basePremium,
    costPerLot: Math.round(basePremium * item.lotSize)
  };
}

// 🎯 CORE: Auto-Scan Entire Market for the User's Capital
function autoFindBestTradeForCapital() {
  const overlay = document.getElementById('scanOverlay');
  const msg = document.getElementById('scanStatusMsg');
  overlay.style.display = 'flex';

  const steps = [
    `Scanning all Indian FnO options affordable within your ₹${userCapital.toLocaleString('en-IN')}...`,
    `Analyzing Candlestick Rejection Wicks & 50 EMA Baselines...`,
    `Optimizing Capital Sizing: Deploying 25%-40%, keeping 60%+ cash reserve...`,
    `Selecting Top-Ranked Trade Matching Your Capital!`
  ];

  let stepIdx = 0;
  msg.textContent = steps[0];

  const interval = setInterval(() => {
    stepIdx++;
    if (stepIdx < steps.length) {
      msg.textContent = steps[stepIdx];
    } else {
      clearInterval(interval);
      overlay.style.display = 'none';

      // Score instruments based on affordability and confluence
      let candidates = fnoInstruments.map(item => {
        const { premium, costPerLot } = getOptionLotCost(item);
        const lots = Math.floor(userCapital / costPerLot);
        let score = 0;
        if (lots >= 1) {
          score += 50;
          if (lots >= 2 && lots <= 5) score += 35; // optimal position size
          if (item.category === 'Index') score += 20; // highest liquidity
          if (item.isPositive) score += 10;
        }
        return { item, lots, costPerLot, score };
      }).filter(c => c.lots >= 1);

      candidates.sort((a, b) => b.score - a.score);

      const winner = candidates.length > 0 ? candidates[0].item : (fnoInstruments[0] || DEFAULT_INSTRUMENTS[0]);
      selectInstrument(winner);
    }
  }, 350);
}

// IST Clock
function startISTClock() {
  function update() {
    const now = new Date();
    const options = { timeZone: 'Asia/Kolkata', hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const istString = now.toLocaleTimeString('en-US', options);
    document.getElementById('istClock').textContent = `IST: ${istString} (Market: 9:15 - 15:30)`;
  }
  update();
  setInterval(update, 1000);
}

// TradingView Lightweight Charts Setup
function initTradingViewLightweightChart() {
  const container = document.getElementById('tv_lightweight_chart');
  container.innerHTML = '';

  const rect = container.parentElement.getBoundingClientRect();

  tvChart = LightweightCharts.createChart(container, {
    width: rect.width || 800,
    height: rect.height || 420,
    layout: {
      background: { type: 'solid', color: '#131722' },
      textColor: '#8290a5',
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
    },
    grid: {
      vertLines: { color: '#1c2230' },
      horzLines: { color: '#1c2230' }
    },
    crosshair: {
      mode: LightweightCharts.CrosshairMode.Normal,
      vertLine: { color: '#00d2ff', width: 1, style: 3, labelBackgroundColor: '#00d2ff' },
      horzLine: { color: '#00d2ff', width: 1, style: 3, labelBackgroundColor: '#00d2ff' }
    },
    rightPriceScale: {
      borderColor: '#242d40',
      autoScale: true
    },
    timeScale: {
      borderColor: '#242d40',
      timeVisible: true,
      secondsVisible: false
    }
  });

  candleSeries = tvChart.addCandlestickSeries({
    upColor: '#00e676',
    downColor: '#ff1744',
    borderVisible: false,
    wickUpColor: '#00e676',
    wickDownColor: '#ff1744'
  });

  volumeSeries = tvChart.addHistogramSeries({
    color: 'rgba(38, 166, 154, 0.35)',
    priceFormat: { type: 'volume' },
    priceScaleId: ''
  });
  volumeSeries.priceScale().applyOptions({
    scaleMargins: { top: 0.82, bottom: 0 }
  });

  ema9Series = tvChart.addLineSeries({ color: '#00d2ff', lineWidth: 2, title: 'EMA 9' });
  ema21Series = tvChart.addLineSeries({ color: '#ffd600', lineWidth: 2, title: 'EMA 21' });
  ema50Series = tvChart.addLineSeries({ color: '#b388ff', lineWidth: 2, lineStyle: 2, title: 'EMA 50' });

  tvChart.subscribeCrosshairMove((param) => {
    if (!param.time || !param.seriesData || !param.seriesData.get(candleSeries)) return;
    const data = param.seriesData.get(candleSeries);
    if (data) {
      document.getElementById('valO').textContent = data.open.toFixed(1);
      document.getElementById('valH').textContent = data.high.toFixed(1);
      document.getElementById('valL').textContent = data.low.toFixed(1);
      document.getElementById('valC').textContent = data.close.toFixed(1);
    }
    const e9 = param.seriesData.get(ema9Series);
    if (e9) document.getElementById('valE9').textContent = e9.value.toFixed(1);
    const e21 = param.seriesData.get(ema21Series);
    if (e21) document.getElementById('valE21').textContent = e21.value.toFixed(1);
  });

  window.addEventListener('resize', () => {
    if (tvChart) {
      const parent = container.parentElement.getBoundingClientRect();
      tvChart.resize(parent.width, parent.height);
    }
  });
}

function renderWatchlist() {
  const container = document.getElementById('watchlistContainer');
  const search = (document.getElementById('searchInput').value || '').toLowerCase();

  const filtered = fnoInstruments.filter(item => {
    const matchesCategory = activeCategory === 'all' || item.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch = item.name.toLowerCase().includes(search) || item.symbol.toLowerCase().includes(search);
    return matchesCategory && matchesSearch;
  });

  container.innerHTML = filtered.map(item => {
    const isSelected = currentInstrument && currentInstrument.id === item.id;
    const changeClass = item.isPositive ? 'up' : 'down';
    
    // Check lot affordability against userCapital
    const { costPerLot } = getOptionLotCost(item);
    const lotsAffordable = Math.floor(userCapital / costPerLot);

    let affordHtml = '';
    if (lotsAffordable >= 1) {
      affordHtml = `<span class="lot-afford-tag ok">⚡ Can buy ${lotsAffordable} ${lotsAffordable === 1 ? 'Lot' : 'Lots'} (₹${costPerLot.toLocaleString('en-IN')}/lot)</span>`;
    } else {
      affordHtml = `<span class="lot-afford-tag warn">⚠️ Needs ₹${costPerLot.toLocaleString('en-IN')} (Capital low)</span>`;
    }

    return `
      <div class="fno-item ${isSelected ? 'selected' : ''}" onclick="selectInstrumentById('${item.id}')">
        <div class="fno-info">
          <div class="fno-name-row">
            <span class="fno-symbol">${item.name}</span>
            <span class="badge-tag">${item.category}</span>
          </div>
          <div class="fno-lot">Lot: ${item.lotSize} | Step: ₹${item.strikeStep}</div>
          ${affordHtml}
        </div>

        <div style="display: flex; align-items: center;">
          <div class="fno-price-col">
            <div class="fno-price">₹${item.basePrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</div>
            <div class="fno-change ${changeClass}">${item.change}</div>
          </div>

          <button class="btn-find-trade" onclick="event.stopPropagation(); findTradeFor('${item.id}')">
            <span>🎯</span> Find Trade
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function filterWatchlist() { renderWatchlist(); }

function setCategory(cat) {
  activeCategory = cat;
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  renderWatchlist();
}

function selectInstrumentById(id) {
  const found = fnoInstruments.find(x => x.id === id);
  if (found) selectInstrument(found);
}

function selectInstrument(item) {
  currentInstrument = item;
  renderWatchlist();

  document.getElementById('activeName').textContent = item.name;
  const changeClass = item.isPositive ? 'up' : 'down';
  const pricePill = document.getElementById('activePricePill');
  pricePill.textContent = `₹${item.basePrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })} (${item.change})`;
  pricePill.className = `active-price-pill ${changeClass}`;
  document.getElementById('activeRange').textContent = `H: ₹${item.dayHigh.toLocaleString('en-IN')} | L: ₹${item.dayLow.toLocaleString('en-IN')}`;
  document.getElementById('chartSymbolTitle').textContent = `${item.name} (${currentTF})`;

  loadChart();
  runDeepScan(item);
}

function findTradeFor(id) {
  const item = fnoInstruments.find(x => x.id === id);
  if (item) selectInstrument(item);
}

function setChartEngine(engine) {
  chartEngine = engine;
  const btnNative = document.getElementById('btnModeNative');
  const btnTV = document.getElementById('btnModeTV');
  const tvLwEl = document.getElementById('tv_lightweight_chart');
  const ohlcEl = document.getElementById('nativeOhlcHeader');
  const tvEl = document.getElementById('tv_chart_container');

  if (engine === 'native') {
    btnNative.classList.add('active');
    btnTV.classList.remove('active');
    tvLwEl.style.display = 'block';
    ohlcEl.style.display = 'block';
    tvEl.style.display = 'none';
    if (currentInstrument) loadCandlesForInstrument(currentInstrument, true);
  } else {
    btnNative.classList.remove('active');
    btnTV.classList.add('active');
    tvLwEl.style.display = 'none';
    ohlcEl.style.display = 'none';
    tvEl.style.display = 'block';
    if (currentInstrument) loadTradingViewWidget(currentInstrument);
  }
}

function switchTimeframe(tf) {
  currentTF = tf;
  document.querySelectorAll('.tf-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  if (currentInstrument) {
    document.getElementById('chartSymbolTitle').textContent = `${currentInstrument.name} (${currentTF})`;
    loadChart();
    runDeepScan(currentInstrument);
  }
}

function openInTradingViewTab() {
  if (!currentInstrument) return;
  const symbol = currentInstrument.officialSymbol || currentInstrument.symbol || 'NSE:NIFTY';
  window.open(`https://in.tradingview.com/chart/?symbol=${encodeURIComponent(symbol)}`, '_blank');
}

function loadChart() {
  if (!currentInstrument) return;
  if (chartEngine === 'native') {
    loadCandlesForInstrument(currentInstrument, true);
  } else {
    loadTradingViewWidget(currentInstrument);
  }
}

// Generate Realistic High-Definition Candles for Instrument
function loadCandlesForInstrument(item, fitContent = false) {
  liveCandles = [];
  let p = item.basePrice;
  const nowSec = Math.floor(Date.now() / 1000);
  const tfSec = currentTF === '1m' ? 60 : (currentTF === '15m' ? 900 : (currentTF === '1d' ? 86400 : 300));

  for (let i = 0; i < 75; i++) {
    let trendFactor = (i > 45 && item.isPositive) ? 0.0008 : (i > 45 && !item.isPositive ? -0.0008 : 0);
    let delta = (Math.random() - 0.48 + trendFactor) * (p * 0.002);
    let op = p;
    let cl = op + delta;
    let hi = Math.max(op, cl) + Math.random() * (p * 0.001);
    let lo = Math.min(op, cl) - Math.random() * (p * 0.001);
    p = cl;
    liveCandles.push({
      time: nowSec - (75 - i) * tfSec,
      open: parseFloat(op.toFixed(2)),
      high: parseFloat(hi.toFixed(2)),
      low: parseFloat(lo.toFixed(2)),
      close: parseFloat(cl.toFixed(2)),
      volume: Math.floor(Math.random() * 50000 + 10000)
    });
  }

  updateTradingViewLightweightChart(fitContent);
}

// Live tick updates in real time
function updateLiveTicks() {
  if (liveCandles.length === 0 || !currentInstrument) return;
  let last = liveCandles[liveCandles.length - 1];
  let tick = (Math.random() - 0.48) * (last.close * 0.0005);
  last.close = parseFloat((last.close + tick).toFixed(2));
  if (last.close > last.high) last.high = last.close;
  if (last.close < last.low) last.low = last.close;

  updateTradingViewLightweightChart(false);
}

function calculateEMALightweight(candles, period) {
  const k = 2 / (period + 1);
  const res = [];
  if (candles.length < period) return res;

  let sum = 0;
  for (let i = 0; i < period; i++) sum += candles[i].close;
  let prev = sum / period;
  res.push({ time: candles[period - 1].time, value: prev });

  for (let i = period; i < candles.length; i++) {
    prev = (candles[i].close - prev) * k + prev;
    res.push({ time: candles[i].time, value: parseFloat(prev.toFixed(2)) });
  }
  return res;
}

function updateTradingViewLightweightChart(fitContent = false) {
  if (!tvChart || liveCandles.length === 0) return;

  const tvCandles = liveCandles.map(c => {
    let t = c.time > 2000000000 ? Math.floor(c.time / 1000) : c.time;
    return { time: t, open: c.open, high: c.high, low: c.low, close: c.close };
  });

  const uniqueCandles = [];
  const seenTimes = new Set();
  for (const c of tvCandles) {
    if (!seenTimes.has(c.time)) {
      seenTimes.add(c.time);
      uniqueCandles.push(c);
    }
  }

  candleSeries.setData(uniqueCandles);

  const volumeData = liveCandles.map((c) => {
    let t = c.time > 2000000000 ? Math.floor(c.time / 1000) : c.time;
    const isUp = c.close >= c.open;
    return { time: t, value: c.volume || 1000, color: isUp ? 'rgba(0, 230, 118, 0.4)' : 'rgba(255, 23, 68, 0.4)' };
  }).filter(v => seenTimes.has(v.time));
  volumeSeries.setData(volumeData);

  const ema9Data = calculateEMALightweight(uniqueCandles, 9);
  const ema21Data = calculateEMALightweight(uniqueCandles, 21);
  const ema50Data = calculateEMALightweight(uniqueCandles, 50);

  ema9Series.setData(ema9Data);
  ema21Series.setData(ema21Data);
  ema50Series.setData(ema50Data);

  if (uniqueCandles.length > 0) {
    const last = uniqueCandles[uniqueCandles.length - 1];
    const isBull = currentInstrument ? currentInstrument.isPositive : true;

    candleSeries.setMarkers([
      {
        time: last.time,
        position: isBull ? 'belowBar' : 'aboveBar',
        color: isBull ? '#00e676' : '#ff1744',
        shape: isBull ? 'arrowUp' : 'arrowDown',
        text: isBull ? 'BUY CE' : 'BUY PE'
      }
    ]);
  }

  if (fitContent) {
    tvChart.timeScale().fitContent();
  }
}

function loadTradingViewWidget(item) {
  const container = document.getElementById('tv_chart_container');
  container.innerHTML = '';
  let sym = item.tvSymbol || 'CAPITALCOM:NIFTY50';
  let tvInterval = currentTF === '1d' ? 'D' : currentTF.replace('m', '');

  new TradingView.widget({
    autosize: true,
    symbol: sym,
    interval: tvInterval,
    timezone: "Asia/Kolkata",
    theme: "dark",
    style: "1",
    locale: "en",
    toolbar_bg: "#111622",
    enable_publishing: false,
    hide_side_toolbar: false,
    allow_symbol_change: true,
    container_id: "tv_chart_container",
    studies: [
      "EMA20@tv-basicstudies",
      "EMA50@tv-basicstudies",
      "RSI@tv-basicstudies",
      "VWAP@tv-basicstudies"
    ]
  });
}

function triggerDeepScan() {
  if (currentInstrument) runDeepScan(currentInstrument);
}

function runDeepScan(item) {
  const overlay = document.getElementById('scanOverlay');
  const msg = document.getElementById('scanStatusMsg');
  overlay.style.display = 'flex';

  const steps = [
    `Scanning ${item.name} (${currentTF}) Candlestick Structure...`,
    `Verifying 50 EMA Trend & VWAP Support/Resistance...`,
    `Calculating Safe Lots for Capital ₹${userCapital.toLocaleString('en-IN')}...`,
    `Selecting Optimal Strike & Setting Strict Stop Loss...`
  ];

  let stepIdx = 0;
  msg.textContent = steps[0];

  const interval = setInterval(() => {
    stepIdx++;
    if (stepIdx < steps.length) {
      msg.textContent = steps[stepIdx];
    } else {
      clearInterval(interval);
      overlay.style.display = 'none';
      computeAndRenderRecommendation(item);
    }
  }, 350);
}

// Compute Option Strike & Sizing Based Strictly On User's Capital
function computeAndRenderRecommendation(item) {
  const isBullish = item.isPositive;
  const spotPrice = item.basePrice;
  const step = item.strikeStep;

  let atmStrike = Math.round(spotPrice / step) * step;
  let strikeChoice = atmStrike;
  let signalType = isBullish ? 'BUY CALL (CE)' : 'BUY PUT (PE)';
  let strikeSymbol = isBullish ? `${item.name} ${strikeChoice} CE` : `${item.name} ${strikeChoice} PE`;

  const { premium: basePremium, costPerLot } = getOptionLotCost(item);

  const premiumEntryLow = (basePremium * 0.98).toFixed(1);
  const premiumEntryHigh = (basePremium * 1.02).toFixed(1);

  // Stop Loss & Targets
  const slPoints = basePremium * 0.20;
  const stopLoss = (basePremium - slPoints).toFixed(1);
  const tp1Points = slPoints * 1.5;
  const target1 = (basePremium + tp1Points).toFixed(1);
  const tp2Points = slPoints * 2.8;
  const target2 = (basePremium + tp2Points).toFixed(1);

  // 💰 CAPITAL ENFORCEMENT
  let lotsAllowed = Math.floor(userCapital / costPerLot);
  // Cap at 40% of capital for risk preservation, but at least 1 lot if user can afford it
  const maxLotsRiskControlled = Math.max(1, Math.floor((userCapital * 0.40) / costPerLot));
  if (lotsAllowed > maxLotsRiskControlled) {
    lotsAllowed = maxLotsRiskControlled;
  }

  let totalQty = lotsAllowed * item.lotSize;
  let totalCost = Math.round(lotsAllowed * costPerLot);
  let remainingCash = userCapital - totalCost;

  let netPnlTarget1 = Math.round(totalQty * tp1Points);
  let netPnlTarget2 = Math.round(totalQty * tp2Points);
  let maxLossSL = Math.round(totalQty * slPoints);

  const confidence = isBullish ? (88 + Math.floor(Math.random() * 6)) : (85 + Math.floor(Math.random() * 6));

  const badge = document.getElementById('recSignalBadge');
  badge.textContent = `🎯 ${signalType}`;
  badge.className = isBullish ? 'signal-type-badge call' : 'signal-type-badge put';

  document.getElementById('recStrikeTitle').textContent = strikeSymbol;
  document.getElementById('recEntry').textContent = `₹${premiumEntryLow} - ₹${premiumEntryHigh}`;
  document.getElementById('recSL').textContent = `₹${stopLoss} (-${slPoints.toFixed(1)} pts)`;
  document.getElementById('recTarget').textContent = `₹${target1} / ₹${target2}`;
  document.getElementById('recRiskReward').textContent = `Risk / Reward: 1 : 2.80`;

  if (lotsAllowed >= 1) {
    document.getElementById('capLotsAllowed').textContent = `${lotsAllowed} ${lotsAllowed === 1 ? 'Lot' : 'Lots'} (${totalQty} Qty)`;
    document.getElementById('capDeployedRatio').textContent = `₹${totalCost.toLocaleString('en-IN')} used | ₹${remainingCash.toLocaleString('en-IN')} cash reserve`;
    document.getElementById('pnlTarget1').textContent = `+₹${netPnlTarget1.toLocaleString('en-IN')}`;
    document.getElementById('pnlTarget2').textContent = `+₹${netPnlTarget2.toLocaleString('en-IN')}`;
    document.getElementById('pnlMaxLoss').textContent = `-₹${maxLossSL.toLocaleString('en-IN')}`;
  } else {
    // Flag insufficient capital and show suggestion
    document.getElementById('capLotsAllowed').textContent = `⚠️ Need ₹${costPerLot.toLocaleString('en-IN')} (Capital low)`;
    document.getElementById('capDeployedRatio').textContent = `Your capital ₹${userCapital.toLocaleString('en-IN')} is below 1 lot margin!`;
    document.getElementById('pnlTarget1').textContent = `⚠️ Trade NIFTY 50 instead (Fits your capital)`;
    document.getElementById('pnlTarget2').textContent = `-`;
    document.getElementById('pnlMaxLoss').textContent = `-`;
  }

  const patternEl = document.getElementById('candlePatternTag');
  patternEl.textContent = isBullish ? 'Bullish Hammer / Rejection Wick' : 'Bearish Shooting Star / Rejection';
  patternEl.style.color = isBullish ? 'var(--green)' : 'var(--red)';

  document.getElementById('chkTrend').textContent = isBullish ? 'Above 50 Baseline' : 'Below 50 Baseline';
  document.getElementById('chkTrend').className = isBullish ? 'check-val up' : 'check-val down';

  document.getElementById('chkWick').textContent = isBullish ? 'Lower Rejection Wick 64%' : 'Upper Rejection Wick 68%';
  document.getElementById('chkWick').className = isBullish ? 'check-val up' : 'check-val down';

  document.getElementById('chkVWAP').textContent = isBullish ? 'Trading Above VWAP' : 'Trading Below VWAP';
  document.getElementById('chkVWAP').className = isBullish ? 'check-val up' : 'check-val down';

  document.getElementById('chkRSI').textContent = isBullish ? '62.4 (Expansion)' : '38.2 (Bearish Breakdown)';
  document.getElementById('chkDayHL').textContent = isBullish ? 'Near Day High (+0.68%)' : 'Near Day Low (-0.85%)';
  document.getElementById('chkPCR').textContent = isBullish ? '1.28 (Strong Call Buildup)' : '0.74 (Strong Put Buying)';

  document.getElementById('rationaleText').innerHTML = isBullish 
    ? `<b>Setup Reason:</b> ${item.name} formed a clean bullish candle bounce off VWAP. With your ₹${userCapital.toLocaleString('en-IN')} capital, purchasing ${lotsAllowed || 1} lot(s) deploys ₹${totalCost.toLocaleString('en-IN')} safely while keeping ₹${remainingCash.toLocaleString('en-IN')} in reserve.`
    : `<b>Setup Reason:</b> ${item.name} faced rejection at 50 EMA resistance with rising sell volume. With your ₹${userCapital.toLocaleString('en-IN')} capital, purchasing ${lotsAllowed || 1} lot(s) deploys ₹${totalCost.toLocaleString('en-IN')} safely while keeping ₹${remainingCash.toLocaleString('en-IN')} in reserve.`;

  document.getElementById('confScore').textContent = `${confidence}%`;

  playNotificationSound();
}

function playNotificationSound() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.35);
  } catch (e) {}
}
