//+------------------------------------------------------------------+
//|                                              FastScalperPro.mq5  |
//|                        High Precision Scalping Indicator for MT5 |
//|                     Live Market Execution & Non-Repaint Engine   |
//|                                  Copyright 2026, Personal Use    |
//+------------------------------------------------------------------+
#property copyright   "Personal Use Only"
#property link        ""
#property version     "1.50"
#property description "Fast Scalper Pro - Live Market Scalper with Alerts & 1-Click Chart Execution"
#property indicator_chart_window
#property indicator_buffers 6
#property indicator_plots   4

#include <Trade\Trade.mqh>

//--- Plot 1: Fast EMA Ribbon
#property indicator_label1  "Fast EMA"
#property indicator_type1   DRAW_LINE
#property indicator_color1  clrAqua
#property indicator_style1  STYLE_SOLID
#property indicator_width1  2

//--- Plot 2: Slow EMA Ribbon
#property indicator_label2  "Slow EMA"
#property indicator_type2   DRAW_LINE
#property indicator_color2  clrDarkOrange
#property indicator_style2  STYLE_SOLID
#property indicator_width2  2

//--- Plot 3: Buy Signal Arrow
#property indicator_label3  "Scalp BUY"
#property indicator_type3   DRAW_ARROW
#property indicator_color3  clrLime
#property indicator_width3  3

//--- Plot 4: Sell Signal Arrow
#property indicator_label4  "Scalp SELL"
#property indicator_type4   DRAW_ARROW
#property indicator_color4  clrRed
#property indicator_width4  3

//+------------------------------------------------------------------+
//| INPUT PARAMETERS                                                 |
//+------------------------------------------------------------------+
input group "=== Trend & Moving Average Settings ==="
input int                InpFastEMAPeriod   = 9;          // Fast EMA Period
input int                InpSlowEMAPeriod   = 21;         // Slow EMA Period
input int                InpTrendEMAPeriod  = 50;         // Major Baseline Trend EMA
input ENUM_APPLIED_PRICE InpAppliedPrice    = PRICE_CLOSE;// Applied Price

input group "=== Momentum & Volatility Filter ==="
input int                InpRSIPeriod       = 14;         // RSI Period
input double             InpRSIOverbought   = 70.0;       // RSI Overbought Level
input double             InpRSIOversold     = 30.0;       // RSI Oversold Level
input int                InpATRPeriod       = 14;         // ATR Period for TP/SL

input group "=== Risk Management (TP & SL Multipliers) ==="
input double             InpSL_ATR_Mult     = 1.5;        // Stop Loss (x ATR)
input double             InpTP1_ATR_Mult    = 2.0;        // Take Profit 1 (x ATR)
input double             InpTP2_ATR_Mult    = 3.5;        // Take Profit 2 (x ATR)

input group "=== Live 1-Click Trade Execution Buttons ==="
input bool               InpEnableTradeBtns = true;       // Show 1-Click BUY/SELL Buttons on Chart
input double             InpFixedLotSize    = 0.10;       // Lot Size for 1-Click Execution
input ulong              InpMagicNumber     = 882026;     // Magic Number for Orders
input ulong              InpSlippagePoints  = 10;         // Max Slippage (Points)

input group "=== Signal & Execution Logic ==="
input bool               InpSignalOnBarClose= true;       // Trigger on Bar Close (Guarantees Zero Repaint)
input bool               InpFilterWithTrend = true;       // Trade strictly in Baseline Trend direction
input bool               InpRequireCandlePA = true;       // Require Candlestick Rejection / Engulfing

input group "=== Alerts & Notifications ==="
input bool               InpAlertPopup      = true;       // Screen Pop-up Alert
input bool               InpAlertSound      = true;       // Sound Alert
input string             InpSoundFile       = "alert.wav";// Sound File
input bool               InpAlertPush       = true;       // Push Notification to Mobile MT5 App

input group "=== On-Chart HUD Dashboard ==="
input bool               InpShowDashboard   = true;       // Show On-Chart HUD Dashboard
input color              InpDashBgColor     = clrBlack;   // Dashboard Background Color
input color              InpDashTextColor   = clrWhite;   // Dashboard Text Color
input int                InpDashXOffset     = 20;         // Dashboard X Offset
input int                InpDashYOffset     = 30;         // Dashboard Y Offset

//+------------------------------------------------------------------+
//| BUFFERS & OBJECTS                                                |
//+------------------------------------------------------------------+
double FastEMABuffer[];
double SlowEMABuffer[];
double BuySignalBuffer[];
double SellSignalBuffer[];
double TrendBaselineBuffer[];
double ATRValuesBuffer[];

// Indicator Handles
int handleFastEMA  = INVALID_HANDLE;
int handleSlowEMA  = INVALID_HANDLE;
int handleTrendEMA = INVALID_HANDLE;
int handleRSI      = INVALID_HANDLE;
int handleATR      = INVALID_HANDLE;

// Trade Engine
CTrade trade;

// State Tracking
datetime lastAlertTime   = 0;
string   dashboardPrefix = "FSP_HUD_";
string   btnBuyName      = "FSP_BTN_BUY";
string   btnSellName     = "FSP_BTN_SELL";

double   lastComputedSL  = 0.0;
double   lastComputedTP1 = 0.0;

//+------------------------------------------------------------------+
//| Custom indicator initialization function                         |
//+------------------------------------------------------------------+
int OnInit()
{
   SetIndexBuffer(0, FastEMABuffer, INDICATOR_DATA);
   SetIndexBuffer(1, SlowEMABuffer, INDICATOR_DATA);
   SetIndexBuffer(2, BuySignalBuffer, INDICATOR_DATA);
   SetIndexBuffer(3, SellSignalBuffer, INDICATOR_DATA);
   SetIndexBuffer(4, TrendBaselineBuffer, INDICATOR_CALCULATIONS);
   SetIndexBuffer(5, ATRValuesBuffer, INDICATOR_CALCULATIONS);

   PlotIndexSetInteger(2, PLOT_ARROW, 233);
   PlotIndexSetInteger(3, PLOT_ARROW, 234);

   PlotIndexSetDouble(0, PLOT_EMPTY_VALUE, 0.0);
   PlotIndexSetDouble(1, PLOT_EMPTY_VALUE, 0.0);
   PlotIndexSetDouble(2, PLOT_EMPTY_VALUE, 0.0);
   PlotIndexSetDouble(3, PLOT_EMPTY_VALUE, 0.0);

   IndicatorSetString(INDICATOR_SHORTNAME, "Fast Scalper Pro [MT5 Live]");
   IndicatorSetInteger(INDICATOR_DIGITS, _Digits);

   // Configure trade execution object
   trade.SetExpertMagicNumber(InpMagicNumber);
   trade.SetDeviationInPoints(InpSlippagePoints);

   // Indicator Handles
   handleFastEMA  = iMA(_Symbol, _Period, InpFastEMAPeriod, 0, MODE_EMA, InpAppliedPrice);
   handleSlowEMA  = iMA(_Symbol, _Period, InpSlowEMAPeriod, 0, MODE_EMA, InpAppliedPrice);
   handleTrendEMA = iMA(_Symbol, _Period, InpTrendEMAPeriod, 0, MODE_EMA, InpAppliedPrice);
   handleRSI      = iRSI(_Symbol, _Period, InpRSIPeriod, InpAppliedPrice);
   handleATR      = iATR(_Symbol, _Period, InpATRPeriod);

   if(handleFastEMA == INVALID_HANDLE || handleSlowEMA == INVALID_HANDLE ||
      handleTrendEMA == INVALID_HANDLE || handleRSI == INVALID_HANDLE || handleATR == INVALID_HANDLE)
   {
      Print("FastScalperPro: Error creating indicator handles!");
      return(INIT_FAILED);
   }

   // Create 1-Click Execution Buttons if enabled
   if(InpEnableTradeBtns)
   {
      CreateTradeButtons();
   }

   return(INIT_SUCCEEDED);
}

//+------------------------------------------------------------------+
//| Custom indicator deinitialization function                       |
//+------------------------------------------------------------------+
void OnDeinit(const int reason)
{
   IndicatorRelease(handleFastEMA);
   IndicatorRelease(handleSlowEMA);
   IndicatorRelease(handleTrendEMA);
   IndicatorRelease(handleRSI);
   IndicatorRelease(handleATR);

   ObjectsDeleteAll(0, dashboardPrefix);
   ObjectDelete(0, btnBuyName);
   ObjectDelete(0, btnSellName);
   ChartRedraw(0);
}

//+------------------------------------------------------------------+
//| Candlestick Patterns                                             |
//+------------------------------------------------------------------+
bool IsBullishRejection(double open, double high, double low, double close)
{
   double range = high - low;
   if(range <= 0.0) return false;
   double lowerWick = MathMin(open, close) - low;
   double upperWick = high - MathMax(open, close);
   return (lowerWick >= 0.45 * range && upperWick <= 0.25 * range);
}

bool IsBearishRejection(double open, double high, double low, double close)
{
   double range = high - low;
   if(range <= 0.0) return false;
   double lowerWick = MathMin(open, close) - low;
   double upperWick = high - MathMax(open, close);
   return (upperWick >= 0.45 * range && lowerWick <= 0.25 * range);
}

bool IsBullishEngulfing(double prevOpen, double prevClose, double currOpen, double currClose)
{
   return (prevClose < prevOpen && currClose > currOpen && currClose >= prevOpen && currOpen <= prevClose);
}

bool IsBearishEngulfing(double prevOpen, double prevClose, double currOpen, double currClose)
{
   return (prevClose > prevOpen && currClose < currOpen && currClose <= prevOpen && currOpen >= prevClose);
}

//+------------------------------------------------------------------+
//| Custom indicator iteration function                              |
//+------------------------------------------------------------------+
int OnCalculate(const int rates_total,
                const int prev_calculated,
                const datetime &time[],
                const double &open[],
                const double &high[],
                const double &low[],
                const double &close[],
                const long &tick_volume[],
                const long &volume[],
                const int &spread[])
{
   int minRequired = MathMax(InpTrendEMAPeriod, MathMax(InpRSIPeriod, InpATRPeriod)) + 10;
   if(rates_total < minRequired) return(0);

   int limit;
   if(prev_calculated == 0)
   {
      limit = minRequired;
      ArrayInitialize(FastEMABuffer, 0.0);
      ArrayInitialize(SlowEMABuffer, 0.0);
      ArrayInitialize(BuySignalBuffer, 0.0);
      ArrayInitialize(SellSignalBuffer, 0.0);
   }
   else
   {
      limit = prev_calculated - 1;
   }

   double fEma[], sEma[], tEma[], rsiVal[], atrVal[];
   ArraySetAsSeries(fEma, false);
   ArraySetAsSeries(sEma, false);
   ArraySetAsSeries(tEma, false);
   ArraySetAsSeries(rsiVal, false);
   ArraySetAsSeries(atrVal, false);

   int toCopy = rates_total - limit + 1;
   if(CopyBuffer(handleFastEMA, 0, limit, toCopy, fEma) <= 0) return(0);
   if(CopyBuffer(handleSlowEMA, 0, limit, toCopy, sEma) <= 0) return(0);
   if(CopyBuffer(handleTrendEMA, 0, limit, toCopy, tEma) <= 0) return(0);
   if(CopyBuffer(handleRSI, 0, limit, toCopy, rsiVal) <= 0) return(0);
   if(CopyBuffer(handleATR, 0, limit, toCopy, atrVal) <= 0) return(0);

   int startBar = InpSignalOnBarClose ? 1 : 0;
   int endIdx = rates_total - 1;

   for(int i = limit; i <= endIdx; i++)
   {
      int bufIdx = i - limit;
      if(bufIdx < 0 || bufIdx >= ArraySize(fEma)) continue;

      FastEMABuffer[i] = fEma[bufIdx];
      SlowEMABuffer[i] = sEma[bufIdx];
      TrendBaselineBuffer[i] = tEma[bufIdx];
      ATRValuesBuffer[i] = atrVal[bufIdx];

      BuySignalBuffer[i] = 0.0;
      SellSignalBuffer[i] = 0.0;

      if(i < minRequired + 2 || i >= rates_total - startBar)
         continue;

      double currentFast = FastEMABuffer[i];
      double currentSlow = SlowEMABuffer[i];
      double prevFast    = FastEMABuffer[i - 1];
      double prevSlow    = SlowEMABuffer[i - 1];
      double currentTrend= TrendBaselineBuffer[i];
      double currentRSI  = rsiVal[bufIdx];
      double currentATR  = ATRValuesBuffer[i];

      bool bullPA = IsBullishRejection(open[i], high[i], low[i], close[i]) ||
                    IsBullishEngulfing(open[i-1], close[i-1], open[i], close[i]);
      bool bearPA = IsBearishRejection(open[i], high[i], low[i], close[i]) ||
                    IsBearishEngulfing(open[i-1], close[i-1], open[i], close[i]);

      bool emaCrossUp      = (prevFast <= prevSlow && currentFast > currentSlow);
      bool emaTrendingUp   = (currentFast > currentSlow);
      bool trendFilterBull = (!InpFilterWithTrend) || (close[i] > currentTrend);
      bool rsiBullFilter   = (currentRSI >= 45.0 && currentRSI <= InpRSIOverbought);

      bool buyCondition = false;
      if(InpRequireCandlePA)
         buyCondition = emaTrendingUp && trendFilterBull && rsiBullFilter && (bullPA || emaCrossUp);
      else
         buyCondition = emaCrossUp && trendFilterBull && rsiBullFilter;

      bool emaCrossDown    = (prevFast >= prevSlow && currentFast < currentSlow);
      bool emaTrendingDown = (currentFast < currentSlow);
      bool trendFilterBear = (!InpFilterWithTrend) || (close[i] < currentTrend);
      bool rsiBearFilter   = (currentRSI <= 55.0 && currentRSI >= InpRSIOversold);

      bool sellCondition = false;
      if(InpRequireCandlePA)
         sellCondition = emaTrendingDown && trendFilterBear && rsiBearFilter && (bearPA || emaCrossDown);
      else
         sellCondition = emaCrossDown && trendFilterBear && rsiBearFilter;

      if(buyCondition && BuySignalBuffer[i - 1] == 0.0 && BuySignalBuffer[i - 2] == 0.0)
      {
         BuySignalBuffer[i] = low[i] - (currentATR * 0.4);
         lastComputedSL  = low[i] - (currentATR * InpSL_ATR_Mult);
         lastComputedTP1 = close[i] + (currentATR * InpTP1_ATR_Mult);
         double tp2 = close[i] + (currentATR * InpTP2_ATR_Mult);

         if(i == rates_total - 1 - startBar && time[i] != lastAlertTime)
         {
            lastAlertTime = time[i];
            ExecuteAlert("BUY", close[i], lastComputedSL, lastComputedTP1, tp2);
         }
      }
      else if(sellCondition && SellSignalBuffer[i - 1] == 0.0 && SellSignalBuffer[i - 2] == 0.0)
      {
         SellSignalBuffer[i] = high[i] + (currentATR * 0.4);
         lastComputedSL  = high[i] + (currentATR * InpSL_ATR_Mult);
         lastComputedTP1 = close[i] - (currentATR * InpTP1_ATR_Mult);
         double tp2 = close[i] - (currentATR * InpTP2_ATR_Mult);

         if(i == rates_total - 1 - startBar && time[i] != lastAlertTime)
         {
            lastAlertTime = time[i];
            ExecuteAlert("SELL", close[i], lastComputedSL, lastComputedTP1, tp2);
         }
      }
   }

   // Update HUD Dashboard
   if(InpShowDashboard)
   {
      int lastIdx = rates_total - 1;
      double lastClose = close[lastIdx];
      double curFast = FastEMABuffer[lastIdx];
      double curSlow = SlowEMABuffer[lastIdx];
      double curTrend= TrendBaselineBuffer[lastIdx];
      double curATR  = ATRValuesBuffer[lastIdx];

      double lastRSI = 50.0;
      if(ArraySize(rsiVal) > 0) lastRSI = rsiVal[ArraySize(rsiVal) - 1];

      UpdateDashboard(lastClose, curFast, curSlow, curTrend, lastRSI, curATR);
   }

   return(rates_total);
}

//+------------------------------------------------------------------+
//| OnChartEvent: Handle 1-Click Execution Button Clicks             |
//+------------------------------------------------------------------+
void OnChartEvent(const int id,
                  const long &lparam,
                  const double &dparam,
                  const string &sparam)
{
   if(id == CHARTEVENT_OBJECT_CLICK)
   {
      if(sparam == btnBuyName)
      {
         ObjectSetInteger(0, btnBuyName, OBJPROP_STATE, false);
         Execute1ClickTrade(ORDER_TYPE_BUY);
      }
      else if(sparam == btnSellName)
      {
         ObjectSetInteger(0, btnSellName, OBJPROP_STATE, false);
         Execute1ClickTrade(ORDER_TYPE_SELL);
      }
   }
}

//+------------------------------------------------------------------+
//| Execute 1-Click Trade with Pre-calculated SL and TP              |
//+------------------------------------------------------------------+
void Execute1ClickTrade(ENUM_ORDER_TYPE orderType)
{
   double ask = SymbolInfoDouble(_Symbol, SYMBOL_ASK);
   double bid = SymbolInfoDouble(_Symbol, SYMBOL_BID);
   double curATR = 0.0;

   // Get live ATR if available
   double tempATR[];
   ArraySetAsSeries(tempATR, true);
   if(CopyBuffer(handleATR, 0, 0, 1, tempATR) > 0)
      curATR = tempATR[0];
   else
      curATR = 10 * _Point;

   double sl = 0.0;
   double tp = 0.0;

   if(orderType == ORDER_TYPE_BUY)
   {
      sl = NormalizeDouble(bid - (curATR * InpSL_ATR_Mult), _Digits);
      tp = NormalizeDouble(ask + (curATR * InpTP1_ATR_Mult), _Digits);

      if(trade.Buy(InpFixedLotSize, _Symbol, ask, sl, tp, "FastScalper 1-Click BUY"))
      {
         Print("FastScalperPro: [SUCCESS] BUY order opened @ ", ask, " | SL: ", sl, " | TP: ", tp);
         Alert(StringFormat("[1-CLICK TRADE PLACED] BUY %s @ %s | SL: %s | TP: %s", _Symbol, DoubleToString(ask, _Digits), DoubleToString(sl, _Digits), DoubleToString(tp, _Digits)));
      }
      else
      {
         Print("FastScalperPro: [ERROR] BUY order failed! Retcode: ", trade.ResultRetcode(), " Description: ", trade.ResultRetcodeDescription());
      }
   }
   else if(orderType == ORDER_TYPE_SELL)
   {
      sl = NormalizeDouble(ask + (curATR * InpSL_ATR_Mult), _Digits);
      tp = NormalizeDouble(bid - (curATR * InpTP1_ATR_Mult), _Digits);

      if(trade.Sell(InpFixedLotSize, _Symbol, bid, sl, tp, "FastScalper 1-Click SELL"))
      {
         Print("FastScalperPro: [SUCCESS] SELL order opened @ ", bid, " | SL: ", sl, " | TP: ", tp);
         Alert(StringFormat("[1-CLICK TRADE PLACED] SELL %s @ %s | SL: %s | TP: %s", _Symbol, DoubleToString(bid, _Digits), DoubleToString(sl, _Digits), DoubleToString(tp, _Digits)));
      }
      else
      {
         Print("FastScalperPro: [ERROR] SELL order failed! Retcode: ", trade.ResultRetcode(), " Description: ", trade.ResultRetcodeDescription());
      }
   }
}

//+------------------------------------------------------------------+
//| Create 1-Click BUY / SELL Buttons on Chart                       |
//+------------------------------------------------------------------+
void CreateTradeButtons()
{
   int btnWidth = 120;
   int btnHeight = 32;
   int btnY = InpDashYOffset + 125;

   // BUY Button
   ObjectCreate(0, btnBuyName, OBJ_BUTTON, 0, 0, 0);
   ObjectSetInteger(0, btnBuyName, OBJPROP_CORNER, CORNER_LEFT_UPPER);
   ObjectSetInteger(0, btnBuyName, OBJPROP_XDISTANCE, InpDashXOffset);
   ObjectSetInteger(0, btnBuyName, OBJPROP_YDISTANCE, btnY);
   ObjectSetInteger(0, btnBuyName, OBJPROP_XSIZE, btnWidth);
   ObjectSetInteger(0, btnBuyName, OBJPROP_YSIZE, btnHeight);
   ObjectSetString(0, btnBuyName, OBJPROP_TEXT, "⚡ BUY NOW");
   ObjectSetString(0, btnBuyName, OBJPROP_FONT, "Arial Bold");
   ObjectSetInteger(0, btnBuyName, OBJPROP_FONTSIZE, 10);
   ObjectSetInteger(0, btnBuyName, OBJPROP_COLOR, clrBlack);
   ObjectSetInteger(0, btnBuyName, OBJPROP_BGCOLOR, clrLime);
   ObjectSetInteger(0, btnBuyName, OBJPROP_SELECTABLE, false);

   // SELL Button
   ObjectCreate(0, btnSellName, OBJ_BUTTON, 0, 0, 0);
   ObjectSetInteger(0, btnSellName, OBJPROP_CORNER, CORNER_LEFT_UPPER);
   ObjectSetInteger(0, btnSellName, OBJPROP_XDISTANCE, InpDashXOffset + btnWidth + 10);
   ObjectSetInteger(0, btnSellName, OBJPROP_YDISTANCE, btnY);
   ObjectSetInteger(0, btnSellName, OBJPROP_XSIZE, btnWidth);
   ObjectSetInteger(0, btnSellName, OBJPROP_YSIZE, btnHeight);
   ObjectSetString(0, btnSellName, OBJPROP_TEXT, "⚡ SELL NOW");
   ObjectSetString(0, btnSellName, OBJPROP_FONT, "Arial Bold");
   ObjectSetInteger(0, btnSellName, OBJPROP_FONTSIZE, 10);
   ObjectSetInteger(0, btnSellName, OBJPROP_COLOR, clrWhite);
   ObjectSetInteger(0, btnSellName, OBJPROP_BGCOLOR, clrCrimson);
   ObjectSetInteger(0, btnSellName, OBJPROP_SELECTABLE, false);
}

//+------------------------------------------------------------------+
//| Dispatch Alert to Screen, Audio, and Mobile                      |
//+------------------------------------------------------------------+
void ExecuteAlert(string type, double price, double sl, double tp1, double tp2)
{
   string msg = StringFormat("[Fast Scalper Pro] %s Signal on %s (%s) @ %s | SL: %s | TP1: %s | TP2: %s",
                             type, _Symbol, EnumToString(_Period),
                             DoubleToString(price, _Digits),
                             DoubleToString(sl, _Digits),
                             DoubleToString(tp1, _Digits),
                             DoubleToString(tp2, _Digits));

   if(InpAlertPopup) Alert(msg);
   if(InpAlertSound) PlaySound(InpSoundFile);
   if(InpAlertPush)  SendNotification(msg);
}

//+------------------------------------------------------------------+
//| Render / Refresh On-Chart HUD Dashboard                          |
//+------------------------------------------------------------------+
void UpdateDashboard(double price, double fEma, double sEma, double tEma, double rsi, double atr)
{
   string trendStr = "NEUTRAL";
   color trendColor = clrYellow;

   if(fEma > sEma && price > tEma)
   {
      trendStr = "STRONG BULLISH [UP]";
      trendColor = clrLime;
   }
   else if(fEma < sEma && price < tEma)
   {
      trendStr = "STRONG BEARISH [DOWN]";
      trendColor = clrCrimson;
   }
   else if(fEma > sEma)
   {
      trendStr = "WEAK BULLISH (PULLBACK)";
      trendColor = clrDeepSkyBlue;
   }
   else if(fEma < sEma)
   {
      trendStr = "WEAK BEARISH (REBOUND)";
      trendColor = clrOrangeRed;
   }

   CreateOrUpdateLabel(dashboardPrefix + "TITLE", "=== FAST SCALPER PRO HUD ===", InpDashXOffset, InpDashYOffset, clrAqua, 10, true);
   CreateOrUpdateLabel(dashboardPrefix + "SYM",   "Symbol: " + _Symbol + " (" + EnumToString(_Period) + ")", InpDashXOffset, InpDashYOffset + 18, InpDashTextColor, 9, false);
   CreateOrUpdateLabel(dashboardPrefix + "PRICE", "Live Price: " + DoubleToString(price, _Digits), InpDashXOffset, InpDashYOffset + 34, InpDashTextColor, 9, false);
   CreateOrUpdateLabel(dashboardPrefix + "TREND", "Trend Bias: " + trendStr, InpDashXOffset, InpDashYOffset + 50, trendColor, 9, true);
   CreateOrUpdateLabel(dashboardPrefix + "RSI",   "Momentum RSI: " + DoubleToString(rsi, 1), InpDashXOffset, InpDashYOffset + 66, InpDashTextColor, 9, false);
   CreateOrUpdateLabel(dashboardPrefix + "ATR",   "Volatility (ATR): " + DoubleToString(atr, _Digits), InpDashXOffset, InpDashYOffset + 82, InpDashTextColor, 9, false);
   CreateOrUpdateLabel(dashboardPrefix + "RULE",  "Live Market: Click BUY/SELL button on signal", InpDashXOffset, InpDashYOffset + 100, clrGold, 8, false);
}

//+------------------------------------------------------------------+
//| Helper: Create or Update Text Label                              |
//+------------------------------------------------------------------+
void CreateOrUpdateLabel(string name, string text, int x, int y, color clr, int fontSize, bool isBold)
{
   if(ObjectFind(0, name) < 0)
   {
      ObjectCreate(0, name, OBJ_LABEL, 0, 0, 0);
      ObjectSetInteger(0, name, OBJPROP_CORNER, CORNER_LEFT_UPPER);
      ObjectSetInteger(0, name, OBJPROP_XDISTANCE, x);
      ObjectSetInteger(0, name, OBJPROP_YDISTANCE, y);
      ObjectSetInteger(0, name, OBJPROP_SELECTABLE, false);
      ObjectSetInteger(0, name, OBJPROP_BACK, false);
   }

   ObjectSetString(0, name, OBJPROP_TEXT, text);
   ObjectSetString(0, name, OBJPROP_FONT, isBold ? "Arial Bold" : "Arial");
   ObjectSetInteger(0, name, OBJPROP_FONTSIZE, fontSize);
   ObjectSetInteger(0, name, OBJPROP_COLOR, clr);
}
//+------------------------------------------------------------------+
