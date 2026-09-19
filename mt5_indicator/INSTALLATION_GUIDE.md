# Fast Scalper Pro — MT4 & MT5 Installation & Trading Guide

Welcome to your personal **Fast Scalper Pro** trading indicator. This system is designed specifically for high-accuracy intraday scalping (1-Minute, 3-Minute, and 5-Minute charts) on stocks, equities, and indices.

---

## 📁 Included Files

| File | Description | Target Platform |
| :--- | :--- | :--- |
| `FastScalperPro.mq5` | Source code for MetaTrader 5 | MetaTrader 5 (MT5) |
| `FastScalperPro.mq4` | Source code for MetaTrader 4 | MetaTrader 4 (MT4) |
| `chart_preview.html` | Interactive browser visualizer with live candlestick simulation | Any Web Browser (Chrome, Edge, etc.) |
| `INSTALLATION_GUIDE.md` | Complete setup & trading strategy rules | Documentation |

---

## 🚀 How to Install in MetaTrader 5 (MT5)

1. **Open MetaTrader 5 Terminal** on your computer.
2. Click **File** in the top menu bar, then click **Open Data Folder**.
3. In the Windows Explorer window that opens, navigate to:
   ```
   MQL5 > Indicators
   ```
4. Copy the file **`FastScalperPro.mq5`** and paste it directly inside the `Indicators` folder.
5. Go back to MetaTrader 5:
   - Press **F4** on your keyboard (or click **Tools -> MetaQuotes Language Editor**).
   - In the MetaEditor sidebar (Navigator), expand `Indicators` and double-click `FastScalperPro.mq5`.
   - Press **F7** (or click the **Compile** button at the top).
   - You should see `0 errors, 0 warnings` in the bottom log window.
6. Return to your MT5 Chart:
   - In the left **Navigator** window (`Ctrl + N`), expand **Indicators**.
   - Right-click and select **Refresh** (or restart MT5).
   - Drag and drop **`FastScalperPro`** onto your stock chart (1m, 3m, or 5m timeframe).
   - In the settings pop-up, check **Allow DLL imports** (if prompted) and click **OK**.

---

## 🚀 How to Install in MetaTrader 4 (MT4)

1. Open **MetaTrader 4**.
2. Click **File** -> **Open Data Folder**.
3. Navigate to:
   ```
   MQL4 > Indicators
   ```
4. Copy and paste **`FastScalperPro.mq4`** into this folder.
5. Press **F4** to open MetaEditor, open `FastScalperPro.mq4`, and press **F7** to compile (`0 errors`).
6. In MT4 Navigator window, right-click **Indicators**, click **Refresh**, then drag **FastScalperPro** onto your chart.

---

## 🖥️ How to Preview the Chart Right Now

You don't even need MetaTrader open to see how the indicator works!
Double-click:
```
C:\Users\bnbn3\.gemini\antigravity\scratch\scalper_indicator\chart_preview.html
```
- Opens in Chrome/Edge/Firefox.
- Shows live candle action, EMA ribbons, Buy/Sell arrows, TP/SL target levels, and the live HUD dashboard.
- Click **"Simulate Live Ticks"** to watch the indicator react to live price changes in real time.

---

## 📈 Scalping Strategy Rulebook (How to Make Money Consistently)

### 🟢 1. The Buy (Long) Scalp Rule
* **Step 1 (Trend Filter):** Price must be trading ABOVE the 50 EMA baseline, and 9 EMA (Cyan) must be ABOVE 21 EMA (Orange).
* **Step 2 (Momentum):** RSI is between 45 and 70 (healthy momentum, not overbought).
* **Step 3 (Trigger):** A Green **BUY Arrow ⬆** prints under a completed candle (look for a candle with a lower rejection wick).
* **Step 4 (Trade Execution):**
  - **Entry:** Open Long at the start of the next candle.
  - **Stop Loss (SL):** Place at the auto-calculated SL level (1.5x ATR below swing low).
  - **Take Profit 1 (TP1):** Exit 50% - 60% of your position at TP1 (2.0x ATR).
  - **Take Profit 2 (TP2):** Once TP1 is hit, move Stop Loss to Breakeven (Entry price) and let the remaining 40% run to TP2 (3.5x ATR).

---

### 🔴 2. The Sell (Short) Scalp Rule
* **Step 1 (Trend Filter):** Price must be trading BELOW the 50 EMA baseline, and 9 EMA (Cyan) must be BELOW 21 EMA (Orange).
* **Step 2 (Momentum):** RSI is between 30 and 55 (bearish pressure, not oversold).
* **Step 3 (Trigger):** A Red **SELL Arrow ⬇** prints above a completed candle (look for an upper rejection wick).
* **Step 4 (Trade Execution):**
  - **Entry:** Open Short at the start of the next candle.
  - **Stop Loss (SL):** Place at the auto-calculated SL level (1.5x ATR above swing high).
  - **Take Profit 1 (TP1):** Close 50% - 60% at TP1 (2.0x ATR).
  - **Take Profit 2 (TP2):** Move SL to Breakeven and aim for TP2 (3.5x ATR).

---

## 🛡️ Risk Management (Capital Protection)

1. **Risk per Trade:** Never risk more than **1% to 2%** of your total trading capital on any single scalp trade.
2. **Avoid Choppy / Flat Markets:** If the 9 EMA and 21 EMA are intertwined like a braid and flat horizontally, the market is in consolidation — wait for a clear expansion before entering.
3. **High Impact News:** Do not enter trades 5 minutes before or after major news events (Earnings announcements, Interest rate decisions, CPI releases).
4. **Discipline:** Never move your Stop Loss further away once set. The 1.5x ATR stop is statistically calculated to keep you safe from sudden market reversals.

---

## 🔔 Mobile Phone Alerts (Push Notifications)

To get scalp signal alerts on your phone whenever an arrow appears:
1. Download the **MetaTrader 4** or **MetaTrader 5** app on your iPhone or Android.
2. In the mobile app: Go to **Settings -> Chat and Messages** and copy your **MetaQuotes ID** (e.g. `12AB34CD`).
3. In Desktop MetaTrader: Click **Tools -> Options -> Notifications tab**:
   - Check **Enable Push notifications**.
   - Paste your **MetaQuotes ID** and click **Test**.
4. In the indicator settings on your chart, set `InpAlertPush = true`.
5. Now, whenever a Buy/Sell scalp signal triggers, your phone will chime instantly!
