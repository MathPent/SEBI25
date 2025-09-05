document.addEventListener("DOMContentLoaded", () => {
  const newsContainer = document.getElementById("news-container");
  const statusMessage = document.getElementById("status-message");
  const updateStatus = document.getElementById("update-status");
  const skeletons = document.querySelectorAll(".loading-skeleton");

  // This API URL uses a free RSS-to-JSON converter to get data from Google News.
  const NEWS_API_URL =
    "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fnews.google.com%2Frss%2Fsearch%3Fq%3Dindia%2Bstock%2Bmarket%2Bwhen%3A1d%26hl%3Den-IN%26gl%3DIN%26ceid%3DIN%3Aen";

  // Keywords used by our "AI" to detect potential hype or manipulation.
  const HIGH_HYPE_KEYWORDS = [
    "rocket",
    "to the moon",
    "guaranteed",
    "10x",
    "huge pump",
    "must buy",
    "unstoppable",
    "explosive",
    "massive gains",
  ];
  const MEDIUM_HYPE_KEYWORDS = [
    "don't miss",
    "big move",
    "hot stock",
    "soaring",
    "breakout",
    "surge",
  ];

  function getHypeLevel(article) {
    const title = article.title.toLowerCase();
    if (HIGH_HYPE_KEYWORDS.some((keyword) => title.includes(keyword))) {
      return { level: "High", class: "high" };
    }
    if (MEDIUM_HYPE_KEYWORDS.some((keyword) => title.includes(keyword))) {
      return { level: "Medium", class: "medium" };
    }
    return null; // No hype detected
  }

  async function fetchAndDisplayNews() {
    try {
      skeletons.forEach((s) => (s.style.display = "block"));
      statusMessage.classList.add("hidden");
      newsContainer.classList.remove("hidden");
      newsContainer.innerHTML = ""; // Clear previous results before showing skeletons

      const response = await fetch(NEWS_API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      if (data.status === "ok" && data.items.length > 0) {
        // **MODIFIED LOGIC**: We no longer filter. We process and display ALL articles.
        const allArticles = data.items.map((article) => ({
          ...article,
          hype: getHypeLevel(article),
        }));
        displayNews(allArticles);
      } else {
        showStatus(
          "Could not retrieve news articles at the moment. Please try again later."
        );
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      showStatus(
        "Failed to load news. Please check your connection and try again."
      );
    } finally {
      skeletons.forEach((s) => (s.style.display = "none"));
    }
  }

  function displayNews(articles) {
    newsContainer.innerHTML = ""; // Clear skeletons
    let hypeCount = 0;

    articles.forEach((article) => {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = article.description;
      const snippet = tempDiv.textContent.split(".")[0] + ".";
      const source =
        article.author || new URL(article.link).hostname.replace("www.", "");

      // **MODIFIED LOGIC**: Conditionally create the hype badge HTML.
      let hypeIndicatorHTML = "";
      if (article.hype) {
        hypeIndicatorHTML = `<div class="hype-indicator ${article.hype.class}">${article.hype.level} Hype</div>`;
        hypeCount++;
      }

      const newsCard = `
                        <a href="${
                          article.link
                        }" target="_blank" rel="noopener noreferrer" class="card news-card">
                            ${hypeIndicatorHTML}
                            <img src="${
                              article.thumbnail
                            }" alt="News image for ${
        article.title
      }" onerror="this.src='https://placehold.co/600x400/161b22/8b949e?text=Image+Not+Found'">
                            <div class="news-card-content">
                                <h4>${article.title}</h4>
                                <p>${snippet}</p>
                                <div class="news-card-footer">
                                    <span>${source}</span>
                                    <span>${new Date(
                                      article.pubDate
                                    ).toLocaleDateString("en-IN")}</span>
                                </div>
                            </div>
                        </a>
                    `;
      newsContainer.insertAdjacentHTML("beforeend", newsCard);
    });

    // Update the status text based on what was found.
    if (hypeCount > 0) {
      updateStatus.textContent = `Scan complete. Found ${hypeCount} article(s) with potential hype.`;
    } else {
      updateStatus.textContent = `Scan complete. No significant market hype detected. All clear!`;
    }
  }

  function showStatus(message) {
    newsContainer.classList.add("hidden");
    statusMessage.textContent = message;
    statusMessage.classList.remove("hidden");
  }

  // Fetch news on page load and then rescan every 10 minutes.
  fetchAndDisplayNews();
  setInterval(fetchAndDisplayNews, 10 * 60 * 1000);
});
