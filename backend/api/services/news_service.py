import logging
import requests
from django.conf import settings
from typing import TypedDict, List

logger = logging.getLogger(__name__)


class ArticleSource(TypedDict):
    name: str


class Article(TypedDict):
    title: str
    source: ArticleSource
    url: str
    publishedAt: str


class NewsService:
    """Service for fetching news from NewsAPI."""

    BASE_URL = "https://newsapi.org/v2/top-headlines"

    def __init__(self):
        self.api_key = settings.NEWS_API_KEY

    def fetch_headlines(
        self,
        category: str = "general",
        country: str = "us",
        page_size: int = 20
    ) -> List[Article]:
        """
        Fetch top headlines from NewsAPI.

        Returns filtered articles (removes [Removed] titles).
        """
        if not self.api_key:
            logger.error("NEWS_API_KEY not configured")
            raise ValueError("NEWS_API_KEY not configured")

        params = {
            "country": country,
            "category": category,
            "pageSize": page_size,
            "apiKey": self.api_key,
        }

        logger.info(f"Fetching news: category={category}, country={country}")

        try:
            response = requests.get(self.BASE_URL, params=params, timeout=10)
            response.raise_for_status()
            data = response.json()

            if data.get("status") != "ok":
                error_msg = data.get("message", "Unknown NewsAPI error")
                logger.error(f"NewsAPI error: {error_msg}")
                raise ValueError(f"NewsAPI error: {error_msg}")

            # Filter and transform articles
            articles: List[Article] = []
            for article in data.get("articles", []):
                title = article.get("title")
                if title and title != "[Removed]":
                    articles.append({
                        "title": title,
                        "source": {"name": article.get("source", {}).get("name", "Unknown")},
                        "url": article.get("url", ""),
                        "publishedAt": article.get("publishedAt", ""),
                    })

            logger.info(f"Fetched {len(articles)} articles")
            return articles

        except requests.RequestException as e:
            logger.error(f"Failed to fetch news: {e}")
            raise ValueError(f"Failed to fetch news: {str(e)}")
