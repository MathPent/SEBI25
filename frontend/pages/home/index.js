/**
 * =================================================================
 * Social Sentinel - Frontend JavaScript
 * =================================================================
 * This file contains all the client-side logic for the Social
 * Sentinel website. It handles user interactions, API calls (mocked),
 * and dynamic updates to the user interface.
 * =================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  /**
   * -------------------------------------------------------------
   * DOM Element Selection
   * -------------------------------------------------------------
   */
  const form = document.getElementById("analysis-form");
  const tickerInput = document.getElementById("ticker-input");
  const suggestionsContainer = document.getElementById("suggestions-container");
  const resultsSection = document.getElementById("results-section");
  const loadingSpinner = document.getElementById("loading-spinner");
  const resultsContent = document.getElementById("results-content");
  const errorMessage = document.getElementById("error-message");
  const invalidTickerText = document.getElementById("invalid-ticker-text");
  const gaugeBar = document.getElementById("gauge-bar");
  const gaugeText = document.getElementById("gauge-text");
  const resultTicker = document.getElementById("result-ticker");
  const tweetContainer = document.getElementById("tweet-container");
  const chartCanvas = document.getElementById("historical-chart");

  let historicalChartInstance = null;

  /**
   * -------------------------------------------------------------
   * Stock Data (Mock Database) - EXPANDED
   * -------------------------------------------------------------
   */
  const stockData = [
    // NIFTY 50
    { ticker: "RELIANCE", name: "Reliance Industries Ltd." },
    { ticker: "TCS", name: "Tata Consultancy Services Ltd." },
    { ticker: "HDFCBANK", name: "HDFC Bank Ltd." },
    { ticker: "INFY", name: "Infosys Ltd." },
    { ticker: "ICICIBANK", name: "ICICI Bank Ltd." },
    { ticker: "HINDUNILVR", name: "Hindustan Unilever Ltd." },
    { ticker: "SBIN", name: "State Bank of India" },
    { ticker: "BAJFINANCE", name: "Bajaj Finance Ltd." },
    { ticker: "BHARTIARTL", name: "Bharti Airtel Ltd." },
    { ticker: "KOTAKBANK", name: "Kotak Mahindra Bank Ltd." },
    { ticker: "WIPRO", name: "Wipro Ltd." },
    { ticker: "HCLTECH", name: "HCL Technologies Ltd." },
    { ticker: "ASIANPAINT", name: "Asian Paints Ltd." },
    { ticker: "ITC", name: "ITC Ltd." },
    { ticker: "LT", name: "Larsen & Toubro Ltd." },
    { ticker: "MARUTI", name: "Maruti Suzuki India Ltd." },
    { ticker: "AXISBANK", name: "Axis Bank Ltd." },
    { ticker: "ULTRACEMCO", name: "UltraTech Cement Ltd." },
    { ticker: "TATAMOTORS", name: "Tata Motors Ltd." },
    { ticker: "TATASTEEL", name: "Tata Steel Ltd." },
    { ticker: "JSWSTEEL", name: "JSW Steel Ltd." },
    { ticker: "SUNPHARMA", name: "Sun Pharmaceutical Industries Ltd." },
    { ticker: "TECHM", name: "Tech Mahindra Ltd." },
    { ticker: "POWERGRID", name: "Power Grid Corporation of India Ltd." },
    { ticker: "NTPC", name: "NTPC Ltd." },
    { ticker: "M&M", name: "Mahindra & Mahindra Ltd." },
    // Additional prominent stocks
    { ticker: "ZOMATO", name: "Zomato Ltd." },
    { ticker: "PAYTM", name: "One97 Communications Ltd." },
    {
      ticker: "IRCTC",
      name: "Indian Railway Catering And Tourism Corporation Ltd.",
    },
    { ticker: "ADANIENT", name: "Adani Enterprises Ltd." },
    {
      ticker: "ADANIPORTS",
      name: "Adani Ports and Special Economic Zone Ltd.",
    },
    { ticker: "TITAN", name: "Titan Company Ltd." },
    { ticker: "DMART", name: "Avenue Supermarts Ltd." },
    { ticker: "PIDILITIND", name: "Pidilite Industries Ltd." },
    { ticker: "BAJAJFINSV", name: "Bajaj Finserv Ltd." },
    { ticker: "NESTLEIND", name: "Nestle India Ltd." },
    { ticker: "INDIGO", name: "InterGlobe Aviation Ltd." },
    { ticker: "DLF", name: "DLF Ltd." },
    { ticker: "HDFCLIFE", name: "HDFC Life Insurance Company Ltd." },
    { ticker: "SBILIFE", name: "SBI Life Insurance Company Ltd." },
    { ticker: "CIPLA", name: "Cipla Ltd." },
    { ticker: "DRREDDY", name: "Dr. Reddy's Laboratories Ltd." },
    { ticker: "IOC", name: "Indian Oil Corporation Ltd." },
    { ticker: "BPCL", name: "Bharat Petroleum Corporation Ltd." },
    { ticker: "COALINDIA", name: "Coal India Ltd." },
    { ticker: "ONGC", name: "Oil & Natural Gas Corporation Ltd." },
  ];

  /**
   * -------------------------------------------------------------
   * Event Listeners
   * -------------------------------------------------------------
   */

  form.addEventListener("submit", handleAnalysis);
  tickerInput.addEventListener("input", handleInputChange);

  window.addEventListener("click", (event) => {
    if (!event.target.closest("#tool")) {
      suggestionsContainer.classList.add("hidden");
    }
  });

  /**
   * =================================================================
   * Core Functions
   * =================================================================
   */

  function handleInputChange(event) {
    const query = event.target.value.toLowerCase();
    if (query.length < 2) {
      suggestionsContainer.classList.add("hidden");
      return;
    }
    const filteredStocks = stockData.filter(
      (stock) =>
        stock.ticker.toLowerCase().includes(query) ||
        stock.name.toLowerCase().includes(query)
    );
    renderSuggestions(filteredStocks);
  }

  function renderSuggestions(suggestions) {
    if (suggestions.length === 0) {
      suggestionsContainer.classList.add("hidden");
      return;
    }
    const suggestionsHTML = suggestions
      .map(
        (stock) => `
                    <div class="suggestion-item" data-ticker="${stock.ticker}" data-name="${stock.name}">
                        <p class="ticker">${stock.ticker}</p>
                        <p class="name">${stock.name}</p>
                    </div>
                `
      )
      .join("");
    suggestionsContainer.innerHTML = suggestionsHTML;
    suggestionsContainer.classList.remove("hidden");

    document.querySelectorAll(".suggestion-item").forEach((item) => {
      item.addEventListener("click", () => {
        tickerInput.value = item.dataset.ticker;
        suggestionsContainer.classList.add("hidden");
        form.dispatchEvent(new Event("submit"));
      });
    });
  }

  function handleAnalysis(event) {
    event.preventDefault();
    const query = tickerInput.value.trim();
    if (!query) return;

    const validStock = stockData.find(
      (stock) =>
        stock.ticker.toLowerCase() === query.toLowerCase() ||
        stock.name.toLowerCase() === query.toLowerCase()
    );

    suggestionsContainer.classList.add("hidden");
    resultsSection.classList.remove("hidden");

    resultsContent.classList.add("hidden");
    errorMessage.classList.add("hidden");
    loadingSpinner.classList.add("hidden");

    if (!validStock) {
      invalidTickerText.textContent = query;
      errorMessage.classList.remove("hidden");
      return;
    }

    loadingSpinner.classList.remove("hidden");

    mockApiCall(validStock.ticker).then((data) => {
      loadingSpinner.classList.add("hidden");
      resultsContent.classList.remove("hidden");
      displayResults(data);
    });
    function mockApiCall(ticker) {
      // --- Start of New Dynamic Mocking Logic ---
      const mockAuthors = [
        "StockGuru42",
        "DiamondHandz",
        "MarketMover",
        "BullRider",
        "FinWizard",
        "SecretScout",
      ];
      const mockKeywords = {
        hype: [
          "to the moon",
          "10x gains",
          "unbelievable",
          "HUGE news",
          "rocket 🚀",
        ],
        urgency: [
          "act fast",
          "don't miss out",
          "buy now",
          "last chance",
          "imminent",
        ],
        guarantee: [
          "guaranteed returns",
          "zero risk",
          "a sure thing",
          "cannot fail",
          "easy money",
        ],
      };
      const mockPlatforms = ["Twitter", "Telegram", "Facebook", "Instagram"];

      function getRandomElement(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
      }

      function generateSuspiciousPost(ticker) {
        const keywords = [
          getRandomElement(mockKeywords.hype),
          getRandomElement(mockKeywords.urgency),
          getRandomElement(mockKeywords.guarantee),
        ];
        const text = `Big news for ${ticker}! I'm seeing signals for ${keywords[0]}. You need to ${keywords[1]} on this. It's practically ${keywords[2]}!`;
        return {
          platform: getRandomElement(mockPlatforms),
          author:
            getRandomElement(mockAuthors) + Math.floor(Math.random() * 100),
          timestamp: new Date(
            Date.now() - Math.random() * 24 * 60 * 60 * 1000
          ).toISOString(),
          text: text,
          keywords: keywords,
        };
      }
      // --- End of New Dynamic Mocking Logic ---

      // Deterministic risk score based on ticker string
      function hashStringToScore(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
          hash = (hash << 5) - hash + str.charCodeAt(i);
          hash |= 0; // Convert to 32bit integer
        }
        // Normalize hash to 10-95 range
        const score = 10 + (Math.abs(hash) % 86);
        return score;
      }

      return new Promise((resolve) => {
        setTimeout(() => {
          const riskScore = hashStringToScore(ticker);
          const historicalData = {
            labels: [],
            riskScores: [],
            socialVolumes: [],
          };
          for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            historicalData.labels.push(
              d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })
            );
            // For historical risk scores, you can keep some randomness or also make deterministic if needed
            historicalData.riskScores.push(Math.floor(Math.random() * 60) + 10);
            historicalData.socialVolumes.push(
              Math.floor(Math.random() * 5000) + 500
            );
          }
          historicalData.riskScores[6] = riskScore;
          historicalData.socialVolumes[6] =
            Math.floor(Math.random() * 8000) + 2000;

          // Generate a variable number of unique posts
          const numberOfPosts = Math.ceil(riskScore / 33);
          const suspiciousPosts = [];
          if (riskScore > 40) {
            for (let i = 0; i < numberOfPosts; i++) {
              suspiciousPosts.push(generateSuspiciousPost(ticker));
            }
          }

          const mockData = {
            ticker: ticker,
            riskScore: riskScore,
            historicalData: historicalData,
            suspiciousPosts: suspiciousPosts,
          };

          resolve(mockData);
        }, 1500);
      });
    }
  }

  function displayResults(data) {
    resultTicker.textContent = data.ticker;
    const riskScore = data.riskScore;
    gaugeText.textContent = riskScore;

    let colorClass = "var(--color-success)";
    if (riskScore > 40) colorClass = "var(--color-warning)";
    if (riskScore > 70) colorClass = "var(--color-danger)";

    setTimeout(() => {
      gaugeBar.style.width = `${riskScore}%`;
      gaugeBar.style.backgroundColor = colorClass;
    }, 100);

    renderHistoricalChart(data.historicalData);

    tweetContainer.innerHTML = "";
    if (data.suspiciousPosts.length > 0) {
      const tweetHeader = document.createElement("h5");
      tweetHeader.className = "tweet-header";
      tweetHeader.textContent = "Flagged Social Media Posts:";
      tweetContainer.appendChild(tweetHeader);
    }

    data.suspiciousPosts.forEach((post) => {
      const postCard = document.createElement("div");
      postCard.className = "card post-card";

      let highlightedText = post.text;
      post.keywords.forEach((keyword) => {
        const regex = new RegExp(`(${keyword})`, "gi");
        highlightedText = highlightedText.replace(
          regex,
          `<span class="keyword">$1</span>`
        );
      });

      postCard.innerHTML = `
                        <div class="post-icon">${getPlatformIcon(
                          post.platform
                        )}</div>
                        <div class="post-content">
                            <div class="post-header">
                                <p class="post-author">@${post.author}</p>
                                <span class="post-timestamp">${new Date(
                                  post.timestamp
                                ).toLocaleString()}</span>
                            </div>
                            <p class="post-text">${highlightedText}</p>
                        </div>
                    `;
      tweetContainer.appendChild(postCard);
    });
  }

  function renderHistoricalChart(data) {
    if (historicalChartInstance) {
      historicalChartInstance.destroy();
    }

    const ctx = chartCanvas.getContext("2d");
    historicalChartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: data.labels,
        datasets: [
          {
            label: "Risk Score",
            data: data.riskScores,
            borderColor: "var(--color-primary)",
            backgroundColor: "rgba(59, 130, 246, 0.1)",
            fill: true,
            tension: 0.4,
            yAxisID: "y",
          },
          {
            label: "Social Volume",
            data: data.socialVolumes,
            borderColor: "var(--color-text-secondary)",
            borderDash: [5, 5],
            tension: 0.4,
            yAxisID: "y1",
          },
        ],
      },
      options: {
        responsive: true,
        interaction: { mode: "index", intersect: false },
        scales: {
          y: {
            type: "linear",
            display: true,
            position: "left",
            max: 100,
            min: 0,
            grid: { color: "rgba(255, 255, 255, 0.1)" },
            ticks: { color: "var(--color-text-secondary)" },
          },
          y1: {
            type: "linear",
            display: true,
            position: "right",
            grid: { drawOnChartArea: false },
            ticks: { color: "var(--color-text-secondary)" },
          },
          x: {
            grid: { color: "rgba(255, 255, 255, 0.05)" },
            ticks: { color: "var(--color-text-secondary)" },
          },
        },
        plugins: {
          legend: { labels: { color: "var(--color-text-secondary)" } },
        },
      },
    });
  }

  function getPlatformIcon(platform) {
    switch (platform.toLowerCase()) {
      case "twitter":
        return "🐦";
      case "facebook":
        return "📘";
      case "telegram":
        return "✈️";
      case "instagram":
        return "📸";
      default:
        return "🌐";
    }
  }

  /**
   * -------------------------------------------------------------
   * mockApiCall(ticker) - UPDATED TO BE DYNAMIC
   * -------------------------------------------------------------
   * This function now generates unique, random data for each call
   * to make the prototype feel more realistic.
   */
  function mockApiCall(ticker) {
    // --- Start of New Dynamic Mocking Logic ---
    const mockAuthors = [
      "StockGuru42",
      "DiamondHandz",
      "MarketMover",
      "BullRider",
      "FinWizard",
      "SecretScout",
    ];
    const mockKeywords = {
      hype: [
        "to the moon",
        "10x gains",
        "unbelievable",
        "HUGE news",
        "rocket 🚀",
      ],
      urgency: [
        "act fast",
        "don't miss out",
        "buy now",
        "last chance",
        "imminent",
      ],
      guarantee: [
        "guaranteed returns",
        "zero risk",
        "a sure thing",
        "cannot fail",
        "easy money",
      ],
    };
    const mockPlatforms = ["Twitter", "Telegram", "Facebook", "Instagram"];

    function getRandomElement(arr) {
      return arr[Math.floor(Math.random() * arr.length)];
    }

    function generateSuspiciousPost(ticker) {
      const keywords = [
        getRandomElement(mockKeywords.hype),
        getRandomElement(mockKeywords.urgency),
        getRandomElement(mockKeywords.guarantee),
      ];
      const text = `Big news for ${ticker}! I'm seeing signals for ${keywords[0]}. You need to ${keywords[1]} on this. It's practically ${keywords[2]}!`;
      return {
        platform: getRandomElement(mockPlatforms),
        author: getRandomElement(mockAuthors) + Math.floor(Math.random() * 100),
        timestamp: new Date(
          Date.now() - Math.random() * 24 * 60 * 60 * 1000
        ).toISOString(),
        text: text,
        keywords: keywords,
      };
    }
    // --- End of New Dynamic Mocking Logic ---

    return new Promise((resolve) => {
      setTimeout(() => {
        const riskScore = Math.floor(Math.random() * 85) + 10;
        const historicalData = {
          labels: [],
          riskScores: [],
          socialVolumes: [],
        };
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          historicalData.labels.push(
            d.toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
            })
          );
          historicalData.riskScores.push(Math.floor(Math.random() * 60) + 10);
          historicalData.socialVolumes.push(
            Math.floor(Math.random() * 5000) + 500
          );
        }
        historicalData.riskScores[6] = riskScore;
        historicalData.socialVolumes[6] =
          Math.floor(Math.random() * 8000) + 2000;

        // Generate a variable number of unique posts
        const numberOfPosts = Math.ceil(riskScore / 33);
        const suspiciousPosts = [];
        if (riskScore > 40) {
          for (let i = 0; i < numberOfPosts; i++) {
            suspiciousPosts.push(generateSuspiciousPost(ticker));
          }
        }

        const mockData = {
          ticker: ticker,
          riskScore: riskScore,
          historicalData: historicalData,
          suspiciousPosts: suspiciousPosts,
        };

        resolve(mockData);
      }, 1500);
    });
  }
});
//This is the news section js//
document.addEventListener("DOMContentLoaded", () => {
  const newsContainer = document.getElementById("news-container");

  async function fetchStockNews() {
    try {
      // Using NewsAPI (https://newsapi.org) - you’ll need a free API key
      const apiKey = "YOUR_NEWSAPI_KEY";
      const url = `https://newsapi.org/v2/everything?q=stock%20market&language=en&sortBy=publishedAt&pageSize=6&apiKey=${apiKey}`;

      const response = await fetch(url);
      const data = await response.json();

      if (data.articles && data.articles.length > 0) {
        renderNews(data.articles);
      } else {
        newsContainer.innerHTML = `<p>No news available at the moment.</p>`;
      }
    } catch (error) {
      console.error(error);
      newsContainer.innerHTML = `<p class="error">⚠️ Failed to load news. Try again later.</p>`;
    }
  }

  function renderNews(articles) {
    const newsHTML = articles
      .map(
        (article) => `
          <div class="news-card">
            <h4>${article.title}</h4>
            <p>${article.description || ""}</p>
            <a href="${article.url}" target="_blank">Read More →</a>
          </div>
        `
      )
      .join("");
    newsContainer.innerHTML = newsHTML;
  }

  fetchStockNews();
});
