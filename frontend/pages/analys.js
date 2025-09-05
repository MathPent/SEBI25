document.addEventListener("DOMContentLoaded", () => {
  // Select all necessary DOM elements for the results page
  const resultsContent = document.getElementById("results-content");
  const loadingSpinner = document.getElementById("loading-spinner");
  const errorMessage = document.getElementById("error-message");
  const invalidTickerText = document.getElementById("invalid-ticker-text");
  const gaugeBar = document.getElementById("gauge-bar");
  const gaugeText = document.getElementById("gauge-text");
  const resultTicker = document.getElementById("result-ticker");
  const tweetContainer = document.getElementById("tweet-container");
  const chartCanvas = document.getElementById("historical-chart");
  let historicalChartInstance = null;

  // --- Core Logic: Get ticker from URL and run analysis ---
  const urlParams = new URLSearchParams(window.location.search);
  const ticker = urlParams.get("ticker"); // e.g., gets "RELIANCE" from "?ticker=RELIANCE"

  if (ticker) {
    // If a ticker is found in the URL, run the analysis
    mockApiCall(ticker).then((data) => {
      loadingSpinner.classList.add("hidden");
      resultsContent.classList.remove("hidden");
      displayResults(data);
    });
  } else {
    // If no ticker is found, show an error
    invalidTickerText.textContent = "No Stock Provided";
    loadingSpinner.classList.add("hidden");
    errorMessage.classList.remove("hidden");
  }

  // --- All the functions to display results ---
  function displayResults(data) {
    resultTicker.textContent = data.ticker;
    const riskScore = data.riskScore;
    gaugeText.textContent = riskScore;
    let colorClass = "var(--color-success)";
    if (riskScore > 40) colorClass = "var(--color-warning)";
    if (riskScore > 70) colorClass = "var(--color-danger)";
    // We use a short timeout to allow the element to be visible before animating
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
      // Highlight the keywords found in the post
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
    // Destroy the previous chart instance if it exists to prevent rendering issues
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

  // This is the dynamic mock API call from the previous version
  function mockApiCall(ticker) {
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
