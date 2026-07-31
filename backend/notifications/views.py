from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Notification
from .serializers import NotificationSerializer

class NotificationListView(generics.ListCreateAPIView):
    queryset = Notification.objects.all()
    serializer_class = NotificationSerializer
    permission_classes = [permissions.AllowAny]

class NotificationMarkReadView(APIView):
    permission_classes = [permissions.AllowAny]

    def patch(self, request, pk=None):
        if pk:
            try:
                n = Notification.objects.get(pk=pk)
                n.is_read = True
                n.save()
                return Response({"message": "Notification marked as read"})
            except Notification.DoesNotExist:
                return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)
        else:
            Notification.objects.filter(is_read=False).update(is_read=True)
            return Response({"message": "All notifications marked as read"})
