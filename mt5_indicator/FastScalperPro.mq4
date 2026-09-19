//+------------------------------------------------------------------+
//|                                              FastScalperPro.mq4  |
//|                        High Precision Scalping Indicator for MT4 |
//|                     Live Market Execution & Non-Repaint Engine   |
//|                                  Copyright 2026, Personal Use    |
//+------------------------------------------------------------------+
#property copyright   "Personal Use Only"
#property link        ""
#property version     "1.50"
#property description "Fast Scalper Pro - Live Market Scalper with Alerts & 1-Click Chart Execution"
#property indicator_chart_window
#property indicator_buffers 4
#property indicator_color1  clrAqua
#property indicator_color2  clrDarkOrange
#property indicator_color3  clrLime
#property indicator_color4  clrRed

#property indicator_width1  2
#property indicator_width2  2
#property indicator_width3  3
#property indicator_width4  3

//+------------------------------------------------------------------+
//| INPUT PARAMETERS                                                 |
//+------------------------------------------------------------------+
extern string  Separator1          = "=== Trend & Moving Average Settings ===";
extern int     InpFastEMAPeriod    = 9;          // Fast EMA Period
extern int     InpSlowEMAPeriod    = 21;         // Slow EMA Period
extern int     InpTrendEMAPeriod   = 50;         // Major Baseline Trend EMA
extern int     InpAppliedPrice     = PRICE_CLOSE;// Applied Price

extern string  Separator2          = "=== Momentum & Volatility Filter ===";
extern int     InpRSIPeriod        = 14;         // RSI Period
extern double  InpRSIOverbought    = 70.0;       // RSI Overbought Level
extern double  InpRSIOversold      = 30.0;       // RSI Oversold Level
extern int     InpATRPeriod        = 14;         // ATR Period for TP/SL

extern string  Separator3          = "=== Risk Management (TP & SL Multipliers) ===";
extern double  InpSL_ATR_Mult      = 1.5;        // Stop Loss (x ATR)
extern double  InpTP1_ATR_Mult     = 2.0;        // Take Profit 1 (x ATR)
extern double  InpTP2_ATR_Mult     = 3.5;        // Take Profit 2 (x ATR)

extern string  Separator4          = "=== Live 1-Click Trade Execution Buttons ===";
extern bool    InpEnableTradeBtns  = true;       // Show 1-Click BUY/SELL Buttons on Chart
extern double  InpFixedLotSize     = 0.10;       // Lot Size for 1-Click Execution
extern int     InpMagicNumber      = 882026;     // Magic Number for Orders
extern int     InpSlippagePoints   = 10;         // Max Slippage (Points)

extern string  Separator5          = "=== Signal & Execution Logic ===";
extern bool    InpSignalOnBarClose = true;        // Trigger on Bar Close (Guarantees Zero Repaint)
extern bool    InpFilterWithTrend  = true;        // Trade strictly in Baseline Trend direction
extern bool    InpRequireCandlePA  = true;        // Require Candlestick Rejection / Engulfing

extern string  Separator6          = "=== Alerts & Notifications ===";
extern bool    InpAlertPopup       = true;        // Screen Pop-up Alert
extern bool    InpAlertSound       = true;        // Sound Alert
extern string  InpSoundFile        = "alert.wav"; // Sound File
extern bool    InpAlertPush        = true;        // Push Notification to Mobile MT4 App

extern string  Separator7          = "=== On-Chart HUD Dashboard ===";
extern bool    InpShowDashboard    = true;        // Show On-Chart HUD Dashboard
extern color   InpDashBgColor      = clrBlack;    // Dashboard Background Color
extern color   InpDashTextColor    = clrWhite;    // Dashboard Text Color
extern int     InpDashXOffset      = 20;          // Dashboard X Offset
extern int     InpDashYOffset      = 30;          // Dashboard Y Offset

//+------------------------------------------------------------------+
//| BUFFERS & TRACKING                                               |
//+------------------------------------------------------------------+
double FastEMABuffer[];
double SlowEMABuffer[];
double BuySignalBuffer[];
double SellSignalBuffer[];

datetime lastAlertTime   = 0;
string   dashboardPrefix = "FSP4_HUD_";
string   btnBuyName      = "FSP4_BTN_BUY";
string   btnSellName     = "FSP4_BTN_SELL";

//+------------------------------------------------------------------+
//| Custom indicator initialization function                         |
//+------------------------------------------------------------------+
int OnInit()
{
   IndicatorBuffers(4);

   SetIndexBuffer(0, FastEMABuffer);
   SetIndexStyle(0, DRAW_LINE, STYLE_SOLID, 2, clrAqua);
   SetIndexLabel(0, "Fast EMA");

   SetIndexBuffer(1, SlowEMABuffer);
   SetIndexStyle(1, DRAW_LINE, STYLE_SOLID, 2, clrDarkOrange);
   SetIndexLabel(1, "Slow EMA");

   SetIndexBuffer(2, BuySignalBuffer);
   SetIndexStyle(2, DRAW_ARROW, STYLE_SOLID, 3, clrLime);
   SetIndexArrow(2, 233);
   SetIndexLabel(2, "Scalp BUY");

   SetIndexBuffer(3, SellSignalBuffer);
   SetIndexStyle(3, DRAW_ARROW, STYLE_SOLID, 3, clrRed);
   SetIndexArrow(3, 234);
   SetIndexLabel(3, "Scalp SELL");

   IndicatorShortName("Fast Scalper Pro [MT4 Live]");
   IndicatorDigits(Digits);

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
   ObjectsDeleteAll(0, dashboardPrefix);
   ObjectDelete(0, btnBuyName);
   ObjectDelete(0, btnSellName);
   ChartRedraw(0);
}

//+------------------------------------------------------------------+
//| Candlestick Pattern Helpers                                      |
//+------------------------------------------------------------------+
bool IsBullishRejection(double op, double hi, double lo, double cl)
{
   double body = MathAbs(cl - op);
   double lowerWick = MathMin(op, cl) - lo;
   double upperWick = hi - MathMax(op, cl);
   double totalRange = hi - lo;
   if(totalRange <= 0.0) return false;
   return (lowerWick >= 0.45 * totalRange && upperWick <= 0.25 * totalRange);
}

bool IsBearishRejection(double op, double hi, double lo, double cl)
{
   double body = MathAbs(cl - op);
   double lowerWick = MathMin(op, cl) - lo;
   double upperWick = hi - MathMax(op, cl);
   double totalRange = hi - lo;
   if(totalRange <= 0.0) return false;
   return (upperWick >= 0.45 * totalRange && lowerWick <= 0.25 * totalRange);
}

bool IsBullishEngulfing(double prevOp, double prevCl, double currOp, double currCl)
{
   return (prevCl < prevOp && currCl > currOp && currCl >= prevOp && currOp <= prevCl);
}

bool IsBearishEngulfing(double prevOp, double prevCl, double currOp, double currCl)
{
   return (prevCl > prevOp && currCl < currOp && currCl <= prevOp && currOp >= prevCl);
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
   if(Bars <= minRequired) return(0);

   int counted = IndicatorCounted();
   if(counted < 0) return(-1);
   if(counted > 0) counted--;

   int limit = Bars - counted;
   if(limit > Bars - minRequired) limit = Bars - minRequired;

   int startBar = InpSignalOnBarClose ? 1 : 0;

   for(int i = limit; i >= 0; i--)
   {
      FastEMABuffer[i] = iMA(NULL, 0, InpFastEMAPeriod, 0, MODE_EMA, InpAppliedPrice, i);
      SlowEMABuffer[i] = iMA(NULL, 0, InpSlowEMAPeriod, 0, MODE_EMA, InpAppliedPrice, i);

      BuySignalBuffer[i] = 0.0;
      SellSignalBuffer[i] = 0.0;

      if(i < startBar || i > Bars - minRequired) continue;

      double curFast   = FastEMABuffer[i];
      double curSlow   = SlowEMABuffer[i];
      double prevFast  = FastEMABuffer[i + 1];
      double prevSlow  = SlowEMABuffer[i + 1];

      double curTrend  = iMA(NULL, 0, InpTrendEMAPeriod, 0, MODE_EMA, InpAppliedPrice, i);
      double curRSI    = iRSI(NULL, 0, InpRSIPeriod, InpAppliedPrice, i);
      double curATR    = iATR(NULL, 0, InpATRPeriod, i);

      bool bullPA = IsBullishRejection(Open[i], High[i], Low[i], Close[i]) ||
                    IsBullishEngulfing(Open[i+1], Close[i+1], Open[i], Close[i]);
      bool bearPA = IsBearishRejection(Open[i], High[i], Low[i], Close[i]) ||
                    IsBearishEngulfing(Open[i+1], Close[i+1], Open[i], Close[i]);

      bool emaCrossUp      = (prevFast <= prevSlow && curFast > curSlow);
      bool emaTrendingUp   = (curFast > curSlow);
      bool trendFilterBull = (!InpFilterWithTrend) || (Close[i] > curTrend);
      bool rsiBullFilter   = (curRSI >= 45.0 && curRSI <= InpRSIOverbought);

      bool buyCondition = false;
      if(InpRequireCandlePA)
         buyCondition = emaTrendingUp && trendFilterBull && rsiBullFilter && (bullPA || emaCrossUp);
      else
         buyCondition = emaCrossUp && trendFilterBull && rsiBullFilter;

      bool emaCrossDown    = (prevFast >= prevSlow && curFast < curSlow);
      bool emaTrendingDown = (curFast < curSlow);
      bool trendFilterBear = (!InpFilterWithTrend) || (Close[i] < curTrend);
      bool rsiBearFilter   = (curRSI <= 55.0 && curRSI >= InpRSIOversold);

      bool sellCondition = false;
      if(InpRequireCandlePA)
         sellCondition = emaTrendingDown && trendFilterBear && rsiBearFilter && (bearPA || emaCrossDown);
      else
         sellCondition = emaCrossDown && trendFilterBear && rsiBearFilter;

      if(buyCondition && BuySignalBuffer[i + 1] == 0.0 && BuySignalBuffer[i + 2] == 0.0)
      {
         BuySignalBuffer[i] = Low[i] - (curATR * 0.4);

         if(i == startBar && Time[i] != lastAlertTime)
         {
            lastAlertTime = Time[i];
            double sl = Low[i] - (curATR * InpSL_ATR_Mult);
            double tp1 = Close[i] + (curATR * InpTP1_ATR_Mult);
            double tp2 = Close[i] + (curATR * InpTP2_ATR_Mult);
            ExecuteAlert("BUY", Close[i], sl, tp1, tp2);
         }
      }
      else if(sellCondition && SellSignalBuffer[i + 1] == 0.0 && SellSignalBuffer[i + 2] == 0.0)
      {
         SellSignalBuffer[i] = High[i] + (curATR * 0.4);

         if(i == startBar && Time[i] != lastAlertTime)
         {
            lastAlertTime = Time[i];
            double sl = High[i] + (curATR * InpSL_ATR_Mult);
            double tp1 = Close[i] - (curATR * InpTP1_ATR_Mult);
            double tp2 = Close[i] - (curATR * InpTP2_ATR_Mult);
            ExecuteAlert("SELL", Close[i], sl, tp1, tp2);
         }
      }
   }

   if(InpShowDashboard)
   {
      double curPrice = Close[0];
      double fEma = FastEMABuffer[0];
      double sEma = SlowEMABuffer[0];
      double tEma = iMA(NULL, 0, InpTrendEMAPeriod, 0, MODE_EMA, InpAppliedPrice, 0);
      double rsi  = iRSI(NULL, 0, InpRSIPeriod, InpAppliedPrice, 0);
      double atr  = iATR(NULL, 0, InpATRPeriod, 0);

      UpdateDashboard(curPrice, fEma, sEma, tEma, rsi, atr);
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
         Execute1ClickTrade(OP_BUY);
      }
      else if(sparam == btnSellName)
      {
         ObjectSetInteger(0, btnSellName, OBJPROP_STATE, false);
         Execute1ClickTrade(OP_SELL);
      }
   }
}

//+------------------------------------------------------------------+
//| Execute 1-Click Trade with Pre-calculated SL and TP              |
//+------------------------------------------------------------------+
void Execute1ClickTrade(int orderType)
{
   double ask = MarketInfo(Symbol(), MODE_ASK);
   double bid = MarketInfo(Symbol(), MODE_BID);
   double curATR = iATR(NULL, 0, InpATRPeriod, 0);
   if(curATR <= 0.0) curATR = 10 * Point;

   double sl = 0.0;
   double tp = 0.0;
   int ticket = -1;

   if(orderType == OP_BUY)
   {
      sl = NormalizeDouble(bid - (curATR * InpSL_ATR_Mult), Digits);
      tp = NormalizeDouble(ask + (curATR * InpTP1_ATR_Mult), Digits);

      ticket = OrderSend(Symbol(), OP_BUY, InpFixedLotSize, ask, InpSlippagePoints, sl, tp, "FastScalper 1-Click BUY", InpMagicNumber, 0, clrLime);
      if(ticket > 0)
      {
         Alert(StringFormat("[1-CLICK TRADE SUCCESS] BUY #%d @ %s | SL: %s | TP: %s", ticket, DoubleToStr(ask, Digits), DoubleToStr(sl, Digits), DoubleToStr(tp, Digits)));
      }
      else
      {
         Print("FastScalperPro: OrderSend Error #", GetLastError());
      }
   }
   else if(orderType == OP_SELL)
   {
      sl = NormalizeDouble(ask + (curATR * InpSL_ATR_Mult), Digits);
      tp = NormalizeDouble(bid - (curATR * InpTP1_ATR_Mult), Digits);

      ticket = OrderSend(Symbol(), OP_SELL, InpFixedLotSize, bid, InpSlippagePoints, sl, tp, "FastScalper 1-Click SELL", InpMagicNumber, 0, clrRed);
      if(ticket > 0)
      {
         Alert(StringFormat("[1-CLICK TRADE SUCCESS] SELL #%d @ %s | SL: %s | TP: %s", ticket, DoubleToStr(bid, Digits), DoubleToStr(sl, Digits), DoubleToStr(tp, Digits)));
      }
      else
      {
         Print("FastScalperPro: OrderSend Error #", GetLastError());
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
//| Dispatch Alerts                                                  |
//+------------------------------------------------------------------+
void ExecuteAlert(string type, double price, double sl, double tp1, double tp2)
{
   string tf = "";
   switch(Period())
   {
      case PERIOD_M1:  tf = "M1";  break;
      case PERIOD_M5:  tf = "M5";  break;
      case PERIOD_M15: tf = "M15"; break;
      case PERIOD_H1:  tf = "H1";  break;
      default:         tf = (string)Period(); break;
   }

   string msg = StringFormat("[Fast Scalper Pro] %s Signal on %s (%s) @ %s | SL: %s | TP1: %s | TP2: %s",
                             type, Symbol(), tf,
                             DoubleToStr(price, Digits),
                             DoubleToStr(sl, Digits),
                             DoubleToStr(tp1, Digits),
                             DoubleToStr(tp2, Digits));

   if(InpAlertPopup) Alert(msg);
   if(InpAlertSound) PlaySound(InpSoundFile);
   if(InpAlertPush)  SendNotification(msg);
}

//+------------------------------------------------------------------+
//| Update HUD Dashboard                                             |
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
   CreateOrUpdateLabel(dashboardPrefix + "SYM",   "Symbol: " + Symbol() + " (" + (string)Period() + "m)", InpDashXOffset, InpDashYOffset + 18, InpDashTextColor, 9, false);
   CreateOrUpdateLabel(dashboardPrefix + "PRICE", "Live Price: " + DoubleToStr(price, Digits), InpDashXOffset, InpDashYOffset + 34, InpDashTextColor, 9, false);
   CreateOrUpdateLabel(dashboardPrefix + "TREND", "Trend Bias: " + trendStr, InpDashXOffset, InpDashYOffset + 50, trendColor, 9, true);
   CreateOrUpdateLabel(dashboardPrefix + "RSI",   "Momentum RSI: " + DoubleToStr(rsi, 1), InpDashXOffset, InpDashYOffset + 66, InpDashTextColor, 9, false);
   CreateOrUpdateLabel(dashboardPrefix + "ATR",   "Volatility (ATR): " + DoubleToStr(atr, Digits), InpDashXOffset, InpDashYOffset + 82, InpDashTextColor, 9, false);
   CreateOrUpdateLabel(dashboardPrefix + "RULE",  "Live Market: Click BUY/SELL button on signal", InpDashXOffset, InpDashYOffset + 100, clrGold, 8, false);
}

//+------------------------------------------------------------------+
//| Create or Update Text Label                                      |
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
