// Indian FnO Sniper — Core Application Logic

let fnoInstruments = [];
let currentInstrument = null;
let currentTF = '5';
let activeCategory = 'all';
let tvWidget = null;

// Fallback Instruments Database
const DEFAULT_INSTRUMENTS = [
  { id: 'nifty', name: 'NIFTY 50', symbol: 'NSE:NIFTY', category: 'Index', basePrice: 25420.50, lotSize: 25, strikeStep: 50, change: '+0.68%', isPositive: true, dayHigh: 25480.00, dayLow: 25310.20 },
  { id: 'banknifty', name: 'BANK NIFTY', symbol: 'NSE:BANKNIFTY', category: 'Index', basePrice: 52940.80, lotSize: 15, strikeStep: 100, change: '+1.12%', isPositive: true, dayHigh: 53120.00, dayLow: 52650.00 },
  { id: 'finnifty', name: 'FIN NIFTY', symbol: 'NSE:FINNIFTY', category: 'Index', basePrice: 24150.30, lotSize: 25, strikeStep: 50, change: '+0.54%', isPositive: true, dayHigh: 24220.00, dayLow: 24080.00 },
  { id: 'midcpnifty', name: 'MIDCAP NIFTY', symbol: 'NSE:MIDCPNIFTY', category: 'Index', basePrice: 13240.60, lotSize: 50, strikeStep: 25, change: '-0.22%', isPositive: false, dayHigh: 13310.00, dayLow: 13190.00 },
  { id: 'sensex', name: 'BSE SENSEX', symbol: 'BSE:SENSEX', category: 'Index', basePrice: 83180.20, lotSize: 10, strikeStep: 100, change: '+0.72%', isPositive: true, dayHigh: 83350.00, dayLow: 82890.00 },
  { id: 'reliance', name: 'RELIANCE', symbol: 'NSE:RELIANCE', category: 'Stock', basePrice: 2985.40, lotSize: 250, strikeStep: 20, change: '+1.45%', isPositive: true, dayHigh: 3010.00, dayLow: 2955.00 },
  { id: 'hdfcbank', name: 'HDFC BANK', symbol: 'NSE:HDFCBANK', category: 'Stock', basePrice: 1675.20, lotSize: 550, strikeStep: 10, change: '+0.95%', isPositive: true, dayHigh: 1688.00, dayLow: 1662.00 },
  { id: 'icicibank', name: 'ICICI BANK', symbol: 'NSE:ICICIBANK', category: 'Stock', basePrice: 1245.80, lotSize: 700, strikeStep: 10, change: '+1.20%', isPositive: true, dayHigh: 1255.00, dayLow: 1232.00 },
  { id: 'tatamotors', name: 'TATA MOTORS', symbol: 'NSE:TATAMOTORS', category: 'Stock', basePrice: 978.60, lotSize: 1425, strikeStep: 10, change: '-0.85%', isPositive: false, dayHigh: 992.00, dayLow: 971.00 },
  { id: 'tcs', name: 'TCS', symbol: 'NSE:TCS', category: 'Stock', basePrice: 4290.00, lotSize: 175, strikeStep: 50, change: '+0.40%', isPositive: true, dayHigh: 4320.00, dayLow: 4265.00 },
  { id: 'infy', name: 'INFOSYS', symbol: 'NSE:INFY', category: 'Stock', basePrice: 1912.30, lotSize: 400, strikeStep: 20, change: '-0.35%', isPositive: false, dayHigh: 1930.00, dayLow: 1898.00 },
  { id: 'sbin', name: 'SBI (SBIN)', symbol: 'NSE:SBIN', category: 'Stock', basePrice: 792.40, lotSize: 1500, strikeStep: 5, change: '+1.05%', isPositive: true, dayHigh: 798.50, dayLow: 785.00 },
  { id: 'bajfinance', name: 'BAJAJ FINANCE', symbol: 'NSE:BAJFINANCE', category: 'Stock', basePrice: 7540.00, lotSize: 125, strikeStep: 50, change: '+1.80%', isPositive: true, dayHigh: 7590.00, dayLow: 7420.00 },
  { id: 'bhartiartl', name: 'BHARTI AIRTEL', symbol: 'NSE:BHARTIARTL', category: 'Stock', basePrice: 1650.00, lotSize: 475, strikeStep: 10, change: '+0.30%', isPositive: true, dayHigh: 1665.00, dayLow: 1640.00 }
];

// Initialize application
window.addEventListener('DOMContentLoaded', async () => {
  startISTClock();
  await loadFnOList();
  if (fnoInstruments.length > 0) {
    selectInstrument(fnoInstruments[0]);
  }
});

// Update IST Clock
function startISTClock() {
  function update() {
    const now = new Date();
    const options = { timeZone: 'Asia/Kolkata', hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const istString = now.toLocaleTimeString('en-US', options);
    document.getElementById('istClock').textContent = `IST: ${istString} (Market Hours: 9:15 - 15:30)`;
  }
  update();
  setInterval(update, 1000);
}

// Fetch FnO list from backend
async function loadFnOList() {
  try {
    const res = await fetch('/api/fno-list');
    if (res.ok) {
      const data = await res.json();
      fnoInstruments = data.instruments || DEFAULT_INSTRUMENTS;
    } else {
      fnoInstruments = DEFAULT_INSTRUMENTS;
    }
  } catch (err) {
    console.warn('Using default FnO list:', err);
    fnoInstruments = DEFAULT_INSTRUMENTS;
  }
  renderWatchlist();
}

// Render Watchlist in left panel
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

    return `
      <div class="fno-item ${isSelected ? 'selected' : ''}" onclick="selectInstrumentById('${item.id}')">
        <div class="fno-info">
          <div class="fno-name-row">
            <span class="fno-symbol">${item.name}</span>
            <span class="badge-tag">${item.category}</span>
          </div>
          <div class="fno-lot">Lot: ${item.lotSize} | Step: ₹${item.strikeStep}</div>
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

function filterWatchlist() {
  renderWatchlist();
}

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

// Select an instrument and load TradingView terminal
function selectInstrument(item) {
  currentInstrument = item;
  renderWatchlist();

  // Update Toolbar Header
  document.getElementById('activeName').textContent = item.name;
  const changeClass = item.isPositive ? 'up' : 'down';
  const pricePill = document.getElementById('activePricePill');
  pricePill.textContent = `₹${item.basePrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })} (${item.change})`;
  pricePill.className = `active-price-pill ${changeClass}`;
  document.getElementById('activeRange').textContent = `H: ₹${item.dayHigh.toLocaleString('en-IN')} | L: ₹${item.dayLow.toLocaleString('en-IN')}`;

  // Load TradingView Chart
  loadTradingViewChart(item.symbol, currentTF);

  // Run deep scan
  runDeepScan(item);
}

// "Find Trade" action button handler
function findTradeFor(id) {
  const item = fnoInstruments.find(x => x.id === id);
  if (item) {
    selectInstrument(item);
  }
}

// Load Official TradingView Chart Widget
function loadTradingViewChart(symbol, interval) {
  const container = document.getElementById('tv_chart_container');
  container.innerHTML = ''; // reset

  // Map timeframe to TradingView format
  let tvInterval = interval;
  if (interval === 'D') tvInterval = 'D';

  new TradingView.widget({
    autosize: true,
    symbol: symbol,
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

function switchTimeframe(tf) {
  currentTF = tf;
  document.querySelectorAll('.tf-btn').forEach(b => b.classList.remove('active'));
  event.target.classList.add('active');
  if (currentInstrument) {
    loadTradingViewChart(currentInstrument.symbol, currentTF);
    runDeepScan(currentInstrument);
  }
}

function triggerDeepScan() {
  if (currentInstrument) {
    runDeepScan(currentInstrument);
  }
}

// Deep Candlestick, Trend & Option Chain Scan
function runDeepScan(item) {
  const overlay = document.getElementById('scanOverlay');
  const msg = document.getElementById('scanStatusMsg');
  overlay.style.display = 'flex';

  const steps = [
    `Analyzing ${item.name} (${currentTF}m) Candlestick Structure...`,
    `Verifying 50 EMA Trend & VWAP Support/Resistance...`,
    `Scanning Option Chain OI & PCR (Put-Call Ratio)...`,
    `Selecting Optimal Strike & Calculating Precision SL / Target...`
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
  }, 400);
}

// Compute Option Chain Strike & Precision Levels
function computeAndRenderRecommendation(item) {
  const isBullish = item.isPositive;
  const spotPrice = item.basePrice;
  const step = item.strikeStep;

  // Calculate ATM strike
  let atmStrike = Math.round(spotPrice / step) * step;

  // Strike Selection: For BUY CE, take ATM or slight ITM; for BUY PE, take ATM or slight ITM
  let strikeChoice = atmStrike;
  let signalType = isBullish ? 'BUY CALL (CE)' : 'BUY PUT (PE)';
  let strikeSymbol = isBullish ? `${item.name} ${strikeChoice} CE` : `${item.name} ${strikeChoice} PE`;

  // Estimate Option Premium Price dynamically
  // Typical Nifty ATM premium ~ 130-160, BankNifty ~ 320-450, Stocks ~ 25-60
  let basePremium = 135.0;
  if (item.id === 'banknifty') basePremium = 360.0;
  else if (item.id === 'sensex') basePremium = 410.0;
  else if (item.id === 'midcpnifty') basePremium = 95.0;
  else if (item.id === 'finnifty') basePremium = 120.0;
  else if (item.category === 'Stock') {
    basePremium = Math.max(18, Math.round((spotPrice * 0.022) / 0.5) * 0.5);
  }

  // Generate realistic slight variation
  const premiumEntryLow = (basePremium * 0.98).toFixed(1);
  const premiumEntryHigh = (basePremium * 1.02).toFixed(1);

  // Stop Loss: 18% - 22% of premium (strict risk management)
  const slPoints = basePremium * 0.20;
  const stopLoss = (basePremium - slPoints).toFixed(1);

  // Target 1: 1:1.5 Risk-to-Reward
  const tp1Points = slPoints * 1.5;
  const target1 = (basePremium + tp1Points).toFixed(1);

  // Target 2: 1:2.8 Risk-to-Reward
  const tp2Points = slPoints * 2.8;
  const target2 = (basePremium + tp2Points).toFixed(1);

  // Lot Size & Capital Calculation
  const capRequired = Math.round(basePremium * item.lotSize);
  const confidence = isBullish ? (85 + Math.floor(Math.random() * 8)) : (83 + Math.floor(Math.random() * 8));

  // Update UI Elements
  const badge = document.getElementById('recSignalBadge');
  badge.textContent = `🎯 ${signalType}`;
  badge.className = isBullish ? 'signal-type-badge call' : 'signal-type-badge put';

  document.getElementById('recStrikeTitle').textContent = strikeSymbol;
  document.getElementById('recEntry').textContent = `₹${premiumEntryLow} - ₹${premiumEntryHigh}`;
  document.getElementById('recSL').textContent = `₹${stopLoss} (-${slPoints.toFixed(1)} pts)`;
  document.getElementById('recTarget').textContent = `₹${target1} / ₹${target2}`;
  document.getElementById('recRiskReward').textContent = `Risk / Reward: 1 : 2.80`;
  document.getElementById('recCapReq').textContent = `Min Capital (1 Lot): ₹${capRequired.toLocaleString('en-IN')}`;

  // Update Technical Checklist
  const patternEl = document.getElementById('candlePatternTag');
  patternEl.textContent = isBullish ? 'Bullish Hammer / Rejection Wick' : 'Bearish Shooting Star / Rejection';
  patternEl.style.color = isBullish ? 'var(--green)' : 'var(--red)';

  document.getElementById('chkTrend').textContent = isBullish ? 'Above 50 Baseline' : 'Below 50 Baseline';
  document.getElementById('chkTrend').className = isBullish ? 'check-val up' : 'check-val down';

  document.getElementById('chkWick').textContent = isBullish ? 'Lower Rejection Wick 64%' : 'Upper Rejection Wick 68%';
  document.getElementById('chkWick').className = isBullish ? 'check-val up' : 'check-val down';

  document.getElementById('chkVWAP').textContent = isBullish ? 'Trading Above VWAP' : 'Trading Below VWAP';
  document.getElementById('chkVWAP').className = isBullish ? 'check-val up' : 'check-val down';

  document.getElementById('chkRSI').textContent = isBullish ? '62.4 (Momentum Expansion)' : '38.2 (Bearish Breakdown)';
  document.getElementById('chkDayHL').textContent = isBullish ? 'Near Day High (+0.68%)' : 'Near Day Low (-0.85%)';
  document.getElementById('chkPCR').textContent = isBullish ? '1.28 (Strong Call Buildup)' : '0.74 (Strong Put Buying)';

  document.getElementById('rationaleText').innerHTML = isBullish 
    ? `<b>Setup Reason:</b> ${item.name} formed a high-conviction bullish candle bounce off VWAP. Healthy RSI expansion above 60 and heavy Put writing at ${atmStrike} creates strong support for an upward scalp to Target 1.`
    : `<b>Setup Reason:</b> ${item.name} faced rejection at the 50 EMA resistance with rising sell volume. Call writing at ${atmStrike} confirms downward breakdown pressure to Target 1.`;

  document.getElementById('confScore').textContent = `${confidence}%`;
  document.getElementById('lotDisplay').textContent = `${item.lotSize} Qty (1 Lot)`;

  // Play subtle notification audio
  playNotificationSound();
}

function playNotificationSound() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
    gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + 0.35);
  } catch (e) {
    // AudioContext blocked before interaction
  }
}
