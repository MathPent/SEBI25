import matplotlib.pyplot as plt
import numpy as np
import pandas as pd 




# Example data creation
data = pd.DataFrame({
    'Volume': np.random.rand(100) * 100,
    'Anomaly': np.random.choice([0, 1], size=100, p=[0.95, 0.05])
})

plt.figure(figsize=(12,6))
plt.plot(data['Volume'], label="Volume")
plt.scatter(data.index[data['Anomaly']==1],
            data['Volume'][data['Anomaly']==1], color='red', label="Fraud Suspicion")
plt.legend()
plt.show()
