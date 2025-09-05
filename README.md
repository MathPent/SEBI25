# 📊 SEBI25 – Fraud Detection & Prevention Platform  

🚀 Prototype submitted for **SEBI Securities Market Hackathon 2025** under the **Global FinTech Fest 2025**.  

Our solution leverages **AI/ML, data analytics, and fraud prevention techniques** to safeguard investors and ensure transparency in the securities market.  

---

## 🌟 Key Features  
- 🔍 **Fraud Detection Models** – Identify suspicious stock market activities.  
- 📈 **Market Hype Analysis** – Detect fake news, misinformation, and hype creation.  
- 🛡 **Prevention Framework** – Tools to monitor and flag abnormal trading behavior.  
- 🖥 **Interactive Frontend** – Simple HTML/CSS/JS interface for analysis and reporting.  
- 📂 **Modular Backend** – Node.js + Python ML models integrated with structured database.  

---

## 🏗️ Project Structure  
```bash
SEBI25/
│── ai-ml/
│   └── src/                # AI/ML models & scripts
│
│── backend/
│   └── src/
│       ├── final project sturcture/
│       │   ├── data/       # Datasets
│       │   ├── models/     # Trained models
│       │   ├── results/    # Output & analysis results
│       │   ├── stock_fraud_project/
│       │   └── fraud prevention/
│       └── app.js          # Backend entrypoint
│
│── database/               # Database scripts/configs
│
│── frontend/
│   └── pages/
│       ├── analys.css      # Styling
│       ├── analys.html     # Analysis UI
│       ├── analys.js       # Frontend logic
│       └── fakehype.html   # Fake hype detection page
│
└── src/                    # Additional codebase

⚙️ Tech Stack
🔹 Frontend

HTML, CSS, JavaScript – Clean UI for fraud detection & analysis dashboards

🔹 Backend

Node.js, Express.js – API and server logic

Database – SQL / NoSQL for transaction logs and fraud records

🔹 AI/ML & Data Science

yfinance – Fetching stock market data

pandas – Data cleaning & manipulation

numpy – Numerical computing

scikit-learn – ML model training, metrics & evaluation

sklearn.model_selection (train/test split, validation)

sklearn.metrics (classification metrics)

joblib – Saving & loading trained ML models

matplotlib.pyplot – Visualization of trends & anomalies

statsmodels.tsa.arima.model – ARIMA models for time series forecasting

## 🚀 Getting Started  

### 1️⃣ Clone the repository  
```bash
git clone https://github.com/epixcoding/SEBI25.git
cd SEBI25
2️⃣ Setup Backend (Node.js + Python ML)
🔹 Node.js Server Setup
bash
Copy code
cd backend/src
npm install
node app.js
🔹 Python Environment Setup
Install required Python libraries for AI/ML models:

bash
Copy code
pip install yfinance pandas joblib numpy scikit-learn matplotlib statsmodels
Library Usage in Backend

yfinance → Fetch stock market & financial data in real time

pandas → Clean, preprocess, and structure datasets

numpy → Numerical computations for ML pipelines

joblib → Save and load ML models efficiently

scikit-learn (model_selection, metrics) → Train/test split, evaluation metrics for fraud detection models

matplotlib.pyplot → Visualize anomalies, fraud trends, and patterns

statsmodels.tsa.arima.model → Time-series forecasting using ARIMA models (market trend prediction)

3️⃣ Setup Frontend
Open frontend/pages/analys.html in a browser.

4️⃣ Run AI/ML Models
bash
Copy code
cd ai-ml/src
python fraud_model.py
yaml
Copy code

---

⚡ Now the backend setup **clearly shows how to install dependencies** and **how each library is used** → this will impress judges because it demonstrates clarity and modularity.  

Do you want me to **reinsert this updated section into the full README** so you have one clean final versio

🧪 Usage

Run backend server  → serves APIs for fraud detection.

Use frontend  → interact with analysis dashboard.

AI/ML scripts → run training & inference to detect anomalies.

📌 Problem Statement

As per SEBI Hackathon 2025, the challenge is to:

“Build innovative solutions leveraging AI/ML and data science to detect, prevent, and analyze fraud in the securities market, ensuring market integrity and protecting investors.”

Our prototype addresses fraudulent trading detection, fake hype identification, and preventive monitoring.

👥 Team Members

Ayush Kumar[TEAM LEADER]
Rajib Chowdhury
Arpit Anand
Jayant Raj Verma
Saurav Kumar


🔮 Future Scope

Integration with SEBI APIs for real-time fraud detection.

Scalable deployment on cloud (Fast Api/Render/Vercel)

Visualization dashboards with live alerts.
