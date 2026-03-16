import { Module } from "../types";

export const forecastingModule: Module = {
  id: "ba-forecasting",
  title: "Forecasting",
  description: "Master time series analysis, moving averages, exponential smoothing, ARIMA, demand forecasting, and accuracy metrics.",
  lessons: [
    { id: "ba-time-series", slug: "time-series-components", title: "Time Series Components", content: `## Time Series Components\n\nA time series is a sequence of data points collected over time -- sales by month, website traffic by day, stock prices by minute. HBS analytics courses teach that effective forecasting begins with **decomposing a time series into its fundamental components**.\n\n### The Four Components\n\n**1. Trend**: The long-term direction of the data. Is it increasing, decreasing, or flat?\n\n**2. Seasonality**: Regular, predictable patterns that repeat at fixed intervals. Retail sales spike in December. Ice cream sales peak in summer. Tax software downloads surge in April.\n\n**3. Cyclical**: Longer-term fluctuations related to business or economic cycles. Unlike seasonality, cycles do not have fixed periods.\n\n**4. Noise (Irregular)**: Random variation that cannot be attributed to trend, seasonality, or cycles.\n\n### Decomposition\n\nTime series decomposition separates these components:\n\n**Additive model**: Y = Trend + Seasonality + Noise (when seasonal variation is constant)\n\n**Multiplicative model**: Y = Trend x Seasonality x Noise (when seasonal variation grows with the level)\n\n### Why Decomposition Matters\n\nOnce you separate the components, you can:\n- **Identify the underlying trend** without seasonal distortion\n- **Quantify seasonal effects** for planning (staffing, inventory)\n- **Detect anomalies** by comparing actual values to expected patterns\n- **Build better forecasts** by modeling each component separately\n\n### Key Takeaway\n\nBefore forecasting, always decompose your time series. Understanding the trend, seasonality, and noise components helps you choose the right forecasting method and avoid being misled by short-term fluctuations.\n\n**Sources**: HBS Online, "Business Analytics" course. Hyndman, R. J. & Athanasopoulos, G. (2018). *Forecasting: Principles and Practice*.` },
    { id: "ba-moving-avg", slug: "moving-averages-smoothing", title: "Moving Averages & Exponential Smoothing", content: `## Moving Averages & Exponential Smoothing\n\nMoving averages and exponential smoothing are the workhorses of business forecasting -- simple, intuitive methods that work well for many practical applications.\n\n### Simple Moving Average (SMA)\n\nThe SMA calculates the average of the last k observations:\n\nForecast = (Y[t-1] + Y[t-2] + ... + Y[t-k]) / k\n\n**Choosing k**: Larger k = smoother forecast (less responsive to recent changes). Smaller k = more responsive (but noisier).\n\n### Weighted Moving Average\n\nAssigns different weights to different periods, typically giving more weight to recent observations.\n\n### Exponential Smoothing\n\nExponential smoothing gives exponentially decreasing weights to older observations:\n\nForecast[t+1] = alpha * Y[t] + (1-alpha) * Forecast[t]\n\n**Alpha (smoothing parameter, 0 to 1)**:\n- Alpha close to 1: Heavy weight on recent data (responsive but noisy)\n- Alpha close to 0: Heavy weight on historical average (smooth but slow to adapt)\n\n### Holt's Method (Double Exponential Smoothing)\n\nExtends exponential smoothing to handle data with a trend:\n- Level equation: smooths the overall level\n- Trend equation: smooths the trend direction\n\n### Holt-Winters (Triple Exponential Smoothing)\n\nExtends Holt's method to handle data with both trend and seasonality:\n- Level equation\n- Trend equation\n- Seasonal equation\n\nThis is the most commonly used exponential smoothing method in business because most business data has both trend and seasonality.\n\n### Key Takeaway\n\nExponential smoothing methods are simple, computationally efficient, and often surprisingly accurate. For many business forecasting problems, they perform comparably to more complex methods while being far easier to understand and implement.\n\n**Sources**: HBS Online, "Business Analytics" course. Hyndman, R. J. & Athanasopoulos, G. (2018). *Forecasting: Principles and Practice*.` },
    { id: "ba-arima", slug: "arima-models", title: "ARIMA Models", content: `## ARIMA Models\n\nARIMA (AutoRegressive Integrated Moving Average) is one of the most powerful and flexible time series forecasting methods. HBS analytics courses introduce ARIMA as the standard method for forecasting when exponential smoothing is insufficient.\n\n### ARIMA Components\n\nARIMA(p, d, q) has three components:\n\n**AR (AutoRegressive) - p**: The forecast depends on p previous values. Like regression, but the independent variables are past values of the same series.\n\n**I (Integrated) - d**: The number of times the data must be differenced to become stationary (constant mean and variance). d=1 means we forecast changes rather than levels.\n\n**MA (Moving Average) - q**: The forecast depends on q previous forecast errors. This captures short-term shocks.\n\n### SARIMA: Seasonal ARIMA\n\nSARIMA extends ARIMA to handle seasonality:\n\nSARIMA(p, d, q)(P, D, Q, m)\n\nWhere P, D, Q are the seasonal equivalents and m is the seasonal period (12 for monthly, 4 for quarterly).\n\n### When to Use ARIMA\n\n- Data has complex patterns that exponential smoothing cannot capture\n- You need to model the correlation structure of the time series\n- You want to generate prediction intervals (not just point forecasts)\n- You have enough historical data (typically 50+ observations)\n\n### ARIMA in Practice\n\nModern tools (Python's statsmodels, R's forecast package) can automatically select the best ARIMA parameters:\n\n1. Test for stationarity (ADF test)\n2. Difference the series if needed (determine d)\n3. Use ACF and PACF plots (or auto.arima) to determine p and q\n4. Fit the model and check residuals\n5. Generate forecasts with prediction intervals\n\n### Key Takeaway\n\nARIMA is a powerful, flexible forecasting method for time series data. While more complex than exponential smoothing, it can capture patterns that simpler methods miss. Modern software makes ARIMA accessible even for non-statisticians.\n\n**Sources**: Box, G. E. P. & Jenkins, G. M. (1970). *Time Series Analysis*. HBS Online, "Business Analytics" course. Hyndman, R. J. & Athanasopoulos, G. (2018). *Forecasting: Principles and Practice*.` },
    { id: "ba-demand-forecast", slug: "demand-forecasting", title: "Demand Forecasting", content: `## Demand Forecasting\n\nDemand forecasting is arguably the most commercially important application of business analytics. HBS supply chain and operations courses emphasize that **every business function depends on demand forecasts**: operations plans production, finance plans budgets, marketing plans campaigns, and HR plans headcount.\n\n### Why Demand Forecasting is Hard\n\n1. **Uncertainty**: Customer behavior is inherently unpredictable\n2. **External factors**: Weather, competitors, economic conditions, viral trends\n3. **New products**: No historical data for new launches\n4. **Promotions**: Price changes, marketing campaigns distort normal demand patterns\n5. **Bullwhip effect**: Small demand variations amplify up the supply chain\n\n### Forecasting Methods by Horizon\n\n| Horizon | Method | Used For |\n|---------|--------|----------|\n| Very short (days) | Time series, ML | Daily operations, staffing |\n| Short (weeks-months) | Exponential smoothing, ARIMA | Inventory, production planning |\n| Medium (quarters) | Regression with leading indicators | Budgeting, capacity planning |\n| Long (years) | Judgment, scenarios, trend analysis | Strategy, capital investment |\n\n### Combining Forecasts\n\nResearch consistently shows that **combining multiple forecasting methods outperforms any single method**. A simple average of three different forecasts typically beats the best individual forecast.\n\n### Demand Sensing\n\nModern demand forecasting incorporates real-time signals:\n- Point-of-sale data (what is selling right now?)\n- Search trends (what are people searching for?)\n- Social media sentiment (what are people saying?)\n- Weather forecasts (how will weather affect demand?)\n\n### Key Takeaway\n\nDemand forecasting is imperfect but essential. The goal is not a perfect forecast but a forecast that is good enough to improve business decisions. Always report uncertainty (prediction intervals), combine methods, and continuously measure and improve forecast accuracy.\n\n**Sources**: HBS Online, "Business Analytics" course. Hyndman, R. J. & Athanasopoulos, G. (2018). *Forecasting: Principles and Practice*.`,
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
    next_forecast = alpha * next_forecast + (1 - alpha) * next_forecast  # No new actual` },
    { id: "ba-accuracy", slug: "forecast-accuracy-metrics", title: "Forecast Accuracy Metrics", content: `## Forecast Accuracy Metrics\n\nForecasting without measuring accuracy is like driving without a speedometer. HBS analytics courses emphasize that **forecast accuracy measurement is essential for continuous improvement** and for choosing between competing forecasting methods.\n\n### Key Accuracy Metrics\n\n**MAE (Mean Absolute Error)**\nMAE = average of |Actual - Forecast|\n\nInterpretation: Average forecast error in the original units. Easy to understand and communicate.\n\n**RMSE (Root Mean Square Error)**\nRMSE = sqrt(average of (Actual - Forecast)^2)\n\nInterpretation: Similar to MAE but penalizes large errors more heavily. Use when large errors are particularly costly.\n\n**MAPE (Mean Absolute Percentage Error)**\nMAPE = average of |Actual - Forecast| / Actual * 100%\n\nInterpretation: Average percentage error. Useful for comparing accuracy across products with different scales.\n\n### Comparing Metrics\n\n| Metric | Advantages | Disadvantages |\n|--------|-----------|---------------|\n| MAE | Simple, interpretable, robust | Does not penalize large errors |\n| RMSE | Penalizes large errors | Sensitive to outliers |\n| MAPE | Scale-independent | Undefined when actual = 0, biased |\n\n### Forecast Accuracy Benchmarks\n\nWhat is a "good" MAPE?\n\n| MAPE | Interpretation |\n|------|----------------|\n| < 10% | Highly accurate |\n| 10-20% | Good |\n| 20-50% | Reasonable |\n| > 50% | Inaccurate |\n\nBut context matters: forecasting daily demand for 10,000 products is harder than forecasting annual revenue for one company.\n\n### Best Practices for Forecast Evaluation\n\n1. **Use out-of-sample evaluation**: Never evaluate a forecast on the same data used to build it\n2. **Use rolling forecasts**: Evaluate accuracy across multiple time periods, not just one\n3. **Compare to naive benchmarks**: Is your model better than a simple baseline (e.g., "forecast = last period's actual")?\n4. **Track bias**: Is the forecast consistently too high or too low? Bias can be corrected.\n5. **Report uncertainty**: Provide prediction intervals, not just point forecasts\n\n### Key Takeaway\n\nForecast accuracy metrics are essential for method selection, continuous improvement, and honest communication about uncertainty. Always measure accuracy, always compare to baselines, and always report uncertainty alongside point forecasts.\n\n**Sources**: HBS Online, "Business Analytics" course. Hyndman, R. J. & Athanasopoulos, G. (2018). *Forecasting: Principles and Practice*. Makridakis, S., Wheelwright, S. C., & Hyndman, R. J. (1998). *Forecasting: Methods and Applications*. Wiley.` },
  ],
};
