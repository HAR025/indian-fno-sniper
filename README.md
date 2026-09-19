# ⚡ Indian FnO Sniper Terminal

A private, high-precision **Indian Futures & Options (FnO)** Trade Finder, Candlestick Auto-Scanner, and Option Chain Recommendation Terminal.

---

## 🔒 Confidential & Personal Use
This repository is configured for **private use only**. Do not distribute publicly.

---

## 🌟 Key Features

1. **Indian FnO Live Watchlist:**
   - **Indices:** NIFTY 50, BANK NIFTY, FIN NIFTY, MIDCAP NIFTY, BSE SENSEX.
   - **Top High-Beta Stocks:** RELIANCE, HDFC BANK, ICICI BANK, TATA MOTORS, TCS, INFY, SBIN, BAJAJ FINANCE, BHARTI AIRTEL, MARUTI.
   - Shows live price, % change, day high/low, and exact lot size.

2. **The "Find Trade" 1-Click Action:**
   - Beside every FnO instrument, click **`[ 🎯 Find Trade ]`** to immediately open that asset's live TradingView chart terminal.

3. **Live TradingView Advanced Terminal:**
   - Live candlestick charts with timeframe switching (1m, 3m, 5m, 15m, 1D).
   - Pre-loaded with EMA 20, EMA 50, RSI, and VWAP.

4. **Deep Candlestick & Trend Auto-Scanner:**
   - Scans candle rejection wicks, trend baselines, and volume structure.
   - Evaluates momentum and Option Chain PCR (Put-Call Ratio).

5. **Option Chain Call / Put Recommendation Card:**
   - Automatically selects ATM or ITM Strike (e.g. `NIFTY 25450 CE` or `BANKNIFTY 52900 PE`).
   - Precision **Entry Price Range** (e.g. ₹135 - ₹140).
   - Strict **Stop-Loss (SL)** point (e.g. ₹110).
   - **Target 1 & Target 2** points with 1:2.8+ Risk-to-Reward ratio.
   - Minimum Capital required for 1 Lot calculation.

---

## 🚀 How to Run Locally

1. Open PowerShell or Command Prompt in this folder:
   ```bash
   cd "C:\Users\bnbn3\.gemini\antigravity\scratch\indian_fno_sniper"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm start
   ```
4. Open your browser and go to:
   ```
   http://localhost:3000
   ```

---

## 📤 How to Upload to Your Private GitHub Repository

To keep this secret between you and your private GitHub account:

1. Go to [GitHub.com](https://github.com/new) and click **New Repository**.
2. Name it (e.g., `my-secret-fno-sniper`) and make sure you select **Private** 🔒.
3. In PowerShell inside this directory:
   ```powershell
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
   git branch -M main
   git push -u origin main
   ```
4. Your code is now securely backed up to your private GitHub repository!
