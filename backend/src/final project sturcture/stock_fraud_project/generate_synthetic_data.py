import pandas as pd
import numpy as np
import os

os.makedirs("data", exist_ok=True)

np.random.seed(42)
dates = pd.date_range(start="2024-01-01", periods=200)

data = []
price = 100
for d in dates:
    volume = np.random.randint(8000, 15000)
    price += np.random.normal(0, 1)
    fraud = 0
    if np.random.rand() < 0.05:  # 5% fraud days
        volume = np.random.randint(80000, 120000)
        price += np.random.choice([+10, -10])
        fraud = 1
    data.append([d, "FAKECO", round(price, 2), volume, fraud])

df = pd.DataFrame(data, columns=["Date", "Ticker", "Close", "Volume", "Fraud_Label"])
df.to_csv("data/synthetic_fraud_data.csv", index=False)

print("✅ Synthetic fraud dataset saved at data/synthetic_fraud_data.csv")
