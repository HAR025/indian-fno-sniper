# ⚡ HBTRADE — Institutional FnO Trade Finder & Scanner

**HBTRADE** is an institutional-grade Indian Futures & Options (FnO) Trade Finder, continuous live market scanner, and analytical platform integrating the full feature set of **TradeFinder (`tradefinder.in`)** with strict **1:2 Risk-to-Reward trade generation** and dynamic capital sizing.

---

## 🌐 Live Free Access (Zero Localhost Required)

Open anytime on your phone, tablet, or desktop:
👉 **[https://har025.github.io/indian-fno-sniper/](https://har025.github.io/indian-fno-sniper/)**

---

## 🔬 TradeFinder Pro Suite (5-in-1 Institutional Engines)

HBTRADE integrates all 5 signature analytical workflows popularized by TradeFinder:

1. **Option Clock (Time-Slot Accumulation):**
   - Tracks institutional participation across 5 market blocks:
     - `09:15 - 10:30`: Opening Drive & Volatility Squeeze
     - `10:30 - 11:45`: Morning Trend Expansion Zone
     - `11:45 - 13:00`: Midday Chop & Theta Decay Trap
     - `13:00 - 14:15`: European Re-Open / Breakout
     - `14:15 - 15:30`: Power Hour & Expiry Squeeze
   - Displays real-time Call vs. Put order flow bars.

2. **Option Apex (High-Conviction Index Strike Identifier):**
   - Evaluates Call vs. Put velocity on ATM & OTM strikes.
   - Filters out buyer traps and pinpoints the single highest-probability strike.
   - Provides 1-click loading into the Capital Sizing Engine.

3. **Sector Scope (Sectoral Momentum Heatmap):**
   - Monitors key sector baskets driving Nifty: Nifty Bank, Nifty IT, Nifty Auto, Nifty Energy, Nifty Metal, and Fin Services.
   - Prevents counter-trend trades by checking sectoral alignment.

4. **Insider Strategy (Open Interest & Price Action Classifier):**
   - Automatically categorizes every F&O stock into:
     - 🟢 **Long Build-Up**: Price ⬆, OI ⬆ (Aggressive buying inflow)
     - 🟡 **Short Covering**: Price ⬆, OI ⬇ (Sellers running for cover)
     - 🔴 **Short Build-Up**: Price ⬇, OI ⬆ (Institutional call writing)
     - 🟠 **Long Unwinding**: Price ⬇, OI ⬇ (Profit booking)

5. **Market Pulse (Volume Surges & Range Expansion):**
   - Live ranking of top institutional volume spikes (e.g. 2.8x volume surge, 80%+ intraday range expansion).

---

## 🎯 1:2 Minimum Risk-to-Reward Execution Protocol

HBTRADE strictly rejects small micro trades:
- **Optimal Entry Zone:** Clear entry boundary so you never chase high premiums.
- **Strict 1R Stop Loss:** Anchored directly to volatility and support/resistance.
- **Target 1 (Clean 1:2 R:R):** Exactly double the risk (2.0x SL points).
- **Target 2 (Extended 1:3 R:R):** 3.0x SL points runner.
- **Capital Lot Sizing:** Automatically calculates how many lots to buy based on your trading capital (e.g., ₹10K, ₹25K, ₹50K, ₹1L+), deployed margin, safe cash reserve, and net projected rupee outcome.

---

## 📈 Live Interactive Chart & Level Overlay

- Lightweight Charts powered by TradingView standalone library.
- Dynamic color-coded horizontal price lines plotted on chart:
  - 🔵 **Entry Zone**
  - 🔴 **Stop Loss (1R)**
  - 🟢 **Target 1 (1:2 R:R)**
  - 🟡 **Target 2 (1:3 R:R)**
- EMAs: 9 EMA (Cyan), 21 EMA (Gold), 50 EMA (Purple).
- One-click order slip copy formatted for easy broker placement.
