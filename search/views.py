import requests
from rest_framework.views import APIView
from rest_framework.response import Response

class ScholarlySearchView(APIView):
    def get(self, request):
        query = request.GET.get("q", None)
        if not query:
            return Response({"error": "Please provide a search query (?q=...)"}, status=400)

        url = "https://api.openalex.org/works"
        params = {
            "search": query,
            "per-page": 10,  # number of results
        }

        try:
            r = requests.get(url, params=params, timeout=10)
            r.raise_for_status()
            data = r.json().get("results", [])
        except requests.exceptions.RequestException as e:
            return Response({"error": "Failed to fetch from OpenAlex API.", "details": str(e)}, status=500)

        results = []
        for item in data:
            results.append({
                "title": item.get("title"),
                "year": item.get("publication_year"),
                "url": item.get("id"),  # OpenAlex works URL
                "authors": [auth.get("author", {}).get("display_name") for auth in item.get("authorships", [])] if item.get("authorships") else []
            })

        return Response({"results": results})
