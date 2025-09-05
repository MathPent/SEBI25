import yfinance as yf
import pandas as pd
import joblib

# Load trained fraud model
model = joblib.load("fraud_model.pkl")

# Download real stock data
ticker = "RELIANCE.NS"
df = yf.download(ticker, start="2024-01-01", end="2025-01-01", interval="1d")

# Prepare features
df = df.reset_index()
df["Price_Change"] = df["Close"].pct_change() * 100
df = df.fillna(0)

X_real = df[["Close", "Volume"]]

# Predict fraud
df["Fraud_Prediction"] = model.predict(X_real)

# Save results
df.to_csv("reliance_fraud_prediction.csv", index=False)
print("✅ Predictions saved to reliance_fraud_prediction.csv")

# Show fraud cases
fraud_cases = df[df["Fraud_Prediction"] == 1]
print(f"⚠️ Fraud cases detected: {len(fraud_cases)}")
print(fraud_cases[["Date", "Close", "Volume", "Fraud_Prediction"]].head())
