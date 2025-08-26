import requests
from rest_framework.response import Response
from rest_framework.views import APIView


class ScholarlySearchView(APIView):
    def get(self, request):
        query = request.GET.get("q", None)
        if not query:
            return Response({"error": "Please provide a search query (?q=...)"}, status=400)

        url = "https://api.semanticscholar.org/graph/v1/paper/search"
        params = {
            "query": query,
            "limit": 5,
            "fields": "title,authors,year,url"
        }

        try:
            r = requests.get(url, params=params, timeout=10)  # timeout prevents hanging
            r.raise_for_status()  # raise error for 4xx/5xx
        except requests.exceptions.Timeout:
            return Response({"error": "Request timed out. Please try again."}, status=504)
        except requests.exceptions.RequestException as e:
            return Response({"error": f"Request failed: {str(e)}"}, status=500)

        data = r.json().get("data", [])

        if not data:
            return Response({"results": [], "message": "No scholarly articles found."})

        results = []
        for item in data:
            results.append({
                "title": item.get("title"),
                "year": item.get("year"),
                "url": item.get("url"),
                "authors": [a.get("name") for a in item.get("authors", [])]
            })

        return Response({"results": results})
