# ⚡ Indian FnO Sniper Terminal

A high-precision **Indian Futures & Options (FnO)** Trade Finder, Candlestick Auto-Scanner, and Option Chain Recommendation Terminal.

---

## 🌐 Live Free Access (Zero Localhost Required)

Open anytime on your phone, tablet, or desktop:
👉 **[https://har025.github.io/indian-fno-sniper/](https://har025.github.io/indian-fno-sniper/)**

---

## 🌟 Key Features

1. **Interactive Trading Capital Sizing Engine:**
   - Prompts for your active trading capital upon launch (e.g. ₹10K, ₹25K, ₹50K, ₹1L, ₹2L or custom).
   - Dynamically calculates:
     - Number of lots you can afford for every option strike.
     - Margin required per lot.
     - Capital deployed ratio vs cash reserve.
     - Net projected rupee profit for Target 1 & Target 2, and exact Max Loss in rupees.
   - Click the top badge **`[ 💼 My Trading Capital ]`** anytime to re-adjust.

2. **1-Click Auto-Scanner: `[ 🎯 Auto-Find Best Trade For My Capital ]`:**
   - Scans all 12 Indian FnO instruments simultaneously.
   - Evaluates candlestick price-action confluences, VWAP bounce, 50 EMA baselines, and Option Chain Put-Call Ratio (PCR).
   - Ranks and instantly opens the highest-confluence trade matching your available capital.

3. **Full Option Chain Explorer (All Strikes Under Capital):**
   - Direct tab: **`[ 📋 Full Option Chain ]`**.
   - Filters strikes strictly within your capital budget.
   - Shows both **Call (CE)** and **Put (PE)** strikes with LTP, margin requirement, max lots allowed, Stop-Loss, and Targets.
   - Click **`[ 🎯 Select Trade ]`** on any strike to immediately load custom execution parameters.

4. **100% Real Exchange Candlestick Engine (Live Apps Parity):**
   - Bundles official exchange OHLCV data matching **TradingView**, **Zerodha Kite**, and **Groww**.
   - Multi-timeframe support: **1m**, **5m**, **15m**, and **1D**.
   - Built-in Technical Indicators:
     - **EMA 9** (Cyan)
     - **EMA 21** (Gold)
     - **EMA 50** (Purple)
     - Volume histogram bars
     - Real-time crosshair OHLC legend
     - Signal Marker: **BUY CE** (Green arrow) / **BUY PE** (Red arrow).

5. **Indian Market Session Detector (IST):**
   - Synchronized with official exchange hours: **Monday to Friday, 9:15 AM to 3:30 PM IST**.
   - On weekends and after-hours, displays:
     ```
     🔴 MARKET CLOSED (Weekend) — Friday Official Close
     ```
   - Freezes candle ticks during market closure so charts never glitch or move artificially over weekends.

6. **Dual Chart Mode:**
   - **📊 TradingView Pro Engine:** Lightweight Charts powered by TradingView standalone library.
   - **📈 TradingView Widget:** Official full-featured TradingView station with drawing tools and official NSE/BSE symbols.

