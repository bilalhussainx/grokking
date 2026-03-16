import { Module } from "../types";

export const technicalAnalysisModule: Module = {
  id: "sm-technical",
  title: "Technical Analysis",
  description:
    "Learn to read price charts, identify patterns, and use technical indicators to time your trades.",
  lessons: [
    {
      id: "sm-technical-charts",
      slug: "price-charts-candlesticks",
      title: "Price Charts & Candlesticks",
      content: `## Price Charts & Candlesticks

Technical analysis studies price movements and trading volume to forecast future price direction. Unlike fundamental analysis, which focuses on what a company is worth, technical analysis focuses on what the market is willing to pay — and how that price is changing over time. The foundation of technical analysis is the price chart.

### Types of Price Charts

**Line Chart**: The simplest chart type — a continuous line connecting closing prices over time. Good for seeing the general trend but loses information about intraday price action.

**Bar Chart (OHLC)**: Each bar shows four prices for a given period: Open, High, Low, and Close. The vertical line spans from the low to the high. A small horizontal tick on the left marks the open; a tick on the right marks the close.

**Candlestick Chart**: The most popular chart type in modern technical analysis. Each "candle" shows the same OHLC data as a bar chart but in a more visually intuitive format.

### Reading a Candlestick

A single candlestick consists of:

- **Body**: The thick part between the open and close prices
- **Upper wick (shadow)**: The thin line above the body, extending to the period's high
- **Lower wick (shadow)**: The thin line below the body, extending to the period's low

| Candle Color | Meaning |
|-------------|---------|
| **Green (or white)** | Close > Open — the price went up during the period |
| **Red (or black)** | Close < Open — the price went down during the period |

A long body indicates strong buying or selling pressure. Short bodies indicate indecision. Long wicks show that the price was pushed in one direction but reversed — suggesting resistance to further movement.

### Important Single-Candle Patterns

**Doji**: Open and close are nearly the same (tiny body). Signals indecision — neither buyers nor sellers have control. After a strong trend, a doji can signal a potential reversal.

**Hammer**: Small body at the top, long lower wick. Appears in downtrends and suggests the sell-off was rejected — bullish reversal signal.

**Shooting Star**: Small body at the bottom, long upper wick. Appears in uptrends and suggests the rally was rejected — bearish reversal signal.

**Marubozu**: Long body with no wicks. A green marubozu shows strong buying from open to close. A red marubozu shows strong selling.

### Multi-Candle Patterns

**Engulfing Pattern**: A two-candle pattern where the second candle completely "engulfs" the first. A bullish engulfing (green candle engulfs red) at the bottom of a downtrend signals a reversal. A bearish engulfing (red candle engulfs green) at the top of an uptrend signals a reversal.

**Morning Star / Evening Star**: Three-candle reversal patterns. The morning star (bearish candle, small indecision candle, bullish candle) signals a bottom. The evening star (bullish candle, small candle, bearish candle) signals a top.

### Chart Timeframes

The same stock can look different on different timeframes:

| Timeframe | Each Candle Represents | Best For |
|-----------|----------------------|----------|
| 1-minute | 1 minute of trading | Day trading |
| 5-minute | 5 minutes | Intraday trading |
| 1-hour | 1 hour | Swing trading |
| Daily | 1 trading day | Swing/position trading |
| Weekly | 1 week | Position trading |
| Monthly | 1 month | Long-term trend analysis |

A stock might be in a downtrend on the daily chart but in an uptrend on the weekly chart. Multi-timeframe analysis helps resolve these conflicts.

### Key Takeaway

Candlestick charts are the language of technical analysis. They compress four data points (open, high, low, close) into a visual format that reveals the battle between buyers and sellers during each period. Learning to read candlestick patterns is the first step toward using technical analysis as a tool for timing entries and exits.`,
    },
    {
      id: "sm-technical-support-resistance",
      slug: "support-and-resistance",
      title: "Support & Resistance",
      content: `## Support & Resistance

Support and resistance are the most fundamental concepts in technical analysis. They represent price levels where buying or selling pressure has historically been strong enough to halt or reverse a price move. Understanding these levels helps you identify potential entry points, exit points, and stop-loss levels.

### What is Support?

**Support** is a price level where a stock tends to stop falling and bounce back up. It acts as a "floor" because buying interest increases at that price level — enough buyers step in to absorb the selling pressure and push the price higher.

Why support forms:
- Buyers who missed the previous rally see the lower price as an opportunity
- Short sellers take profits by buying back shares
- Institutional investors have buy orders waiting at specific price levels
- Psychological round numbers attract buying interest (such as 100 dollars or 50 dollars)

### What is Resistance?

**Resistance** is a price level where a stock tends to stop rising and pull back. It acts as a "ceiling" because selling pressure increases — sellers step in to take profits or new short positions are established.

Why resistance forms:
- Investors who bought at higher prices sell to break even when the stock recovers
- Profit-taking as stocks approach recent highs
- Institutional sell orders clustered at specific levels
- Psychological round numbers where people decide "that is high enough"

### Identifying Support and Resistance

**Historical price levels:** Look for prices where the stock has repeatedly bounced (support) or stalled (resistance). The more times a level has been tested, the stronger it is considered.

**Round numbers:** Stocks frequently pause at psychologically significant prices (50, 100, 200, etc.). These levels attract both buyers and sellers.

**Previous highs and lows:** A stock's 52-week high is a natural resistance level. Its 52-week low is natural support.

**Volume clusters:** Prices where high volume was traded in the past create strong support and resistance, because many investors have cost bases at those levels.

### The Role Reversal Principle

One of the most powerful concepts in technical analysis: **when support is broken, it becomes resistance. When resistance is broken, it becomes support.**

Example: A stock bounces at 50 dollars three times (support). On the fourth test, it breaks below 50 dollars and drops to 45 dollars. If the stock then rallies back to 50 dollars, that former support level now acts as resistance — investors who bought at 50 dollars and watched the stock fall are eager to sell at breakeven.

### Strength of Support and Resistance Levels

Levels are stronger when:
- They have been tested multiple times without breaking
- High trading volume occurred at that level
- They coincide with round numbers or other technical indicators
- They have held for a longer period of time

Levels are weaker when:
- They have only been tested once or twice
- Volume at the level was light
- They were formed recently with limited history

### Practical Application

| Scenario | Action |
|----------|--------|
| Stock approaching strong support | Consider buying with a stop-loss below support |
| Stock approaching strong resistance | Consider taking profits or tightening stops |
| Support breaks on high volume | Bearish — previous support may now act as resistance |
| Resistance breaks on high volume | Bullish — previous resistance may now act as support |

### Key Takeaway

Support and resistance are areas where supply and demand dynamics create predictable price reactions. They are not exact price points — think of them as zones rather than precise lines. The most effective use of support and resistance is combining them with other tools (volume, trend analysis, moving averages) to build a complete picture of where a stock is likely to go next.`,
    },
    {
      id: "sm-technical-moving-averages",
      slug: "moving-averages",
      title: "Moving Averages",
      content: `## Moving Averages

Moving averages are the most widely used technical indicators in the world. They smooth out price data to reveal the underlying trend, filter out noise from day-to-day volatility, and provide dynamic support and resistance levels. Every professional trader and many institutional investors incorporate moving averages into their analysis.

### Simple Moving Average (SMA)

The SMA calculates the average closing price over a specified number of periods:

**SMA = (Sum of closing prices over N periods) / N**

For example, a 50-day SMA on any given day is the average of the last 50 closing prices. Each day, the oldest price drops off and the newest price is added — the average "moves" forward in time.

Common SMA periods:
- **20-day SMA**: Short-term trend (approximately 1 month of trading)
- **50-day SMA**: Medium-term trend (approximately 2.5 months)
- **200-day SMA**: Long-term trend (approximately 10 months)

### Exponential Moving Average (EMA)

The EMA gives more weight to recent prices, making it more responsive to new information:

**EMA = (Current Price x Multiplier) + (Previous EMA x (1 - Multiplier))**
**Multiplier = 2 / (N + 1)**

The EMA reacts faster to price changes than the SMA, which makes it better for short-term trading but potentially more prone to false signals.

| Characteristic | SMA | EMA |
|---------------|-----|-----|
| Responsiveness | Slower, smoother | Faster, more reactive |
| Best for | Identifying longer-term trends | Short-term trading signals |
| False signals | Fewer | More frequent |
| Lag | More lag | Less lag |

### Using Moving Averages for Trend Identification

The simplest application is trend direction:

- **Price above the moving average**: Uptrend — bullish
- **Price below the moving average**: Downtrend — bearish
- **Moving average is flat**: No clear trend — range-bound

For longer-term trend assessment, the 200-day SMA is the industry standard. If a stock is above its 200-day SMA, it is generally considered to be in a long-term uptrend.

### Moving Average Crossovers

Crossover strategies use two moving averages of different lengths:

**Golden Cross**: The shorter-term MA crosses above the longer-term MA — bullish signal. The most famous is the 50-day SMA crossing above the 200-day SMA.

**Death Cross**: The shorter-term MA crosses below the longer-term MA — bearish signal. The 50-day SMA crossing below the 200-day SMA.

| Signal | Short MA | Long MA | Meaning |
|--------|---------|---------|---------|
| Golden Cross | 50-day rises above | 200-day | Bullish trend change |
| Death Cross | 50-day falls below | 200-day | Bearish trend change |

**Caution:** Crossover signals are lagging indicators — by the time the cross occurs, a significant portion of the move may have already happened. They work best in trending markets and produce false signals in range-bound markets.

### Moving Averages as Dynamic Support and Resistance

Moving averages often act as support in uptrends and resistance in downtrends:

- In a strong uptrend, pullbacks often find support at the 20-day or 50-day SMA
- In a strong downtrend, rallies often stall at the 20-day or 50-day SMA
- The 200-day SMA is the most closely watched level for institutional buying and selling

### Practical Tips

1. **Use multiple MAs together**: A common setup is 20/50/200-day SMAs on a daily chart
2. **Do not use MAs in isolation**: Combine with volume analysis and other indicators
3. **Respect the 200-day SMA**: This is the most institutionally significant moving average
4. **Adapt to your timeframe**: Short-term traders use shorter MAs; long-term investors use longer ones
5. **Watch for MA clustering**: When multiple MAs converge at one price, that level becomes very significant

### Key Takeaway

Moving averages transform noisy price data into clear trend signals. They are not predictive — they are descriptive — but they provide a framework for identifying trend direction, potential support and resistance, and trend change signals. They are most effective in trending markets and should be combined with other tools for a complete analytical framework.`,
    },
    {
      id: "sm-technical-volume",
      slug: "volume-analysis",
      title: "Volume Analysis",
      content: `## Volume Analysis

Volume is the number of shares (or contracts) traded during a given period. It is the second most important data point in technical analysis after price. While price tells you what happened, volume tells you how significant it was. A price move on high volume carries more conviction than the same move on low volume.

### Why Volume Matters

Volume represents participation. When volume is high, many market participants are actively buying and selling — the price movement reflects broad agreement or disagreement. When volume is low, fewer participants are driving the move, which makes it less reliable.

Think of it this way: if a stock rises 5% on 10 million shares traded (5 times its average), that is a much more meaningful move than a 5% rise on 500,000 shares (a quarter of its average). The high-volume move has more institutional participation and conviction behind it.

### Key Volume Principles

**1. Volume Confirms Trends**
In a healthy uptrend, volume should increase on up days and decrease on down days. This pattern shows that buyers are eager (high volume when prices rise) and sellers are tentative (low volume when prices dip).

In a healthy downtrend, volume increases on down days and decreases on up days — sellers are aggressive and buyers are weak.

**2. Volume Precedes Price**
Volume often increases before a significant price move. If a stock has been quiet (low volume) and volume suddenly spikes, a price breakout may be imminent.

**3. Climactic Volume Signals Exhaustion**
Extremely high volume after a prolonged move can signal a climax — the last burst of buying in an uptrend or the last wave of panic selling in a downtrend. These "blow-off tops" and "capitulation bottoms" often mark turning points.

**4. Breakouts Require Volume**
When a stock breaks through a support or resistance level, the breakout is more reliable if it occurs on above-average volume. A breakout on low volume is more likely to be a "false breakout" that quickly reverses.

### Volume Indicators

**Volume Moving Average**: A simple average of volume over N periods (typically 20 or 50 days). It helps you determine whether today's volume is above or below normal.

**On-Balance Volume (OBV)**: A cumulative indicator that adds volume on up days and subtracts volume on down days. Rising OBV confirms an uptrend; falling OBV confirms a downtrend. Divergences between OBV and price can signal trend reversals.

**Volume-Weighted Average Price (VWAP)**: The average price weighted by volume — represents the "fair" price at which most trading occurred. Institutional traders use VWAP as a benchmark. Prices above VWAP suggest bullish pressure; below suggests bearish.

### Volume Patterns to Watch

| Pattern | Volume Behavior | Significance |
|---------|----------------|-------------|
| Uptrend with rising volume | Volume increases on rallies | Healthy, sustainable uptrend |
| Uptrend with declining volume | Volume fades on rallies | Uptrend losing steam — caution |
| Breakout on high volume | Volume 2-3x average | Strong, likely sustainable breakout |
| Breakout on low volume | Volume below average | Weak — potential false breakout |
| Gap up on high volume | Volume surges at open | Strong institutional buying |
| Gap down on high volume | Volume surges at open | Panic selling or negative catalyst |
| Extremely high volume at lows | Volume spikes at bottom | Potential capitulation / bottom |

### Volume and Accumulation/Distribution

**Accumulation** occurs when institutional investors are quietly buying a stock over time. Signs include:
- Rising price on increasing volume
- Higher volume on up days than down days
- OBV trending upward

**Distribution** occurs when institutional investors are selling. Signs include:
- Flat or declining price on increasing volume
- Higher volume on down days than up days
- OBV trending downward

Accumulation and distribution phases often precede major price moves. Identifying them early can give you an edge.

### Practical Application

1. Always check volume when evaluating a price move — is it meaningful?
2. Compare current volume to the 20-day or 50-day average for context
3. Require above-average volume to confirm breakouts
4. Watch for volume divergences (price making new highs but volume declining)
5. Use volume alongside price patterns and moving averages, not in isolation

### Key Takeaway

Volume is the fuel that powers price moves. High volume validates price action; low volume questions it. By incorporating volume analysis into your trading process, you can distinguish between meaningful moves and noise, identify accumulation and distribution, and improve your timing on entries and exits. Price tells you what is happening. Volume tells you whether to believe it.`,
    },
    {
      id: "sm-technical-patterns",
      slug: "chart-patterns",
      title: "Chart Patterns",
      content: `## Chart Patterns

Chart patterns are specific shapes or formations that appear on price charts and have historically preceded predictable price moves. They represent the collective psychology of market participants — the battle between fear, greed, and uncertainty playing out visually in price action.

### Continuation vs. Reversal Patterns

**Continuation patterns** suggest the current trend will resume after a brief pause:
- Flags and pennants
- Triangles (in the direction of the trend)
- Rectangles (consolidation)

**Reversal patterns** suggest the current trend is about to change direction:
- Head and shoulders
- Double tops and double bottoms
- Rounding tops and bottoms

### Head and Shoulders (Bearish Reversal)

One of the most reliable reversal patterns. It consists of:
1. **Left shoulder**: A rally to a new high, followed by a pullback
2. **Head**: A higher rally, followed by a pullback to approximately the same level (the "neckline")
3. **Right shoulder**: A rally that fails to reach the head's height, followed by a decline through the neckline

The pattern is confirmed when price breaks below the neckline on increased volume. The price target is typically the distance from the head to the neckline, projected downward from the breakout point.

**Inverse head and shoulders** is the mirror image — a bullish reversal pattern that forms at the bottom of a downtrend.

### Double Top (Bearish Reversal)

Two consecutive peaks at approximately the same price level, separated by a trough:
1. Price rallies to a high (first top)
2. Price pulls back
3. Price rallies again to approximately the same high (second top) but cannot break through
4. Price declines below the trough between the two tops (confirmation)

The pattern signals that buyers tried twice to push through resistance and failed. The price target is the distance from the tops to the trough, projected downward.

**Double bottom** is the mirror image — a bullish reversal pattern forming at the bottom of a downtrend.

### Triangles

Triangles form when price range narrows over time, indicating decreasing volatility before a breakout:

**Ascending Triangle (typically bullish):**
- Flat upper resistance line (sellers at a fixed price)
- Rising lower trendline (buyers bidding higher each time)
- Breakout typically occurs upward through resistance

**Descending Triangle (typically bearish):**
- Flat lower support line
- Declining upper trendline
- Breakout typically occurs downward through support

**Symmetrical Triangle:**
- Converging upper and lower trendlines
- Neither buyers nor sellers are clearly dominant
- Breakout can occur in either direction — watch volume for confirmation

### Flags and Pennants (Continuation)

These form during strong trends and represent brief consolidation before the trend resumes:

**Flag**: A small rectangular consolidation that slopes against the prevailing trend. After a sharp rally (the "flagpole"), the price consolidates in a slight downward channel (the flag), then breaks out to the upside.

**Pennant**: Similar to a flag but with converging trendlines (like a small symmetrical triangle). Forms after a strong move and typically resolves in the direction of the prior trend.

### Cup and Handle (Bullish Continuation)

A rounded bottom (the "cup") followed by a small downward drift (the "handle"), then a breakout above the handle's resistance:
1. The cup forms a gradual U-shape (not a V-shape)
2. The handle is a slight downward consolidation on declining volume
3. The breakout above the handle's high on increasing volume confirms the pattern

This is one of William O'Neil's favorite patterns and a staple of growth stock investing.

### Pattern Reliability

No pattern works every time. Key factors that improve reliability:

| Factor | Better | Worse |
|--------|--------|-------|
| Volume | Increases on breakout | Decreases or flat |
| Timeframe | Longer patterns (weeks/months) | Very short patterns (days) |
| Prior trend | Well-established trend | Choppy, unclear trend |
| Confirmation | Price closes beyond the pattern | Only briefly breaks the pattern |

### Key Takeaway

Chart patterns provide a visual framework for understanding market psychology. They work because they capture recurring human behavior — fear, greed, hope, and capitulation. However, no pattern is a guaranteed prediction. Always use patterns in conjunction with volume confirmation, broader trend analysis, and proper risk management. The pattern gets you in; risk management keeps you alive.`,
    },
  ],
};
