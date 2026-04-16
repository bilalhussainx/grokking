import { Module } from "../types";

export const module6: Module = {
  id: "advanced-deployment",
  title: "Advanced Django & Deployment",
  description: "Caching with Redis, Celery background tasks, Channels WebSockets, testing, and production deployment checklist",
  lessons: [
    {
      id: "caching-celery",
      slug: "caching-celery",
      title: "Caching, Celery, Channels & Production",
      content: `
# Advanced Django: Caching, Tasks & Deployment

## Caching with Redis

\`\`\`python
# settings.py
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.redis.RedisCache",
        "LOCATION": "redis://127.0.0.1:6379",
        "TIMEOUT": 300,  # 5 minutes default
    }
}

# Per-view caching:
from django.views.decorators.cache import cache_page

@cache_page(60 * 15)  # cache this view for 15 minutes
def expensive_view(request):
    data = compute_expensive_data()
    return render(request, "result.html", {"data": data})

# Template fragment caching:
# {% load cache %}
# {% cache 300 "sidebar_content" user.id %}
#   ... expensive template code ...
# {% endcache %}

# Manual cache operations:
from django.core.cache import cache

cache.set("user:42:profile", user_data, timeout=3600)
cached = cache.get("user:42:profile")   # None if expired
cache.delete("user:42:profile")
cache.get_or_set("key", expensive_fn, 60)  # compute if missing

# Cache invalidation on model save:
from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=Post)
def invalidate_post_cache(sender, instance, **kwargs):
    cache.delete(f"post:{instance.pk}")
    cache.delete("posts:list:published")
\`\`\`

## Celery: Async Background Tasks

\`\`\`python
# pip install celery redis

# celery.py (project level)
import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "mysite.settings")
app = Celery("mysite")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()  # auto-find tasks.py in each app

# settings.py:
CELERY_BROKER_URL = "redis://localhost:6379/0"
CELERY_RESULT_BACKEND = "redis://localhost:6379/0"

# blog/tasks.py
from celery import shared_task
from django.core.mail import send_mail

@shared_task(bind=True, max_retries=3)
def send_welcome_email(self, user_id: int):
    from accounts.models import User
    try:
        user = User.objects.get(pk=user_id)
        send_mail(
            subject="Welcome!",
            message=f"Hi {user.first_name}, welcome to our platform!",
            from_email="noreply@example.com",
            recipient_list=[user.email],
        )
    except Exception as exc:
        raise self.retry(exc=exc, countdown=60)  # retry after 60s

@shared_task
def generate_sitemap():
    """Regenerate sitemap.xml — run daily via Celery Beat."""
    posts = Post.objects.filter(status="published").values("slug", "updated_at")
    # write sitemap...

# View usage:
def register(request):
    user = create_user(...)
    send_welcome_email.delay(user.id)  # .delay() = async
    # .apply_async(countdown=10) = run in 10 seconds
    return redirect("home")

# Run workers:
# celery -A mysite worker --loglevel=info
# celery -A mysite beat --loglevel=info  (for scheduled tasks)
\`\`\`

## Django Signals

\`\`\`python
# Signals: loose coupling between apps
from django.db.models.signals import post_save, pre_delete, m2m_changed
from django.dispatch import receiver
from django.contrib.auth import get_user_model

User = get_user_model()

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """Create Profile when new User is created."""
    if created:
        Profile.objects.create(user=instance)
        send_welcome_email.delay(instance.id)

@receiver(pre_delete, sender=Post)
def cleanup_post_files(sender, instance, **kwargs):
    """Delete associated files when Post is deleted."""
    if instance.cover_image:
        instance.cover_image.delete(save=False)
\`\`\`

## Testing Django Apps

\`\`\`python
# blog/tests.py
from django.test import TestCase, Client
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from .models import Post, Category

User = get_user_model()

class PostAPITestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="alice",
            email="alice@example.com",
            password="TestPass123!",
        )
        self.category = Category.objects.create(name="Tech", slug="tech")
        self.client = APIClient()

    def test_list_posts_unauthenticated(self):
        Post.objects.create(title="Test Post", author=self.user, status="published")
        response = self.client.get("/api/posts/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)

    def test_create_post_requires_auth(self):
        response = self.client.post("/api/posts/", {"title": "New", "content": "..."})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_post_authenticated(self):
        self.client.force_authenticate(user=self.user)  # skip token for unit tests
        response = self.client.post("/api/posts/", {
            "title": "My New Post",
            "content": "Some content here",
            "status": "draft",
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Post.objects.count(), 1)
        self.assertEqual(Post.objects.first().author, self.user)

    def test_author_can_update_own_post(self):
        post = Post.objects.create(title="Mine", author=self.user)
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(f"/api/posts/{post.pk}/", {"title": "Updated"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        post.refresh_from_db()
        self.assertEqual(post.title, "Updated")
\`\`\`

## Production Deployment Checklist

\`\`\`concept
{
  "title": "Django Production Checklist",
  "description": "Run 'python manage.py check --deploy' before going to production",
  "points": [
    "DEBUG = False — never True in production",
    "SECRET_KEY from environment variable, not hardcoded",
    "ALLOWED_HOSTS set to your actual domain(s)",
    "HTTPS: SECURE_SSL_REDIRECT = True, SECURE_HSTS_SECONDS = 31536000",
    "Static files: python manage.py collectstatic, serve via Nginx/CDN",
    "Database: PostgreSQL in production, not SQLite",
    "Gunicorn: gunicorn mysite.wsgi -w 4 -b 0.0.0.0:8000",
    "Nginx as reverse proxy, handles static/media files",
    "Redis for caching and Celery broker",
    "Sentry or similar for error tracking",
    "DATABASE_URL from environment (use dj-database-url)"
  ]
}
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What is the difference between .delay() and .apply_async() in Celery?",
      "options": [
        "No difference",
        ".delay() is shorthand for .apply_async() with no extra options; .apply_async() allows countdown, eta, retry, queue, etc.",
        ".delay() runs synchronously, .apply_async() runs async",
        ".apply_async() is deprecated"
      ],
      "answer": 1,
      "explanation": ".delay(*args, **kwargs) is equivalent to .apply_async(args, kwargs). Use .apply_async() when you need extra options: countdown (delay in seconds), eta (specific datetime), queue, retries, priority."
    },
    {
      "q": "When is it appropriate to use Django Signals?",
      "options": [
        "Always — they're the best way to run code after model changes",
        "For loosely coupled cross-app reactions to events (e.g., create Profile when User is created), not for code in the same app",
        "Only for async operations",
        "Never — use model save() override instead"
      ],
      "answer": 1,
      "explanation": "Signals are best for decoupled cross-app reactions. If the signal sender and receiver are in the same app, overriding save() or using a service function is usually cleaner. Signals make code harder to trace."
    }
  ]
}
\`\`\`

\`\`\`takeaways
["Always create a custom User model before first migration — extending later is painful", "Use select_related/prefetch_related to avoid N+1 queries", "DRF ViewSets + DefaultRouter give you full CRUD APIs with minimal code", "Django Admin is extremely powerful with minimal customization — use it for internal tools", "Celery + Redis handles background tasks; cache.get_or_set() for expensive computations", "DEBUG=False, HTTPS, collectstatic, Gunicorn + Nginx = production-ready Django"]
\`\`\`
`,
    },
  ],
};
