from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import OwnerProfile, ContentPage
from .serializers import OwnerProfileSerializer, ContentPageSerializer
from accounts.permissions import IsContentManager


class PublicOwnerProfileView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        profile = OwnerProfile.objects.filter(is_published=True).first()
        if not profile:
            profile = OwnerProfile.objects.first()
            if not profile:
                profile = OwnerProfile.objects.create()
        return Response(OwnerProfileSerializer(profile).data)


class PublicContentPageDetailView(generics.RetrieveAPIView):
    queryset = ContentPage.objects.filter(is_published=True)
    serializer_class = ContentPageSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'


class PublicContentPageListView(generics.ListAPIView):
    queryset = ContentPage.objects.filter(is_published=True)
    serializer_class = ContentPageSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None


# Admin CMS Views
class AdminOwnerProfileView(APIView):
    permission_classes = [IsContentManager]

    def get(self, request):
        profile = OwnerProfile.objects.first()
        if not profile:
            profile = OwnerProfile.objects.create()
        return Response(OwnerProfileSerializer(profile).data)

    def patch(self, request):
        profile = OwnerProfile.objects.first()
        if not profile:
            profile = OwnerProfile.objects.create()
        serializer = OwnerProfileSerializer(profile, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class AdminContentPageListCreateView(generics.ListCreateAPIView):
    queryset = ContentPage.objects.all().order_by('slug')
    serializer_class = ContentPageSerializer
    permission_classes = [IsContentManager]
    pagination_class = None


class AdminContentPageDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ContentPage.objects.all()
    serializer_class = ContentPageSerializer
    permission_classes = [IsContentManager]
    lookup_field = 'slug'
