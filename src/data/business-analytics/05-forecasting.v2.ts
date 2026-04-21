import { Module } from "../types";

export const forecastingModule: Module = {
  id: "ba-forecasting",
  title: "Forecasting",
  description: "Master time series analysis, moving averages, exponential smoothing, ARIMA, demand forecasting, and accuracy metrics.",
  lessons: [
    {
      id: "ba-time-series",
      slug: "time-series-components",
      title: "Time Series Components",
      content: `## Time Series Components

A time series is a sequence of data points collected over time -- sales by month, website traffic by day, stock prices by minute. HBS analytics courses teach that effective forecasting begins with **decomposing a time series into its fundamental components**.

### The Four Components

**1. Trend**: The long-term direction of the data. Is it increasing, decreasing, or flat?

**2. Seasonality**: Regular, predictable patterns that repeat at fixed intervals. Retail sales spike in December. Ice cream sales peak in summer. Tax software downloads surge in April.

**3. Cyclical**: Longer-term fluctuations related to business or economic cycles. Unlike seasonality, cycles do not have fixed periods.

**4. Noise (Irregular)**: Random variation that cannot be attributed to trend, seasonality, or cycles.

### Decomposition

Time series decomposition separates these components:

**Additive model**: Y = Trend + Seasonality + Noise (when seasonal variation is constant)

**Multiplicative model**: Y = Trend x Seasonality x Noise (when seasonal variation grows with the level)

### Why Decomposition Matters

Once you separate the components, you can:
- **Identify the underlying trend** without seasonal distortion
- **Quantify seasonal effects** for planning (staffing, inventory)
- **Detect anomalies** by comparing actual values to expected patterns
- **Build better forecasts** by modeling each component separately

### Key Takeaway

Before forecasting, always decompose your time series. Understanding the trend, seasonality, and noise components helps you choose the right forecasting method and avoid being misled by short-term fluctuations.

**Sources**: HBS Online, "Business Analytics" course. Hyndman, R. J. & Athanasopoulos, G. (2018). *Forecasting: Principles and Practice*.`,
    },
    {
      id: "ba-moving-avg",
      slug: "moving-averages-smoothing",
      title: "Moving Averages & Exponential Smoothing",
      content: `## Moving Averages & Exponential Smoothing

Moving averages and exponential smoothing are the workhorses of business forecasting -- simple, intuitive methods that work well for many practical applications.

### Simple Moving Average (SMA)

The SMA calculates the average of the last k observations:

Forecast = (Y[t-1] + Y[t-2] + ... + Y[t-k]) / k

**Choosing k**: Larger k = smoother forecast (less responsive to recent changes). Smaller k = more responsive (but noisier).

### Weighted Moving Average

Assigns different weights to different periods, typically giving more weight to recent observations.

### Exponential Smoothing

Exponential smoothing gives exponentially decreasing weights to older observations:

Forecast[t+1] = alpha * Y[t] + (1-alpha) * Forecast[t]

**Alpha (smoothing parameter, 0 to 1)**:
- Alpha close to 1: Heavy weight on recent data (responsive but noisy)
- Alpha close to 0: Heavy weight on historical average (smooth but slow to adapt)

### Holt's Method (Double Exponential Smoothing)

Extends exponential smoothing to handle data with a trend:
- Level equation: smooths the overall level
- Trend equation: smooths the trend direction

### Holt-Winters (Triple Exponential Smoothing)

Extends Holt's method to handle data with both trend and seasonality:
- Level equation
- Trend equation
- Seasonal equation

This is the most commonly used exponential smoothing method in business because most business data has both trend and seasonality.

### Key Takeaway

Exponential smoothing methods are simple, computationally efficient, and often surprisingly accurate. For many business forecasting problems, they perform comparably to more complex methods while being far easier to understand and implement.

**Sources**: HBS Online, "Business Analytics" course. Hyndman, R. J. & Athanasopoulos, G. (2018). *Forecasting: Principles and Practice*.`,
    },
    {
      id: "ba-arima",
      slug: "arima-models",
      title: "ARIMA Models",
      content: `## ARIMA Models

ARIMA (AutoRegressive Integrated Moving Average) is one of the most powerful and flexible time series forecasting methods. HBS analytics courses introduce ARIMA as the standard method for forecasting when exponential smoothing is insufficient.

### ARIMA Components

ARIMA(p, d, q) has three components:

**AR (AutoRegressive) - p**: The forecast depends on p previous values. Like regression, but the independent variables are past values of the same series.

**I (Integrated) - d**: The number of times the data must be differenced to become stationary (constant mean and variance). d=1 means we forecast changes rather than levels.

**MA (Moving Average) - q**: The forecast depends on q previous forecast errors. This captures short-term shocks.

### SARIMA: Seasonal ARIMA

SARIMA extends ARIMA to handle seasonality:

SARIMA(p, d, q)(P, D, Q, m)

Where P, D, Q are the seasonal equivalents and m is the seasonal period (12 for monthly, 4 for quarterly).

### When to Use ARIMA

- Data has complex patterns that exponential smoothing cannot capture
- You need to model the correlation structure of the time series
- You want to generate prediction intervals (not just point forecasts)
- You have enough historical data (typically 50+ observations)

### ARIMA in Practice

Modern tools (Python's statsmodels, R's forecast package) can automatically select the best ARIMA parameters:

1. Test for stationarity (ADF test)
2. Difference the series if needed (determine d)
3. Use ACF and PACF plots (or auto.arima) to determine p and q
4. Fit the model and check residuals
5. Generate forecasts with prediction intervals

### Key Takeaway

ARIMA is a powerful, flexible forecasting method for time series data. While more complex than exponential smoothing, it can capture patterns that simpler methods miss. Modern software makes ARIMA accessible even for non-statisticians.

**Sources**: Box, G. E. P. & Jenkins, G. M. (1970). *Time Series Analysis*. HBS Online, "Business Analytics" course. Hyndman, R. J. & Athanasopoulos, G. (2018). *Forecasting: Principles and Practice*.`,
    },
    {
      id: "ba-demand-forecast",
      slug: "demand-forecasting",
      title: "Demand Forecasting",
      content: `## Demand Forecasting

Demand forecasting is arguably the most commercially important application of business analytics. HBS supply chain and operations courses emphasize that **every business function depends on demand forecasts**: operations plans production, finance plans budgets, marketing plans campaigns, and HR plans headcount.

### Why Demand Forecasting is Hard

1. **Uncertainty**: Customer behavior is inherently unpredictable
2. **External factors**: Weather, competitors, economic conditions, viral trends
3. **New products**: No historical data for new launches
4. **Promotions**: Price changes, marketing campaigns distort normal demand patterns
5. **Bullwhip effect**: Small demand variations amplify up the supply chain

### Forecasting Methods by Horizon

| Horizon | Method | Used For |
|---------|--------|----------|
| Very short (days) | Time series, ML | Daily operations, staffing |
| Short (weeks-months) | Exponential smoothing, ARIMA | Inventory, production planning |
| Medium (quarters) | Regression with leading indicators | Budgeting, capacity planning |
| Long (years) | Judgment, scenarios, trend analysis | Strategy, capital investment |

### Combining Forecasts

Research consistently shows that **combining multiple forecasting methods outperforms any single method**. A simple average of three different forecasts typically beats the best individual forecast.

### Demand Sensing

Modern demand forecasting incorporates real-time signals:
- Point-of-sale data (what is selling right now?)
- Search trends (what are people searching for?)
- Social media sentiment (what are people saying?)
- Weather forecasts (how will weather affect demand?)

### Key Takeaway

Demand forecasting is imperfect but essential. The goal is not a perfect forecast but a forecast that is good enough to improve business decisions. Always report uncertainty (prediction intervals), combine methods, and continuously measure and improve forecast accuracy.

**Sources**: HBS Online, "Business Analytics" course. Hyndman, R. J. & Athanasopoulos, G. (2018). *Forecasting: Principles and Practice*.`,
      starterCode: `# Demand Forecasting with Exponential Smoothing
# Forecast next 3 months of sales

# Monthly sales data (12 months)
sales = [200, 220, 210, 250, 240, 260, 280, 270, 300, 290, 310, 320]

# TODO: Implement simple exponential smoothing
# Formula: Forecast[t+1] = alpha * Actual[t] + (1-alpha) * Forecast[t]
# Use alpha = 0.3
# Seed: Forecast[0] = sales[0]

alpha = 0.3

# Generate forecasts for the historical period
forecasts = [sales[0]]  # Start with first actual value

# TODO: Loop through sales data and calculate forecasts
# TODO: Forecast the next 3 months
# TODO: Calculate MAE (Mean Absolute Error) for the historical period

print("Exponential Smoothing Forecast")
print("=" * 40)`,
      solutionCode: `# Demand Forecasting with Exponential Smoothing
sales = [200, 220, 210, 250, 240, 260, 280, 270, 300, 290, 310, 320]

alpha = 0.3
forecasts = [sales[0]]

# Generate forecasts for historical period
for t in range(1, len(sales)):
    forecast = alpha * sales[t-1] + (1 - alpha) * forecasts[t-1]
    forecasts.append(round(forecast, 1))

print("Exponential Smoothing Forecast (alpha=0.3)")
print("=" * 45)
print(f"{'Month':>6} {'Actual':>8} {'Forecast':>10} {'Error':>8}")
print("-" * 45)
for i in range(len(sales)):
    error = sales[i] - forecasts[i]
    print(f"{i+1:>6} {sales[i]:>8} {forecasts[i]:>10.1f} {error:>8.1f}")

# Calculate MAE
errors = [abs(sales[i] - forecasts[i]) for i in range(1, len(sales))]
mae = sum(errors) / len(errors)
print(f"\\nMAE: {mae:.1f}")

# Forecast next 3 months
print("\\nFuture Forecasts:")
last_forecast = forecasts[-1]
last_actual = sales[-1]
next_forecast = alpha * last_actual + (1 - alpha) * last_forecast
for month in range(13, 16):
    print(f"  Month {month}: {next_forecast:.1f}")
    next_forecast = alpha * next_forecast + (1 - alpha) * next_forecast  # No new actual`,
    },
    {
      id: "ba-accuracy",
      slug: "forecast-accuracy-metrics",
      title: "Forecast Accuracy Metrics",
      content: `## Forecast Accuracy Metrics

Forecasting without measuring accuracy is like driving without a speedometer. HBS analytics courses emphasize that **forecast accuracy measurement is essential for continuous improvement** and for choosing between competing forecasting methods.

### Key Accuracy Metrics

**MAE (Mean Absolute Error)**
MAE = average of |Actual - Forecast|

Interpretation: Average forecast error in the original units. Easy to understand and communicate.

**RMSE (Root Mean Square Error)**
RMSE = sqrt(average of (Actual - Forecast)^2)

Interpretation: Similar to MAE but penalizes large errors more heavily. Use when large errors are particularly costly.

**MAPE (Mean Absolute Percentage Error)**
MAPE = average of |Actual - Forecast| / Actual * 100%

Interpretation: Average percentage error. Useful for comparing accuracy across products with different scales.

### Comparing Metrics

| Metric | Advantages | Disadvantages |
|--------|-----------|---------------|
| MAE | Simple, interpretable, robust | Does not penalize large errors |
| RMSE | Penalizes large errors | Sensitive to outliers |
| MAPE | Scale-independent | Undefined when actual = 0, biased |

### Forecast Accuracy Benchmarks

What is a "good" MAPE?

| MAPE | Interpretation |
|------|----------------|
| < 10% | Highly accurate |
| 10-20% | Good |
| 20-50% | Reasonable |
| > 50% | Inaccurate |

But context matters: forecasting daily demand for 10,000 products is harder than forecasting annual revenue for one company.

### Best Practices for Forecast Evaluation

1. **Use out-of-sample evaluation**: Never evaluate a forecast on the same data used to build it
2. **Use rolling forecasts**: Evaluate accuracy across multiple time periods, not just one
3. **Compare to naive benchmarks**: Is your model better than a simple baseline (e.g., "forecast = last period's actual")?
4. **Track bias**: Is the forecast consistently too high or too low? Bias can be corrected.
5. **Report uncertainty**: Provide prediction intervals, not just point forecasts

### Key Takeaway

Forecast accuracy metrics are essential for method selection, continuous improvement, and honest communication about uncertainty. Always measure accuracy, always compare to baselines, and always report uncertainty alongside point forecasts.

**Sources**: HBS Online, "Business Analytics" course. Hyndman, R. J. & Athanasopoulos, G. (2018). *Forecasting: Principles and Practice*. Makridakis, S., Wheelwright, S. C., & Hyndman, R. J. (1998). *Forecasting: Methods and Applications*. Wiley.`,
    },
  ],
};
