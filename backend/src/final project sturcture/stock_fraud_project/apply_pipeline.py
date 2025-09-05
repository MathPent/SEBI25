import yfinance as yf
import pandas as pd
import joblib
from statsmodels.tsa.arima.model import ARIMA
import matplotlib.pyplot as plt
import os

# Load fraud detection model
fraud_model = joblib.load("models/fraud_model.pkl")

# Companies list
tickers = ["RELIANCE.NS", "TCS.NS", "INFY.NS"]

save_dir = "results"
os.makedirs(save_dir, exist_ok=True)

for ticker in tickers:
    print(f"\n📊 Processing {ticker}...")

    # Download stock data
    df = yf.download(ticker, start="2024-01-01", end="2025-01-01", interval="1d")

    if df.empty:
        print(f"⚠️ No data for {ticker}")
        continue

    df = df.reset_index()
    X = df[["Close", "Volume"]].fillna(0)

    # --- Fraud Detection ---
    df["Fraud_Prediction"] = fraud_model.predict(X)
    fraud_cases = df[df["Fraud_Prediction"] == 1]
    fraud_cases.to_csv(os.path.join(save_dir, f"{ticker}_fraud_cases.csv"), index=False)
    print(f"⚠️ Fraud cases detected: {len(fraud_cases)}")

    # --- ARIMA Forecast ---
    try:
        series = df["Close"].dropna()
        model = ARIMA(series, order=(5,1,0))
        fit = model.fit()

        forecast = fit.forecast(steps=30)
        forecast_df = pd.DataFrame(forecast, columns=["Forecast"])
        forecast_df.to_csv(os.path.join(save_dir, f"{ticker}_forecast.csv"))

        plt.figure(figsize=(10,5))
        plt.plot(series.index[-100:], series.tail(100), label="Actual")
        plt.plot(forecast_df.index, forecast_df["Forecast"], label="Forecast", color="red")
        plt.title(f"{ticker} - ARIMA Forecast")
        plt.legend()
        plt.savefig(os.path.join(save_dir, f"{ticker}_forecast.png"))
        plt.close()

        print(f"✅ Forecast generated for {ticker}")
    except Exception as e:
        print(f"❌ ARIMA failed for {ticker}: {e}")
