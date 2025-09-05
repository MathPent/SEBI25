import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
import joblib

# Load synthetic fraud dataset
df = pd.read_csv("synthetic_fraud_data.csv")

# Features & labels
X = df[["Close", "Volume"]]
y = df["Fraud_Label"]

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Random Forest Classifier
model = RandomForestClassifier(n_estimators=200, random_state=42)
model.fit(X_train, y_train)

# Evaluate
y_pred = model.predict(X_test)
print("📊 Classification Report:\n", classification_report(y_test, y_pred))

# Save trained model
joblib.dump(model, "fraud_model.pkl")
print("✅ Fraud detection model saved as fraud_model.pkl")
