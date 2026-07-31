from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Recommendation
from .serializers import RecommendationSerializer
from products.models import Product
from products.serializers import ProductSerializer

class RecommendationListView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        product_id = request.query_params.get('product_id')
        rec_type = request.query_params.get('type')

        recs = Recommendation.objects.all()
        if product_id:
            recs = recs.filter(product_id=product_id)
        if rec_type:
            recs = recs.filter(rec_type=rec_type)

        # Fallback AI dynamic generation if DB records empty
        if not recs.exists():
            products = list(Product.objects.all())
            if len(products) >= 2:
                p1, p2 = products[0], products[1]
                return Response({
                    "frequently_bought_together": [ProductSerializer(p2).data],
                    "similar_products": [ProductSerializer(p).data for p in products[1:4]],
                    "personalized": [ProductSerializer(p).data for p in products[:3]]
                })

        frequently_bought = [r.recommended_product for r in recs.filter(rec_type=Recommendation.Type.FREQUENTLY_BOUGHT)[:6]]
        similar = [r.recommended_product for r in recs.filter(rec_type=Recommendation.Type.SIMILAR)[:6]]
        personalized = [r.recommended_product for r in recs.filter(rec_type=Recommendation.Type.PERSONALIZED)[:6]]

        return Response({
            "frequently_bought_together": ProductSerializer(frequently_bought, many=True).data,
            "similar_products": ProductSerializer(similar, many=True).data,
            "personalized": ProductSerializer(personalized, many=True).data
        })
