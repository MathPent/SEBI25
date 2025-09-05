🌟 Key Features

🔍 Fraud Detection Models – Identify suspicious stock market activities.

📈 Market Hype Analysis – Detect fake news, misinformation, and hype creation.

🛡 Prevention Framework – Tools to monitor and flag abnormal trading behavior.

🖥 Interactive Frontend – Simple HTML/CSS/JS interface for analysis and reporting.

📂 Modular Backend – Node.js + Python ML models integrated with structured database.

🏗️ Project Structure
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

Frontend: HTML, CSS, JavaScript

Backend: Node.js, Express.js

AI/ML: Python, Scikit-learn / TensorFlow (fraud detection models)

Database: SQL / NoSQL (structured for transaction logs & fraud flags)


🚀 Getting Started
1️⃣ Clone the repository
git clone https://github.com/epixcoding/SEBI25.git
cd SEBI25

2️⃣ Setup Backend
cd backend/src
npm install
node app.js

3️⃣ Setup Frontend

Open frontend/pages/analys.html in a browser.

4️⃣ AI/ML Models
cd ai-ml/src
python fraud_model.py

🧪 Usage

Run backend server (app.js) → serves APIs for fraud detection.

Use frontend (analys.html, fakehype.html) → interact with analysis dashboard.

AI/ML scripts → run training & inference to detect anomalies.

📌 Problem Statement

As per SEBI Hackathon 2025, the challenge is to:

“Build innovative solutions leveraging AI/ML and data science to detect, prevent, and analyze fraud in the securities market, ensuring market integrity and protecting investors.”

Our prototype addresses fraudulent trading detection, fake hype identification, and preventive monitoring.

👥 Team Members

Ayush Kumar

Rajib Chowdhury

[Add rest of your teammates here]

🔮 Future Scope

Integration with SEBI APIs for real-time fraud detection.

Scalable deployment on cloud (AWS/GCP).

Visualization dashboards with live alerts.

📜 License

This project is licensed under the MIT License.
