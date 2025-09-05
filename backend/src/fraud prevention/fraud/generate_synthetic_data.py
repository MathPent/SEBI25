import pandas as pd
import numpy as np

# Generate synthetic trading data
np.random.seed(42)
dates = pd.date_range(start="2025-01-01", periods=200)

data = []
price = 100
for d in dates:
    # normal trading
    volume = np.random.randint(8000, 15000)
    price += np.random.normal(0, 1)

    fraud = 0
    # inject fraud randomly
    if np.random.rand() < 0.05:  # 5% fraud
        volume = np.random.randint(80000, 120000)
        price += np.random.choice([+10, -10])
        fraud = 1

    data.append([d, "FAKECO", round(price, 2), volume, fraud])

df = pd.DataFrame(data, columns=["Date", "Ticker", "Close", "Volume", "Fraud_Label"])
df.to_csv("synthetic_fraud_data.csv", index=False)

print("✅ Synthetic fraud dataset created: synthetic_fraud_data.csv")
