from django.urls import path
from . import views

urlpatterns = [
    path('news', views.NewsView.as_view(), name='news'),
    path('generate', views.GenerateView.as_view(), name='generate'),
    path('generate-best', views.GenerateBestView.as_view(), name='generate-best'),
]
