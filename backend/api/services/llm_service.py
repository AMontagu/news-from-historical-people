import logging
from django.conf import settings
from langchain_google_genai import ChatGoogleGenerativeAI
from typing import TypedDict

logger = logging.getLogger(__name__)


class FigureData(TypedDict):
    name: str
    title: str
    era: str
    personality: str


class LLMService:
    """Service for generating hot takes using Google Gemini via LangChain."""

    PROMPT_TEMPLATE = """You are {name}, the famous {title} from {era}.
You have just been told about this modern news headline: "{headline}"

Your personality: {personality}

React to this news as if you were really {name}. Be:
- Anachronistic (interpret through your historical lens)
- Funny and witty
- In character (use speech patterns fitting your era)
- Brief (2-3 sentences max)

{language_instruction}

Your hot take:"""

    def __init__(self):
        self.api_key = settings.GOOGLE_API_KEY
        self._model = None

    @property
    def model(self) -> ChatGoogleGenerativeAI:
        """Lazy initialization of the LLM model."""
        if self._model is None:
            if not self.api_key:
                raise ValueError("GOOGLE_API_KEY not configured")

            self._model = ChatGoogleGenerativeAI(
                api_key=self.api_key,
                model="gemini-3-flash-preview",
                temperature=0.9,
            )
        return self._model

    def generate_hot_take(self, figure: FigureData, headline: str, language: str = "fr") -> str:
        """
        Generate a hot take from a historical figure about a news headline.

        Args:
            figure: Dictionary with name, title, era, personality
            headline: The news headline to react to
            language: Language code ('fr' or 'en'), defaults to 'fr'

        Returns:
            The generated hot take string
        """
        logger.info(f"Generating hot take for {figure['name']}: {headline[:50]}... (lang={language})")

        language_instruction = (
            "IMPORTANT: You MUST respond in French."
            if language == "fr"
            else "IMPORTANT: You MUST respond in English."
        )

        prompt = self.PROMPT_TEMPLATE.format(
            name=figure["name"],
            title=figure["title"],
            era=figure["era"],
            personality=figure["personality"],
            headline=headline,
            language_instruction=language_instruction,
        )

        try:
            response = self.model.invoke(prompt)
            hot_take = str(response.content)
            logger.info(f"Generated hot take: {len(hot_take)} chars")
            return hot_take

        except Exception as e:
            logger.error(f"Failed to generate hot take: {e}")
            raise ValueError(f"Failed to generate hot take: {str(e)}")

    def generate_dynamic_hot_take(self, headline: str, language: str = "fr") -> dict:
        """
        Let the LLM pick ANY historical figure it thinks would be funniest.

        Args:
            headline: The news headline
            language: Language code ('fr' or 'en')

        Returns:
            Dict with figure (name, title, era, avatar) and hotTake
        """
        import json
        import re

        logger.info(f"Generating dynamic hot take for: {headline[:50]}... (lang={language})")

        language_instruction = (
            "IMPORTANT: All text fields (name, title, hot_take) MUST be written in French."
            if language == "fr"
            else "IMPORTANT: All text fields (name, title, hot_take) MUST be written in English."
        )

        prompt = f"""You are a comedy writer. Given this news headline, think of the FUNNIEST historical figure who could react to it.

NEWS HEADLINE: "{headline}"

Your task:
1. Think of ANY historical figure from history whose personality/era would create the funniest contrast with this modern news
2. Be creative! Consider politicians, artists, scientists, warriors, philosophers, royalty, inventors, etc.
3. Write their reaction as that character (2-3 sentences, in their voice, anachronistic and witty)
4. Pick an appropriate emoji that represents this figure

{language_instruction}

Respond in this exact JSON format (no markdown, no code blocks):
{{"name": "Full Name", "title": "Their historical title", "era": "Birth-Death years", "avatar": "single emoji", "hot_take": "The funny reaction here"}}"""

        try:
            response = self.model.invoke(prompt)
            content = str(response.content)
            logger.info(f"Raw response: {content[:200]}")

            # Parse JSON from response
            json_match = re.search(r'\{[\s\S]*\}', content)
            if not json_match:
                raise ValueError("No JSON found in response")

            parsed = json.loads(json_match.group())

            figure = {
                "name": parsed.get("name"),
                "title": parsed.get("title"),
                "era": parsed.get("era"),
                "avatar": parsed.get("avatar", "🎭"),
            }
            hot_take = parsed.get("hot_take")

            logger.info(f"Generated figure: {figure['name']}")
            return {"figure": figure, "hotTake": hot_take}

        except Exception as e:
            logger.error(f"Failed to generate dynamic hot take: {e}")
            raise ValueError(f"Failed to generate dynamic hot take: {str(e)}")
