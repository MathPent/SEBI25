from statsmodels.tsa.arima.model import ARIMA
import matplotlib.pyplot as plt

# Load data
import yfinance as yf
data = yf.download("AAPL", start="2020-01-01", end="2023-01-01")  # Replace "AAPL" with your desired ticker

# Fit ARIMA model
model = ARIMA(data['Close'], order=(5,1,0))  # (p,d,q)
model_fit = model.fit()

# Forecast
forecast = model_fit.forecast(steps=30)
plt.plot(data['Close'], label="Historical")
plt.plot(forecast, label="Forecast", color="red")
plt.legend()
plt.show()
