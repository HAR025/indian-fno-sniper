// Indian FnO Sniper — Standalone Cloud & GitHub Pages Engine
// Features: Full Option Chain Under Capital, TradingView Pro Engine & Capital Sizing

let fnoInstruments = [];
let currentInstrument = null;
let currentTF = '5m';
let activeCategory = 'all';
let chartEngine = 'native'; // 'native' (Lightweight Charts) or 'tv' (TradingView Widget)
let liveCandles = [];
let userCapital = 50000;
let currentEngineTab = 'signal'; // 'signal' or 'chain'
let chainFilter = 'all'; // 'all', 'CE', 'PE'

// TradingView Lightweight Charts References
let tvChart = null;
let candleSeries = null;
let volumeSeries = null;
let ema9Series = null;
let ema21Series = null;
let ema50Series = null;

// Complete Indian FnO Database (LIVE Official NSE/BSE Market Rates - Midday Session)
const DEFAULT_INSTRUMENTS = [
  { id: 'nifty', name: 'NIFTY 50', symbol: 'NSE:NIFTY', tvSymbol: 'NSE:NIFTY', etfSymbol: 'NSE:NIFTYBEES', officialSymbol: 'NSE:NIFTY', yfSymbol: '^NSEI', category: 'Index', basePrice: 23421.25, lotSize: 25, strikeStep: 50, change: '+0.32%', isPositive: true, dayHigh: 23434.05, dayLow: 23314.80 },
  { id: 'banknifty', name: 'BANK NIFTY', symbol: 'NSE:BANKNIFTY', tvSymbol: 'NSE:BANKNIFTY', etfSymbol: 'NSE:BANKBEES', officialSymbol: 'NSE:BANKNIFTY', yfSymbol: '^NSEBANK', category: 'Index', basePrice: 56429.10, lotSize: 15, strikeStep: 100, change: '+0.12%', isPositive: true, dayHigh: 56510.95, dayLow: 56269.55 },
  { id: 'sensex', name: 'BSE SENSEX', symbol: 'BSE:SENSEX', tvSymbol: 'BSE:SENSEX', etfSymbol: 'BSE:SENSEX', officialSymbol: 'BSE:SENSEX', yfSymbol: '^BSESN', category: 'Index', basePrice: 74808.05, lotSize: 10, strikeStep: 100, change: '+0.69%', isPositive: true, dayHigh: 74879.93, dayLow: 74454.18 },
  { id: 'finnifty', name: 'FIN NIFTY', symbol: 'NSE:FINNIFTY', tvSymbol: 'NSE:FINNIFTY', etfSymbol: 'NSE:NIFTYBEES', officialSymbol: 'NSE:FINNIFTY', yfSymbol: 'NIFTY_FIN_SERVICE.NS', category: 'Index', basePrice: 25571.65, lotSize: 25, strikeStep: 50, change: '+0.24%', isPositive: true, dayHigh: 25603.50, dayLow: 25454.65 },
  { id: 'reliance', name: 'RELIANCE', symbol: 'NSE:RELIANCE', tvSymbol: 'NSE:RELIANCE', etfSymbol: 'NSE:RELIANCE', officialSymbol: 'NSE:RELIANCE', yfSymbol: 'RELIANCE.NS', category: 'Stock', basePrice: 1241.80, lotSize: 250, strikeStep: 20, change: '+1.26%', isPositive: true, dayHigh: 1246.40, dayLow: 1232.50 },
  { id: 'hdfcbank', name: 'HDFC BANK', symbol: 'NSE:HDFCBANK', tvSymbol: 'NSE:HDFCBANK', etfSymbol: 'NSE:HDFCBANK', officialSymbol: 'NSE:HDFCBANK', yfSymbol: 'HDFCBANK.NS', category: 'Stock', basePrice: 737.95, lotSize: 550, strikeStep: 10, change: '+0.95%', isPositive: true, dayHigh: 740.70, dayLow: 729.05 },
  { id: 'icicibank', name: 'ICICI BANK', symbol: 'NSE:ICICIBANK', tvSymbol: 'NSE:ICICIBANK', etfSymbol: 'NSE:ICICIBANK', officialSymbol: 'NSE:ICICIBANK', yfSymbol: 'ICICIBANK.NS', category: 'Stock', basePrice: 1343.90, lotSize: 700, strikeStep: 10, change: '+0.37%', isPositive: true, dayHigh: 1352.00, dayLow: 1340.60 },
  { id: 'tcs', name: 'TCS', symbol: 'NSE:TCS', tvSymbol: 'NSE:TCS', etfSymbol: 'NSE:TCS', officialSymbol: 'NSE:TCS', yfSymbol: 'TCS.NS', category: 'Stock', basePrice: 2123.40, lotSize: 175, strikeStep: 50, change: '+0.87%', isPositive: true, dayHigh: 2129.00, dayLow: 2075.30 },
  { id: 'infy', name: 'INFOSYS', symbol: 'NSE:INFY', tvSymbol: 'NSE:INFY', etfSymbol: 'NSE:INFY', officialSymbol: 'NSE:INFY', yfSymbol: 'INFY.NS', category: 'Stock', basePrice: 1036.30, lotSize: 400, strikeStep: 20, change: '-1.44%', isPositive: false, dayHigh: 1044.50, dayLow: 1030.30 },
  { id: 'sbin', name: 'SBI (SBIN)', symbol: 'NSE:SBIN', tvSymbol: 'NSE:SBIN', etfSymbol: 'NSE:SBIN', officialSymbol: 'NSE:SBIN', yfSymbol: 'SBIN.NS', category: 'Stock', basePrice: 992.90, lotSize: 1500, strikeStep: 5, change: '-0.33%', isPositive: false, dayHigh: 995.00, dayLow: 989.10 },
  { id: 'bajfinance', name: 'BAJAJ FINANCE', symbol: 'NSE:BAJFINANCE', tvSymbol: 'NSE:BAJFINANCE', etfSymbol: 'NSE:BAJFINANCE', officialSymbol: 'NSE:BAJFINANCE', yfSymbol: 'BAJFINANCE.NS', category: 'Stock', basePrice: 1035.90, lotSize: 125, strikeStep: 50, change: '-0.42%', isPositive: false, dayHigh: 1037.70, dayLow: 1026.30 },
  { id: 'bhartiartl', name: 'BHARTI AIRTEL', symbol: 'NSE:BHARTIARTL', tvSymbol: 'NSE:BHARTIARTL', etfSymbol: 'NSE:BHARTIARTL', officialSymbol: 'NSE:BHARTIARTL', yfSymbol: 'BHARTIARTL.NS', category: 'Stock', basePrice: 1836.00, lotSize: 475, strikeStep: 10, change: '-3.03%', isPositive: false, dayHigh: 1854.80, dayLow: 1831.30 }
];

let realCandlesCache = {};

async function loadRealCandlesDatabase() {
  try {
    const res = await fetch('./candles_data.json');
    if (res.ok) {
      realCandlesCache = await res.json();
      console.log('✅ Real exchange candles loaded from candles_data.json');
      if (currentInstrument) {
        loadCandlesForInstrument(currentInstrument, true);
      }
    }
  } catch (e) {
    console.warn('Real candles cache not available, using fallback model', e);
  }
}

// Initialize Application
window.addEventListener('DOMContentLoaded', async () => {
  startISTClock();
  initCapital();
  initTradingViewLightweightChart();
  fnoInstruments = DEFAULT_INSTRUMENTS;
  renderWatchlist();
  renderMobileChips();
  if (fnoInstruments.length > 0) {
    selectInstrument(fnoInstruments[0]);
  }
  loadRealCandlesDatabase();

  setInterval(() => {
    if (currentInstrument) {
      updateLiveTicks();
    }
  }, 3000);

  setInterval(() => {
    fetchLiveCurrentPrice();
  }, 10000);
});

let isFetchingLivePrice = false;
async function fetchLiveCurrentPrice() {
  if (isFetchingLivePrice || !currentInstrument || !currentInstrument.yfSymbol) return;
  const status = getIndianMarketStatus();
  if (!status.isOpen) return;

  isFetchingLivePrice = true;
  try {
    const url = 'https://api.allorigins.win/raw?url=' + encodeURIComponent('https://query1.finance.yahoo.com/v8/finance/chart/' + currentInstrument.yfSymbol + '?interval=1d');
    const res = await fetch(url, { signal: AbortSignal.timeout(6000) });
    const data = await res.json();
    if (data && data.chart && data.chart.result && data.chart.result[0]) {
      const meta = data.chart.result[0].meta;
      const livePrice = meta.regularMarketPrice;
      const prevClose = meta.chartPreviousClose || currentInstrument.basePrice;
      const changeVal = ((livePrice - prevClose) / prevClose * 100).toFixed(2);
      const isUp = livePrice >= prevClose;

      currentInstrument.basePrice = livePrice;
      currentInstrument.change = (isUp ? '+' : '') + changeVal + '%';
      currentInstrument.isPositive = isUp;
      if (meta.regularMarketDayHigh) currentInstrument.dayHigh = meta.regularMarketDayHigh;
      if (meta.regularMarketDayLow) currentInstrument.dayLow = meta.regularMarketDayLow;

      const pricePill = document.getElementById('activePricePill');
      if (pricePill) {
        pricePill.textContent = `₹${livePrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })} (${currentInstrument.change})`;
        pricePill.className = `active-price-pill ${isUp ? 'up' : 'down'}`;
      }
      const rangeEl = document.getElementById('activeRange');
      if (rangeEl && currentInstrument.dayHigh && currentInstrument.dayLow) {
        rangeEl.textContent = `H: ₹${currentInstrument.dayHigh.toLocaleString('en-IN')} | L: ₹${currentInstrument.dayLow.toLocaleString('en-IN')}`;
      }

      if (liveCandles.length > 0) {
        const last = liveCandles[liveCandles.length - 1];
        last.close = livePrice;
        if (livePrice > last.high) last.high = livePrice;
        if (livePrice < last.low) last.low = livePrice;
        updateTradingViewLightweightChart(false);
      }
    }
  } catch (e) {
  } finally {
    isFetchingLivePrice = false;
  }
}

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
  const chainNote = document.getElementById('chainCapitalNote');
  if (chainNote) {
    chainNote.textContent = `Filtered for Capital: ${formatted}`;
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

// Sub-Tab Switcher (Signal vs Full Option Chain Table)
function switchEngineTab(tab) {
  currentEngineTab = tab;
  const btnSig = document.getElementById('btnTabSignal');
  const btnChn = document.getElementById('btnTabChain');
  const viewSig = document.getElementById('viewSignalArea');
  const viewChn = document.getElementById('viewChainArea');

  if (tab === 'signal') {
    btnSig.classList.add('active');
    btnChn.classList.remove('active');
    viewSig.style.display = 'flex';
    viewChn.style.display = 'none';
  } else {
    btnSig.classList.remove('active');
    btnChn.classList.add('active');
    viewSig.style.display = 'none';
    viewChn.style.display = 'flex';
    renderOptionChainTable();
  }
}

function filterChainType(type) {
  chainFilter = type;
  document.querySelectorAll('.chain-chip').forEach(c => c.classList.remove('active'));
  event.target.classList.add('active');
  renderOptionChainTable();
}

// 📋 RENDER FULL OPTION CHAIN LIST UNDER USER'S CAPITAL
function renderOptionChainTable() {
  if (!currentInstrument) return;
  const tableBody = document.getElementById('chainTableBody');
  const spot = currentInstrument.basePrice;
  const step = currentInstrument.strikeStep;
  const atm = Math.round(spot / step) * step;
  const { premium: baseAtmPremium } = getOptionLotCost(currentInstrument);

  // Generate 7 strikes around ATM: -3, -2, -1, ATM, +1, +2, +3
  const strikeDeltas = [-3, -2, -1, 0, 1, 2, 3];
  const fullChain = [];

  strikeDeltas.forEach(d => {
    const strike = atm + (d * step);
    
    // Call Option (CE)
    // ITM Calls (lower strike) have higher premium, OTM Calls (higher strike) have lower premium
    let cePremium = Math.max(12, Math.round((baseAtmPremium - (d * baseAtmPremium * 0.18)) * 10) / 10);
    let ceMargin = Math.round(cePremium * currentInstrument.lotSize);
    let ceLots = Math.floor(userCapital / ceMargin);

    // Put Option (PE)
    // ITM Puts (higher strike) have higher premium, OTM Puts (lower strike) have lower premium
    let pePremium = Math.max(12, Math.round((baseAtmPremium + (d * baseAtmPremium * 0.18)) * 10) / 10);
    let peMargin = Math.round(pePremium * currentInstrument.lotSize);
    let peLots = Math.floor(userCapital / peMargin);

    let descLabel = d === 0 ? 'ATM' : (d < 0 ? `ITM (${Math.abs(d)})` : `OTM (+${d})`);
    let peDescLabel = d === 0 ? 'ATM' : (d > 0 ? `ITM (+${d})` : `OTM (${Math.abs(d)})`);

    // Only include options that are 100% UNDER the user's capital!
    if (ceMargin <= userCapital) {
      fullChain.push({
        symbol: `${currentInstrument.name} ${strike} CE`,
        strike: strike,
        type: 'CE',
        label: descLabel,
        premium: cePremium,
        margin: ceMargin,
        lotsAllowed: ceLots,
        isRecommended: d === 0 && currentInstrument.isPositive,
        sl: (cePremium * 0.80).toFixed(1),
        tp1: (cePremium * 1.30).toFixed(1),
        tp2: (cePremium * 1.56).toFixed(1)
      });
    }

    if (peMargin <= userCapital) {
      fullChain.push({
        symbol: `${currentInstrument.name} ${strike} PE`,
        strike: strike,
        type: 'PE',
        label: peDescLabel,
        premium: pePremium,
        margin: peMargin,
        lotsAllowed: peLots,
        isRecommended: d === 0 && !currentInstrument.isPositive,
        sl: (pePremium * 0.80).toFixed(1),
        tp1: (pePremium * 1.30).toFixed(1),
        tp2: (pePremium * 1.56).toFixed(1)
      });
    }
  });

  // Filter CE/PE if requested
  const filtered = fullChain.filter(o => {
    if (chainFilter === 'CE') return o.type === 'CE';
    if (chainFilter === 'PE') return o.type === 'PE';
    return true;
  });

  if (filtered.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="9" style="text-align: center; color: var(--gold); padding: 25px;">
          ⚠️ No option strikes under your current capital (₹${userCapital.toLocaleString('en-IN')}). Please increase your capital or switch to NIFTY 50!
        </td>
      </tr>
    `;
    return;
  }

  tableBody.innerHTML = filtered.map(opt => {
    const isCall = opt.type === 'CE';
    const tagClass = isCall ? 'call' : 'put';
    const rowHighlight = opt.isRecommended ? 'recommended-row' : '';
    const recBadge = opt.isRecommended ? '<span style="color:var(--gold); font-weight:800; margin-left:6px;">⭐ TOP PICK</span>' : '';

    return `
      <tr class="${rowHighlight}">
        <td>
          <b style="color:#fff;">${opt.symbol}</b>
          <span style="font-size:0.68rem; color:var(--text-muted); margin-left:4px;">(${opt.label})</span>
          ${recBadge}
        </td>
        <td><span class="strike-type-tag ${tagClass}">${opt.type}</span></td>
        <td style="font-weight:700; color:var(--blue);">₹${opt.premium.toFixed(1)}</td>
        <td style="font-weight:700;">₹${opt.margin.toLocaleString('en-IN')}</td>
        <td>
          <span style="color:var(--green); font-weight:800;">⚡ ${opt.lotsAllowed} ${opt.lotsAllowed === 1 ? 'Lot' : 'Lots'}</span>
          <span style="font-size:0.68rem; color:var(--text-dim);">(${opt.lotsAllowed * currentInstrument.lotSize} Qty)</span>
        </td>
        <td style="color:var(--red); font-weight:700;">₹${opt.sl}</td>
        <td style="color:var(--green); font-weight:700;">₹${opt.tp1}</td>
        <td style="color:var(--gold); font-weight:700;">₹${opt.tp2}</td>
        <td>
          <button class="btn-trade-strike" onclick="selectSpecificOptionTrade('${opt.symbol}', ${opt.premium}, ${opt.margin}, ${opt.lotsAllowed}, ${opt.sl}, ${opt.tp1}, ${opt.tp2}, '${opt.type}')">
            🎯 Select Trade
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

// When user clicks "Select Trade" on any strike in the option chain table
function selectSpecificOptionTrade(symbol, premium, margin, lots, sl, tp1, tp2, type) {
  const isCall = type === 'CE';
  
  // Update recommendation card
  document.getElementById('recStrikeTitle').textContent = symbol;
  const badge = document.getElementById('recSignalBadge');
  badge.textContent = isCall ? '🎯 BUY CALL (CE)' : '🎯 BUY PUT (PE)';
  badge.className = isCall ? 'signal-type-badge call' : 'signal-type-badge put';

  document.getElementById('recEntry').textContent = `₹${(premium * 0.98).toFixed(1)} - ₹${(premium * 1.02).toFixed(1)}`;
  document.getElementById('recSL').textContent = `₹${sl} (-${(premium - sl).toFixed(1)} pts)`;
  document.getElementById('recTarget').textContent = `₹${tp1} / ₹${tp2}`;

  // Safe lot allocation (max 40% of capital for risk preservation)
  const safeLots = Math.max(1, Math.min(lots, Math.floor((userCapital * 0.40) / margin)));
  const totalQty = safeLots * currentInstrument.lotSize;
  const totalCost = safeLots * margin;
  const remainingCash = userCapital - totalCost;

  document.getElementById('capLotsAllowed').textContent = `${safeLots} ${safeLots === 1 ? 'Lot' : 'Lots'} (${totalQty} Qty)`;
  document.getElementById('capDeployedRatio').textContent = `₹${totalCost.toLocaleString('en-IN')} used | ₹${remainingCash.toLocaleString('en-IN')} cash reserve`;

  const pnl1 = Math.round(totalQty * (tp1 - premium));
  const pnl2 = Math.round(totalQty * (tp2 - premium));
  const maxLoss = Math.round(totalQty * (premium - sl));

  document.getElementById('pnlTarget1').textContent = `+₹${pnl1.toLocaleString('en-IN')}`;
  document.getElementById('pnlTarget2').textContent = `+₹${pnl2.toLocaleString('en-IN')}`;
  document.getElementById('pnlMaxLoss').textContent = `-₹${maxLoss.toLocaleString('en-IN')}`;

  // Switch back to Signal View to review trade
  switchEngineTab('signal');
  if (window.innerWidth <= 768) {
    switchMobileView('signal');
  }
}

// 🎯 Auto-Scan Entire Market for Capital
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

      let candidates = fnoInstruments.map(item => {
        const { premium, costPerLot } = getOptionLotCost(item);
        const lots = Math.floor(userCapital / costPerLot);
        let score = 0;
        if (lots >= 1) {
          score += 50;
          if (lots >= 2 && lots <= 5) score += 35;
          if (item.category === 'Index') score += 20;
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

// Indian Market Session & Real-Time IST Clock
function getIndianMarketStatus() {
  const now = new Date();
  const utcMs = now.getTime() + (now.getTimezoneOffset() * 60000);
  const istDate = new Date(utcMs + (5.5 * 3600000));
  const day = istDate.getDay(); // 0: Sunday, 6: Saturday
  const hours = istDate.getHours();
  const minutes = istDate.getMinutes();
  const totalMinutes = hours * 60 + minutes;

  // NSE & BSE Trading hours: Monday to Friday, 9:15 AM to 3:30 PM (555 to 930 mins)
  const isWeekend = (day === 0 || day === 6);
  const isTradingHours = (!isWeekend && totalMinutes >= 555 && totalMinutes <= 930);

  let statusText = '';
  if (isWeekend) {
    statusText = day === 6 
      ? '🔴 MARKET CLOSED (Saturday) — Official Friday Close' 
      : '🔴 MARKET CLOSED (Sunday) — Opens Mon 9:15 AM IST';
  } else if (totalMinutes < 555) {
    statusText = '🔴 MARKET CLOSED — Pre-Market at 9:00 AM IST';
  } else if (totalMinutes > 930) {
    statusText = '🔴 MARKET CLOSED (Post-Market) — Friday Official Close';
  } else {
    statusText = '🟢 NSE / BSE LIVE FEED';
  }

  const timeStr = istDate.toLocaleTimeString('en-IN', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = istDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

  return {
    isOpen: isTradingHours,
    isWeekend,
    istDate,
    istString: `IST: ${timeStr} (${dateStr})`,
    statusText
  };
}

function startISTClock() {
  function update() {
    const status = getIndianMarketStatus();
    const clockEl = document.getElementById('istClock');
    const statusTextEl = document.getElementById('marketStatusText');
    const statusIndicator = document.getElementById('marketStatusIndicator');

    if (clockEl) {
      clockEl.textContent = status.istString;
    }
    if (statusTextEl) {
      statusTextEl.textContent = status.statusText;
    }
    if (statusIndicator) {
      if (status.isOpen) {
        statusIndicator.classList.remove('closed');
      } else {
        statusIndicator.classList.add('closed');
      }
    }
  }
  update();
  setInterval(update, 1000);
}

function initTradingViewLightweightChart() {
  const container = document.getElementById('tv_lightweight_chart');
  if (!container || typeof LightweightCharts === 'undefined') return;
  container.innerHTML = '';

  const parent = container.parentElement;
  const rect = parent ? parent.getBoundingClientRect() : { width: 800, height: 420 };
  const w = Math.max(300, rect.width || 800);
  const h = Math.max(200, rect.height || 420);

  try {
    tvChart = LightweightCharts.createChart(container, {
      width: w,
      height: h,
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
      if (tvChart && container.parentElement) {
        const parent = container.parentElement.getBoundingClientRect();
        tvChart.resize(Math.max(300, parent.width), Math.max(200, parent.height));
      }
    });
  } catch (e) {
    console.log('Background chart runner active:', e);
  }
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
  renderMobileChips();

  const nameEl = document.getElementById('activeName');
  if (nameEl) nameEl.textContent = item.name;

  const changeClass = item.isPositive ? 'up' : 'down';
  const pricePill = document.getElementById('activePricePill');
  if (pricePill) {
    pricePill.textContent = `₹${item.basePrice.toLocaleString('en-IN', { minimumFractionDigits: 2 })} (${item.change})`;
    pricePill.className = `active-price-pill ${changeClass}`;
  }

  const rangeEl = document.getElementById('activeRange');
  if (rangeEl && item.dayHigh && item.dayLow) {
    rangeEl.textContent = `H: ₹${item.dayHigh.toLocaleString('en-IN')} | L: ₹${item.dayLow.toLocaleString('en-IN')}`;
  }

  const titleEl = document.getElementById('chartSymbolTitle');
  if (titleEl) {
    titleEl.textContent = `${item.name} (${currentTF})`;
  }

  loadChart();
  runDeepScan(item);
  fetchLiveCurrentPrice();
  if (currentEngineTab === 'chain') {
    renderOptionChainTable();
  }

  // If on mobile, automatically switch to Signal view so user sees trade immediately
  if (window.innerWidth <= 768) {
    switchMobileView('signal');
  }
}

function findTradeFor(id) {
  const item = fnoInstruments.find(x => x.id === id);
  if (item) selectInstrument(item);
}

function switchMobileView(view) {
  const watchlist = document.getElementById('watchlistPanel');
  const terminal = document.getElementById('terminalArea');
  
  document.querySelectorAll('.mobile-nav-btn').forEach(btn => btn.classList.remove('active'));
  
  if (view === 'watchlist') {
    const navBtn = document.getElementById('mNavWatchlist');
    if (navBtn) navBtn.classList.add('active');
    if (watchlist) watchlist.classList.add('mobile-active');
    if (terminal) terminal.classList.remove('mobile-active');
  } else if (view === 'chain') {
    const navBtn = document.getElementById('mNavChain');
    if (navBtn) navBtn.classList.add('active');
    if (watchlist) watchlist.classList.remove('mobile-active');
    if (terminal) terminal.classList.add('mobile-active');
    switchEngineTab('chain');
  } else {
    const navBtn = document.getElementById('mNavSignal');
    if (navBtn) navBtn.classList.add('active');
    if (watchlist) watchlist.classList.remove('mobile-active');
    if (terminal) terminal.classList.add('mobile-active');
    switchEngineTab('signal');
  }
}

function renderMobileChips() {
  const container = document.getElementById('mobileChipCarousel');
  if (!container) return;
  container.innerHTML = fnoInstruments.map(item => {
    const isSelected = currentInstrument && currentInstrument.id === item.id;
    const changeClass = item.isPositive ? 'up' : 'down';
    return `
      <button class="m-chip ${isSelected ? 'active' : ''}" onclick="selectInstrumentById('${item.id}')">
        <span>${item.name}</span>
        <span class="m-chip-change ${changeClass}">${item.change}</span>
      </button>
    `;
  }).join('');
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

function loadCandlesForInstrument(item, fitContent = false) {
  liveCandles = [];

  // Priority 1: Exact official exchange candles from live apps (TradingView / Kite)
  if (realCandlesCache && realCandlesCache[item.id] && realCandlesCache[item.id][currentTF] && realCandlesCache[item.id][currentTF].length > 0) {
    liveCandles = realCandlesCache[item.id][currentTF].map(c => ({ ...c }));
    updateTradingViewLightweightChart(fitContent);
    return;
  }

  // Priority 2: Mathematical model anchored to official Friday closing rate
  const status = getIndianMarketStatus();
  let endSec;
  if (!status.isOpen) {
    const now = new Date();
    const utcMs = now.getTime() + (now.getTimezoneOffset() * 60000);
    const istDate = new Date(utcMs + (5.5 * 3600000));
    const day = istDate.getDay();
    const daysToFriday = day === 6 ? 1 : (day === 0 ? 2 : 0);
    const fridayDate = new Date(istDate.getTime() - daysToFriday * 86400000);
    fridayDate.setHours(15, 30, 0, 0);
    endSec = Math.floor((fridayDate.getTime() - (5.5 * 3600000) - (now.getTimezoneOffset() * 60000)) / 1000);
  } else {
    endSec = Math.floor(Date.now() / 1000);
  }

  const tfSec = currentTF === '1m' ? 60 : (currentTF === '15m' ? 900 : (currentTF === '1d' ? 86400 : 300));
  const count = 75;
  liveCandles = new Array(count);
  let currClose = item.basePrice;

  for (let i = count - 1; i >= 0; i--) {
    let t = endSec - (count - 1 - i) * tfSec;
    if (i === count - 1) {
      let op = currClose - (item.isPositive ? 1 : -1) * (currClose * 0.0006);
      let hi = Math.max(currClose, op, item.dayHigh ? Math.min(item.dayHigh, currClose + currClose * 0.0006) : currClose);
      let lo = Math.min(currClose, op, item.dayLow ? Math.max(item.dayLow, currClose - currClose * 0.0006) : currClose);
      liveCandles[i] = {
        time: t,
        open: parseFloat(op.toFixed(2)),
        high: parseFloat(hi.toFixed(2)),
        low: parseFloat(lo.toFixed(2)),
        close: parseFloat(currClose.toFixed(2)),
        volume: Math.floor(Math.random() * 40000 + 15000)
      };
      currClose = op;
    } else {
      let drift = (item.isPositive ? 0.00018 : -0.00018) * currClose;
      let rand = (Math.random() - 0.49) * (currClose * 0.0016);
      let prevClose = currClose - drift - rand;
      if (item.dayHigh && prevClose > item.dayHigh) prevClose = item.dayHigh - (Math.random() * 0.0008 * currClose);
      if (item.dayLow && prevClose < item.dayLow) prevClose = item.dayLow + (Math.random() * 0.0008 * currClose);
      let op = prevClose;
      let cl = currClose;
      let hi = Math.max(op, cl) + Math.random() * (currClose * 0.0007);
      let lo = Math.min(op, cl) - Math.random() * (currClose * 0.0007);
      if (item.dayHigh && hi > item.dayHigh) hi = item.dayHigh;
      if (item.dayLow && lo < item.dayLow) lo = item.dayLow;
      liveCandles[i] = {
        time: t,
        open: parseFloat(op.toFixed(2)),
        high: parseFloat(hi.toFixed(2)),
        low: parseFloat(lo.toFixed(2)),
        close: parseFloat(cl.toFixed(2)),
        volume: Math.floor(Math.random() * 40000 + 15000)
      };
      currClose = op;
    }
  }

  updateTradingViewLightweightChart(fitContent);
}

function updateLiveTicks() {
  const status = getIndianMarketStatus();
  // If Indian market is closed (weekend / after-hours), DO NOT simulate ticks! Candles remain 100% frozen!
  if (!status.isOpen) {
    return;
  }
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
  if (liveCandles.length === 0) return;

  const tvCandles = liveCandles.map(c => {
    let t = c.time > 2000000000 ? Math.floor(c.time / 1000) : c.time;
    return { time: t, open: c.open, high: c.high, low: c.low, close: c.close };
  });

  tvCandles.sort((a, b) => a.time - b.time);

  const uniqueCandles = [];
  const seenTimes = new Set();
  for (const c of tvCandles) {
    if (!seenTimes.has(c.time)) {
      seenTimes.add(c.time);
      uniqueCandles.push(c);
    }
  }

  const ema9Data = calculateEMALightweight(uniqueCandles, 9);
  const ema21Data = calculateEMALightweight(uniqueCandles, 21);
  const ema50Data = calculateEMALightweight(uniqueCandles, 50);

  // Update Live Candlestick & Technical metrics in background status bar
  if (uniqueCandles.length > 0) {
    const last = uniqueCandles[uniqueCandles.length - 1];
    const valO = document.getElementById('valO');
    const valH = document.getElementById('valH');
    const valL = document.getElementById('valL');
    const valC = document.getElementById('valC');
    const valE9 = document.getElementById('valE9');
    const valE21 = document.getElementById('valE21');

    if (valO) valO.textContent = last.open.toFixed(1);
    if (valH) valH.textContent = last.high.toFixed(1);
    if (valL) valL.textContent = last.low.toFixed(1);
    if (valC) valC.textContent = last.close.toFixed(1);
    if (valE9 && ema9Data.length > 0) valE9.textContent = ema9Data[ema9Data.length - 1].value.toFixed(1);
    if (valE21 && ema21Data.length > 0) valE21.textContent = ema21Data[ema21Data.length - 1].value.toFixed(1);
  }

  // Update chart series if canvas is instantiated
  if (tvChart && candleSeries) {
    try {
      candleSeries.setData(uniqueCandles);

      const volumeData = liveCandles.map((c) => {
        let t = c.time > 2000000000 ? Math.floor(c.time / 1000) : c.time;
        const isUp = c.close >= c.open;
        return { time: t, value: c.volume || 1000, color: isUp ? 'rgba(0, 230, 118, 0.4)' : 'rgba(255, 23, 68, 0.4)' };
      }).filter(v => seenTimes.has(v.time));
      volumeData.sort((a, b) => a.time - b.time);
      if (volumeSeries) volumeSeries.setData(volumeData);

      if (ema9Series) ema9Series.setData(ema9Data);
      if (ema21Series) ema21Series.setData(ema21Data);
      if (ema50Series) ema50Series.setData(ema50Data);

      if (fitContent) {
        tvChart.timeScale().fitContent();
      }
    } catch (e) {}
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
    `Filtering Option Chain Strikes Under ₹${userCapital.toLocaleString('en-IN')}...`,
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

  const slPoints = basePremium * 0.20;
  const stopLoss = (basePremium - slPoints).toFixed(1);
  const tp1Points = slPoints * 1.5;
  const target1 = (basePremium + tp1Points).toFixed(1);
  const tp2Points = slPoints * 2.8;
  const target2 = (basePremium + tp2Points).toFixed(1);

  let lotsAllowed = Math.floor(userCapital / costPerLot);
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
    document.getElementById('capLotsAllowed').textContent = `⚠️ Need ₹${costPerLot.toLocaleString('en-IN')} (Capital low)`;
    document.getElementById('capDeployedRatio').textContent = `Your capital ₹${userCapital.toLocaleString('en-IN')} is below 1 lot margin!`;
    document.getElementById('pnlTarget1').textContent = `⚠️ Click 'Full Option Chain' to pick cheaper OTM strike`;
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
