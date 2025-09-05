import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import joblib, os

os.makedirs("models", exist_ok=True)

# Load synthetic dataset
df = pd.read_csv("data/synthetic_fraud_data.csv")

X = df[["Close", "Volume"]]
y = df["Fraud_Label"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(n_estimators=200, random_state=42)
model.fit(X_train, y_train)

print("✅ Fraud Model Trained. Accuracy:", model.score(X_test, y_test))

# Save model
joblib.dump(model, "models/fraud_model.pkl")
print("✅ Model saved at models/fraud_model.pkl")
