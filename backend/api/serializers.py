from rest_framework import serializers


class FigureSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=200)
    title = serializers.CharField(max_length=200)
    era = serializers.CharField(max_length=100)
    personality = serializers.CharField(max_length=2000)


class GenerateRequestSerializer(serializers.Serializer):
    figure = FigureSerializer()
    headline = serializers.CharField(max_length=500)
    language = serializers.ChoiceField(choices=["fr", "en"], default="fr", required=False)


class FigureWithIdSerializer(serializers.Serializer):
    id = serializers.CharField(max_length=100)
    name = serializers.CharField(max_length=200)
    title = serializers.CharField(max_length=200)
    era = serializers.CharField(max_length=100)
    personality = serializers.CharField(max_length=2000)


class GenerateBestRequestSerializer(serializers.Serializer):
    headline = serializers.CharField(max_length=500)
    figures = FigureWithIdSerializer(many=True)
    language = serializers.ChoiceField(choices=["fr", "en"], default="fr", required=False)


class ArticleSourceSerializer(serializers.Serializer):
    name = serializers.CharField()


class ArticleSerializer(serializers.Serializer):
    title = serializers.CharField()
    source = ArticleSourceSerializer()
    url = serializers.URLField()
    publishedAt = serializers.CharField()


class NewsResponseSerializer(serializers.Serializer):
    articles = ArticleSerializer(many=True)


class GenerateResponseSerializer(serializers.Serializer):
    hotTake = serializers.CharField()


class ErrorSerializer(serializers.Serializer):
    error = serializers.CharField()
    details = serializers.CharField(required=False)
