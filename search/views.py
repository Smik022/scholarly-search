from rest_framework.decorators import api_view
from rest_framework.response import Response
import requests

@api_view(['GET'])
def search_articles(request):
    query = request.GET.get('q', '')
    results = []

    if not query:
        return Response({"results": []})

    try:
        # OpenAlex API
        res = requests.get(
            "https://api.openalex.org/works",
            params={"search": query, "per-page": 20},
            timeout=10
        )
        data = res.json()

        results = []
        for item in data.get("results", []):
            # Some items may not have authors
            authors = [
                a.get("author", {}).get("display_name")
                for a in item.get("authorships", [])
            ]
            results.append({
                "title": item.get("title"),
                "authors": authors,
                "year": item.get("publication_year"),
                "url": item.get("id"),
                "source": "OpenAlex"
            })

    except Exception as e:
        print("OpenAlex error:", e)

    return Response({"results": results})
