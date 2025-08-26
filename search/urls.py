from django.urls import path
from .views import ScholarlySearchView

urlpatterns = [
    path("search/", ScholarlySearchView.as_view(), name="scholarly-search"),
]
