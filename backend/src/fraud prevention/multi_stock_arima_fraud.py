# multi_stock_arima_fraud.py
# -------------------------------------------------
# Predict stock prices (ARIMA) + Fraud detection for multiple Indian companies
# Saves results in separate folders for each company
# Run: python multi_stock_arima_fraud.py

import yfinance as yf
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use("Agg")  # Use non-GUI backend
from statsmodels.tsa.arima.model import ARIMA
import os, warnings

warnings.filterwarnings("ignore")

# -------------------------------
# STEP 1: Define Indian companies
# -------------------------------
tickers = [
    "RELIANCE.NS",  # Reliance Industries
    "TCS.NS",       # Tata Consultancy Services
    "INFY.NS",      # Infosys
    "HDFCBANK.NS",  # HDFC Bank
    "ICICIBANK.NS", # ICICI Bank
    "HINDUNILVR.NS",# Hindustan Unilever
    "SBIN.NS",      # State Bank of India
    "KOTAKBANK.NS", # Kotak Mahindra Bank
    "LT.NS",        # Larsen & Toubro
    "BAJFINANCE.NS" # Bajaj Finance
]

# Create a results folder
BASE_DIR = "results"
os.makedirs(BASE_DIR, exist_ok=True)

# -------------------------------
# STEP 2: Download Data & Process
# -------------------------------
for ticker in tickers:
    print(f"\n📥 Downloading data for {ticker}...")
    df = yf.download(ticker, start="2020-01-01", end="2025-01-01", interval="1d")

    if df.empty:
        print(f"⚠️ No data found for {ticker}")
        continue

    # Make a sub-folder for this stock
    stock_folder = os.path.join(BASE_DIR, ticker.replace(".", "_"))
    os.makedirs(stock_folder, exist_ok=True)

    # ------------------ ARIMA MODEL ------------------
    try:
        print(f"📊 Running ARIMA model for {ticker}...")
        model = ARIMA(df["Close"].astype(float).values, order=(5, 1, 0))
        model_fit = model.fit()

        forecast = model_fit.forecast(steps=30)
        forecast_index = pd.date_range(df.index[-1], periods=30, freq="D")

        # Plot forecast
        plt.figure(figsize=(12, 5))
        plt.plot(df["Close"], label="Historical Close")
        plt.plot(forecast_index, forecast, color="red", linestyle="--", label="ARIMA Forecast")
        plt.title(f"{ticker} - Stock Price Forecast (ARIMA)")
        plt.xlabel("Date")
        plt.ylabel("Price (INR)")
        plt.legend()

        # Save forecast chart
        forecast_path = os.path.join(stock_folder, "forecast.png")
        plt.savefig(forecast_path)
        plt.close()
        print(f"✅ Saved forecast plot: {forecast_path}")

    except Exception as e:
        print(f"ARIMA failed for {ticker}: {e}")

    # ------------------ FRAUD DETECTION ------------------
    try:
        df["RollingMean"] = df["Volume"].rolling(20).mean()
        df["RollingStd"] = df["Volume"].rolling(20).std()
        df["Fraud_Anomaly"] = np.where(
            df["Volume"] > df["RollingMean"] + 3 * df["RollingStd"], 1, 0
        )
        fraud_cases = df[df["Fraud_Anomaly"] == 1]

        # Save fraud cases to CSV
        fraud_csv_path = os.path.join(stock_folder, "fraud_cases.csv")
        fraud_cases.to_csv(fraud_csv_path)
        print(f"✅ Saved fraud cases: {fraud_csv_path}")

        # Plot anomalies
        plt.figure(figsize=(12, 5))
        plt.plot(df["Volume"], label="Daily Volume")
        plt.scatter(
            df.index[df["Fraud_Anomaly"] == 1],
            df["Volume"][df["Fraud_Anomaly"] == 1],
            color="red", label="Suspicious Bulk Trade"
        )
        plt.title(f"{ticker} - Trading Volume with Fraud Detection")
        plt.xlabel("Date")
        plt.ylabel("Volume")
        plt.legend()

        # Save volume anomaly chart
        fraud_plot_path = os.path.join(stock_folder, "fraud_volume.png")
        plt.savefig(fraud_plot_path)
        plt.close()
        print(f"✅ Saved fraud detection plot: {fraud_plot_path}")

    except Exception as e:
        print(f"Fraud detection failed for {ticker}: {e}")
