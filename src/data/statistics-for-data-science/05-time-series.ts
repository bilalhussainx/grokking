import { Module } from "../types";

export const module5: Module = {
  id: "time-series",
  title: "Time Series Analysis & Forecasting",
  description: "Decomposition, stationarity and differencing, ARIMA and SARIMA models, Facebook Prophet, autocorrelation, and evaluating forecasts with MAE/MAPE/RMSE",
  lessons: [
    {
      id: "time-series",
      slug: "time-series",
      title: "Time Series Analysis & Forecasting",
      content: `# Time Series Analysis & Forecasting

Time series data is everywhere: stock prices, website traffic, sales, sensor readings. Standard ML models assume observations are independent — time series violates this. Temporal models capture trends, seasonality, and autocorrelation that standard regression misses.

---

\`\`\`concept
{
  "title": "The Components of a Time Series",
  "variant": "mental-model",
  "content": "Any time series can be decomposed into: (1) Trend — long-term direction (growing, declining, flat), (2) Seasonality — repeating patterns at fixed periods (weekly, monthly, annually), (3) Cyclical — irregular longer-term fluctuations (business cycles), (4) Residual (noise) — random variation. Most forecasting models work by modeling each component separately. The key insight: once you remove the predictable components (trend + seasonality), what remains should be white noise. If the residuals still have patterns, the model missed something."
}
\`\`\`

---

## Decomposition & Stationarity

\`\`\`python
import pandas as pd
import numpy as np
from statsmodels.tsa.seasonal import seasonal_decompose
from statsmodels.tsa.stattools import adfuller, kpss

# Load time series data:
df = pd.read_csv('monthly_sales.csv', parse_dates=['date'], index_col='date')
ts = df['sales']

# --- Decompose the series ---
decomposition = seasonal_decompose(ts, model='multiplicative', period=12)
# model='additive': Y = trend + seasonal + residual
# model='multiplicative': Y = trend * seasonal * residual (better for growing variance)

decomposition.plot()
# Now you can see: is there a trend? Is seasonality consistent?

# --- Test for stationarity (ADF test) ---
# Stationary: mean, variance, and autocorrelation are constant over time
# ARIMA requires stationarity — non-stationary series need differencing

result = adfuller(ts)
print(f"ADF Statistic: {result[0]:.4f}")
print(f"p-value: {result[1]:.4f}")
# p < 0.05 → reject H0 (series is stationary)
# p > 0.05 → fail to reject H0 (series is non-stationary → needs differencing)

# --- Differencing to achieve stationarity ---
ts_diff = ts.diff().dropna()          # first difference: removes linear trend
ts_diff2 = ts.diff().diff().dropna()  # second difference: removes quadratic trend
ts_seasonal_diff = ts.diff(12).dropna()  # seasonal difference (lag=12 for monthly)

# Re-test after differencing:
result = adfuller(ts_diff)
print(f"ADF after differencing: p = {result[1]:.4f}")  # should be < 0.05
\`\`\`

## ACF & PACF: Finding Model Parameters

\`\`\`python
from statsmodels.graphics.tsaplots import plot_acf, plot_pacf

# ACF (Autocorrelation Function): correlation with lagged values
# PACF (Partial Autocorrelation): direct correlation after removing shorter lags

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(12, 8))
plot_acf(ts_diff, lags=40, ax=ax1)
plot_pacf(ts_diff, lags=40, ax=ax2)
plt.tight_layout()

# Reading ACF/PACF for ARIMA(p, d, q):
# d = number of differences needed for stationarity (from ADF test)
#
# AR(p) pattern: ACF decays geometrically, PACF cuts off after lag p
# → p = last significant lag in PACF
#
# MA(q) pattern: ACF cuts off after lag q, PACF decays geometrically
# → q = last significant lag in ACF
#
# Significant lag: outside the confidence bands (blue shaded area)
\`\`\`

## ARIMA & SARIMA Models

\`\`\`python
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.statespace.sarimax import SARIMAX

# --- ARIMA(p, d, q) ---
model = ARIMA(ts, order=(2, 1, 1))
result = model.fit()
print(result.summary())

# Forecast next 12 months:
forecast = result.get_forecast(steps=12)
pred_mean = forecast.predicted_mean
pred_ci = forecast.conf_int()

plt.plot(ts, label='Observed')
plt.plot(pred_mean, label='Forecast')
plt.fill_between(pred_ci.index, pred_ci.iloc[:, 0], pred_ci.iloc[:, 1], alpha=0.3)
plt.legend()

# --- SARIMA(p, d, q)(P, D, Q, s): adds seasonal components ---
# s = seasonal period (12 for monthly data, 4 for quarterly, 7 for daily)
sarima = SARIMAX(ts,
    order=(1, 1, 1),          # ARIMA parameters
    seasonal_order=(1, 1, 1, 12)  # seasonal ARIMA parameters
)
sarima_result = sarima.fit(disp=False)

# --- Auto-select order with auto_arima ---
from pmdarima import auto_arima

auto_model = auto_arima(
    ts,
    seasonal=True, m=12,
    stepwise=True,       # faster search
    trace=True,          # print each model tried
    error_action='ignore',
    suppress_warnings=True,
)
print(auto_model.summary())  # shows selected p, d, q, P, D, Q
\`\`\`

## Facebook Prophet

\`\`\`python
from prophet import Prophet
import pandas as pd

# Prophet: designed for business time series with:
# - Trend (linear or logistic growth)
# - Seasonality (yearly, weekly, daily — automatic)
# - Holidays and special events

# Requires columns: ds (datetime) and y (value)
df_prophet = df.reset_index().rename(columns={'date': 'ds', 'sales': 'y'})

model = Prophet(
    seasonality_mode='multiplicative',  # 'additive' if amplitude doesn't grow
    yearly_seasonality=True,
    weekly_seasonality=True,
    daily_seasonality=False,
    changepoint_prior_scale=0.05,  # flexibility of trend (0.05 = conservative)
)

# Add custom seasonality:
model.add_seasonality(name='monthly', period=30.5, fourier_order=5)

# Add holiday effects:
from prophet.make_holidays import make_holidays_df
holidays = make_holidays_df(year_list=[2022, 2023, 2024], country='US')
model = Prophet(holidays=holidays)

model.fit(df_prophet)

# Make future dataframe (12 months ahead):
future = model.make_future_dataframe(periods=12, freq='M')
forecast = model.predict(future)

# Visualize:
fig = model.plot(forecast)
fig2 = model.plot_components(forecast)
# Shows: trend, yearly seasonality, weekly seasonality, holiday effects separately
\`\`\`

## Forecast Evaluation Metrics

\`\`\`python
from sklearn.metrics import mean_absolute_error, mean_squared_error
import numpy as np

def evaluate_forecast(actual, predicted):
    mae = mean_absolute_error(actual, predicted)
    rmse = np.sqrt(mean_squared_error(actual, predicted))
    mape = np.mean(np.abs((actual - predicted) / actual)) * 100
    smape = np.mean(2 * np.abs(actual - predicted) / (np.abs(actual) + np.abs(predicted))) * 100

    print(f"MAE:   {mae:.2f}")
    print(f"RMSE:  {rmse:.2f}")
    print(f"MAPE:  {mape:.2f}%")
    print(f"sMAPE: {smape:.2f}%")
    return {'mae': mae, 'rmse': rmse, 'mape': mape, 'smape': smape}

# MAE: average absolute error (same units as y)
# RMSE: penalizes large errors more (in units of y)
# MAPE: % error — scale-free, but undefined when actual=0 and inflated for small actuals
# sMAPE: symmetric MAPE — better for intermittent demand

# Naive forecast baseline (always compare against this):
# Naive: forecast = last observed value
# Seasonal naive: forecast = value from same period last year
naive_forecast = ts.shift(12)  # seasonal naive for monthly data
evaluate_forecast(test, naive_forecast[-len(test):])
# If your model barely beats the naive → go back to EDA
\`\`\`

\`\`\`takeaways
["Decompose before modeling — visualize trend, seasonality, and residuals before choosing a model.", "ADF test p < 0.05 means stationary — otherwise take first differences (d=1) or seasonal differences.", "PACF tells you AR order (p), ACF tells you MA order (q) — read where the lags cut off.", "Prophet handles missing data, outliers, and holidays automatically — great starting point for business time series.", "Always compare against a naive baseline (last value or same-period-last-year) — a complex model beating a naive one is real signal.", "MAPE is undefined when actual values include zeros — use sMAPE or MAE for intermittent demand."]
\`\`\`
`,
    },
  ],
};
