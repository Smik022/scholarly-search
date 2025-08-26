from django.urls import path
from .views import search_articles  # import the function-based view

urlpatterns = [
    path('search/', search_articles, name='search_articles'),
]
