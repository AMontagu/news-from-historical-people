import logging
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response

from .serializers import GenerateRequestSerializer
from .services.news_service import NewsService
from .services.llm_service import LLMService

logger = logging.getLogger(__name__)


class NewsView(APIView):
    """
    GET /api/news

    Query params:
        - category: News category (default: "general")
        - country: Country code (default: "us")

    Returns:
        { articles: [{ title, source: { name }, url, publishedAt }] }
    """

    def get(self, request: Request) -> Response:
        category = request.query_params.get("category", "general")
        country = request.query_params.get("country", "us")

        logger.info(f"[api/news] Request: category={category}, country={country}")

        try:
            service = NewsService()
            articles = service.fetch_headlines(category=category, country=country)
            return Response({"articles": articles}, status=status.HTTP_200_OK)

        except ValueError as e:
            logger.error(f"[api/news] Error: {e}")
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class GenerateView(APIView):
    """
    POST /api/generate

    Request body:
        {
            figure: { name, title, era, personality },
            headline: string
        }

    Returns:
        { hotTake: string }
    """

    def post(self, request: Request) -> Response:
        serializer = GenerateRequestSerializer(data=request.data)

        if not serializer.is_valid():
            logger.error(f"[api/generate] Invalid request: {serializer.errors}")
            return Response(
                {"error": "Missing or invalid figure or headline"},
                status=status.HTTP_400_BAD_REQUEST
            )

        data = serializer.validated_data
        figure = data["figure"]
        headline = data["headline"]
        language = data.get("language", "fr")

        logger.info(f"[api/generate] Figure: {figure['name']}, Headline: {headline[:50]}, Language: {language}")

        try:
            service = LLMService()
            hot_take = service.generate_hot_take(figure, headline, language)
            return Response({"hotTake": hot_take}, status=status.HTTP_200_OK)

        except ValueError as e:
            logger.error(f"[api/generate] Error: {e}")
            return Response(
                {"error": "Failed to generate hot take", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


class GenerateBestView(APIView):
    """
    POST /api/generate-best

    Request body:
        {
            headline: string,
            language: "fr" | "en" (optional, default "fr")
        }

    Returns:
        { figure: { name, title, era, avatar }, hotTake: string }
    """

    def post(self, request: Request) -> Response:
        headline = request.data.get("headline")
        language = request.data.get("language", "fr")

        if not headline:
            logger.error("[api/generate-best] Missing headline")
            return Response(
                {"error": "Missing headline"},
                status=status.HTTP_400_BAD_REQUEST
            )

        logger.info(f"[api/generate-best] Headline: {headline[:50]}, Language: {language}")

        try:
            service = LLMService()
            result = service.generate_dynamic_hot_take(headline, language)
            return Response(result, status=status.HTTP_200_OK)

        except ValueError as e:
            logger.error(f"[api/generate-best] Error: {e}")
            return Response(
                {"error": "Failed to generate hot take", "details": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
