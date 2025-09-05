import matplotlib.pyplot as plt
import yfinance as yf
import pandas as pd
from statsmodels.tsa.arima.model import ARIMA
import matplotlib.pyplot as plt
import os

# Define the stock ticker symbol
ticker = "AAPL"  # Replace "AAPL" with the desired stock ticker symbol

# Fetch stock data
df = yf.download(ticker, start="2020-01-01", end="2023-01-01")

# Fit ARIMA model
model = ARIMA(df['Close'], order=(5,1,0))
model_fit = model.fit()

# Forecast next 30 days
forecast = model_fit.get_forecast(steps=30)
forecast_index = pd.date_range(start=df.index[-1] + pd.Timedelta(days=1), periods=30, freq='B')  
forecast_mean = forecast.predicted_mean
forecast_ci = forecast.conf_int()

# Plot actual and forecast
plt.figure(figsize=(10,5))
plt.plot(df.index, df['Close'], label="Actual", color="blue")
plt.plot(forecast_index, forecast_mean, label="Forecast", color="red")
plt.fill_between(forecast_index,
                 forecast_ci.iloc[:, 0],
                 forecast_ci.iloc[:, 1], color="pink", alpha=0.3)

plt.title(f"{ticker} - ARIMA Forecast")
plt.xlabel("Date")
plt.ylabel("Stock Price")
plt.legend()
plt.grid(True)
plt.show()
