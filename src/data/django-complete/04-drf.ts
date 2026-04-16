import { Module } from "../types";

export const module4: Module = {
  id: "django-rest-framework",
  title: "Django REST Framework (DRF)",
  description: "Build professional REST APIs with serializers, viewsets, routers, permissions, filtering, and pagination",
  lessons: [
    {
      id: "drf-serializers",
      slug: "drf-serializers",
      title: "Serializers, ViewSets & Routers",
      content: `
# Django REST Framework

DRF is the gold-standard library for building REST APIs with Django. It adds: Serializers (like forms for APIs), ViewSets, Routers, Permissions, Throttling, Filtering, and Pagination.

\`\`\`bash
pip install djangorestframework djangorestframework-simplejwt django-filter
\`\`\`

## Serializers

\`\`\`python
# blog/serializers.py
from rest_framework import serializers
from .models import Post, Tag, Category
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name"]
        read_only_fields = ["id"]

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "name"]

class PostListSerializer(serializers.ModelSerializer):
    author_name = serializers.SerializerMethodField()
    tags = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = ["id", "title", "slug", "summary", "author_name", "tags", "created_at", "views_count"]

    def get_author_name(self, obj) -> str:
        return obj.author.get_full_name() or obj.author.username

class PostDetailSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(), many=True, write_only=True, source="tags"
    )

    class Meta:
        model = Post
        fields = [
            "id", "title", "slug", "content", "summary",
            "author", "tags", "tag_ids", "status",
            "created_at", "updated_at", "views_count",
        ]
        read_only_fields = ["id", "slug", "author", "created_at", "updated_at", "views_count"]

    def validate_title(self, value: str) -> str:
        if len(value) < 5:
            raise serializers.ValidationError("Title must be at least 5 characters")
        return value.strip()

    def validate(self, data: dict) -> dict:
        # Cross-field validation:
        if data.get("status") == "published" and not data.get("content"):
            raise serializers.ValidationError("Cannot publish a post without content")
        return data
\`\`\`

## ViewSets & Routers

\`\`\`python
# blog/views.py (API views)
from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Post
from .serializers import PostListSerializer, PostDetailSerializer
from .permissions import IsAuthorOrReadOnly

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.select_related("author", "category").prefetch_related("tags")
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsAuthorOrReadOnly]

    # Different serializers for list vs detail:
    def get_serializer_class(self):
        if self.action == "list":
            return PostListSerializer
        return PostDetailSerializer

    # Filtering, search, ordering:
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["status", "category", "author"]
    search_fields = ["title", "content", "tags__name"]
    ordering_fields = ["created_at", "views_count"]
    ordering = ["-created_at"]

    def get_queryset(self):
        if self.action == "list":
            return self.queryset.filter(status="published")
        return self.queryset  # authenticated users see drafts of their own

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)  # auto-set author

    # Custom action — POST /posts/{pk}/publish/
    @action(detail=True, methods=["post"], permission_classes=[permissions.IsAuthenticated])
    def publish(self, request, pk=None):
        post = self.get_object()
        if post.author != request.user:
            return Response({"error": "Not your post"}, status=status.HTTP_403_FORBIDDEN)
        post.status = "published"
        post.save()
        return Response(PostDetailSerializer(post, context={"request": request}).data)

    # Custom action — GET /posts/trending/
    @action(detail=False, methods=["get"])
    def trending(self, request):
        trending = Post.objects.filter(status="published").order_by("-views_count")[:10]
        serializer = PostListSerializer(trending, many=True, context={"request": request})
        return Response(serializer.data)
\`\`\`

## Routers — Auto-generate URLs

\`\`\`python
# blog/urls.py (API)
from rest_framework.routers import DefaultRouter
from .views import PostViewSet

router = DefaultRouter()
router.register(r"posts", PostViewSet, basename="post")

urlpatterns = router.urls
# Generated URLs:
# GET    /posts/           → PostViewSet.list()
# POST   /posts/           → PostViewSet.create()
# GET    /posts/{id}/      → PostViewSet.retrieve()
# PUT    /posts/{id}/      → PostViewSet.update()
# PATCH  /posts/{id}/      → PostViewSet.partial_update()
# DELETE /posts/{id}/      → PostViewSet.destroy()
# POST   /posts/{id}/publish/ → PostViewSet.publish()  (custom action)
# GET    /posts/trending/    → PostViewSet.trending()  (custom action)
\`\`\`

## Custom Permissions

\`\`\`python
# blog/permissions.py
from rest_framework import permissions

class IsAuthorOrReadOnly(permissions.BasePermission):
    """Allow read for anyone, write only for the author."""

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:  # GET, HEAD, OPTIONS
            return True
        return obj.author == request.user

class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_staff
\`\`\`

## Pagination & JWT Auth

\`\`\`python
# settings.py
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework_simplejwt.authentication.JWTAuthentication",
        "rest_framework.authentication.SessionAuthentication",  # for browsable API
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticatedOrReadOnly",
    ],
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
    "DEFAULT_FILTER_BACKENDS": [
        "django_filters.rest_framework.DjangoFilterBackend",
        "rest_framework.filters.SearchFilter",
        "rest_framework.filters.OrderingFilter",
    ],
    "DEFAULT_THROTTLE_CLASSES": [
        "rest_framework.throttling.AnonRateThrottle",
        "rest_framework.throttling.UserRateThrottle",
    ],
    "DEFAULT_THROTTLE_RATES": {
        "anon": "100/day",
        "user": "1000/day",
    },
}

# JWT endpoints:
# urls.py
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
path("api/auth/token/", TokenObtainPairView.as_view()),
path("api/auth/token/refresh/", TokenRefreshView.as_view()),
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What is a DRF Serializer?",
      "options": [
        "A class that defines URL patterns",
        "A class that converts between complex Python objects (models) and JSON/dict, with validation",
        "A database migration tool",
        "A template renderer"
      ],
      "answer": 1,
      "explanation": "Serializers in DRF are like Django Forms but for APIs. They convert model instances ↔ Python dicts ↔ JSON, validate input data, and can handle nested relationships."
    },
    {
      "q": "What does DefaultRouter provide?",
      "options": [
        "A default URL configuration for Django",
        "Automatic URL generation for ViewSets — list, detail, create, update, delete endpoints from a single registration",
        "Default error handling",
        "Automatic pagination"
      ],
      "answer": 1,
      "explanation": "DefaultRouter registers a ViewSet and auto-generates all standard REST URLs (GET /items/, GET /items/{id}/, POST /items/, PUT/PATCH /items/{id}/, DELETE /items/{id}/) plus a browsable API root."
    }
  ]
}
\`\`\`
`,
    },
  ],
};
