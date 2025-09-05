# stock_forecast_fraud.py
# -----------------------------------
# Stock price prediction (ARIMA) + Fraud detection (anomalous bulk trading)
# Run in VS Code: python stock_forecast_fraud.py

import yfinance as yf
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from statsmodels.tsa.arima.model import ARIMA
from statsmodels.tsa.stattools import adfuller
import warnings

warnings.filterwarnings("ignore")

# -------------------------------
# STEP 1: Fetch Stock Data
# -------------------------------
ticker = "TCS.NS"  # Example: TCS (NSE India). Change to "AAPL", "MSFT", etc.
data = yf.download(ticker, start="2020-01-01", end="2025-01-01", interval="1d")

if data.empty:
    print("No data fetched. Check ticker or date range.")
    exit()

print(f"Downloaded {len(data)} rows of data for {ticker}")
print(data.head())

# -------------------------------
# STEP 2: Check Stationarity
# -------------------------------
def check_stationarity(timeseries):
    result = adfuller(timeseries.dropna())
    print("\nADF Test:")
    print(f"ADF Statistic: {result[0]}")
    print(f"p-value: {result[1]}")
    return result[1] <= 0.05  # Stationary if p < 0.05

is_stationary = check_stationarity(data["Close"])
if not is_stationary:
    print("Data is not stationary → ARIMA will difference automatically.")

# -------------------------------
# STEP 3: Train ARIMA Model
# -------------------------------
print("\nTraining ARIMA model...")
model = ARIMA(data["Close"], order=(5, 1, 0))  # (p,d,q) → tune for better fit
model_fit = model.fit()
print(model_fit.summary())

# Forecast for next 30 days
forecast = model_fit.forecast(steps=30)
forecast_index = pd.date_range(data.index[-1], periods=30, freq="D")

# -------------------------------
# STEP 4: Fraud Detection (Volume anomalies)
# -------------------------------
data["RollingMean"] = data["Volume"].rolling(20).mean()
data["RollingStd"] = data["Volume"].rolling(20).std()

data["Fraud_Anomaly"] = np.where(
    data["Volume"] > data["RollingMean"] + 3 * data["RollingStd"], 1, 0
)

fraud_cases = data[data["Fraud_Anomaly"] == 1]
print("\n⚠️ Potential Fraudulent Bulk Trades Detected:")
print(fraud_cases[["Close", "Volume"]].tail(10))

# -------------------------------
# STEP 5: Visualization
# -------------------------------
plt.figure(figsize=(14, 6))

# Plot Stock Prices & Forecast
plt.plot(data["Close"], label="Historical Close Price")
plt.plot(forecast_index, forecast, color="red", linestyle="--", label="ARIMA Forecast")

plt.title(f"{ticker} Stock Price Forecast (ARIMA)")
plt.xlabel("Date")
plt.ylabel("Price (INR)")
plt.legend()
plt.show()

# Plot Volume Anomalies
plt.figure(figsize=(14, 6))
plt.plot(data["Volume"], label="Daily Volume")
plt.scatter(
    data.index[data["Fraud_Anomaly"] == 1],
    data["Volume"][data["Fraud_Anomaly"] == 1],
    color="red",
    label="Suspicious Bulk Trade",
)
plt.title(f"{ticker} Trading Volume with Fraud Detection")
plt.xlabel("Date")
plt.ylabel("Volume")
plt.legend()
plt.show()
