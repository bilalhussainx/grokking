import { Module } from "../types";

export const module1: Module = {
  id: "django-fundamentals",
  title: "Django Fundamentals: MVT & URL Routing",
  description: "The Django philosophy, project structure, URL routing, views, and the MVT pattern",
  lessons: [
    {
      id: "django-setup",
      slug: "django-setup",
      title: "Django's MVT Pattern, Project Structure & Views",
      content: `
# Django: Batteries-Included Web Framework

Django is a full-stack Python web framework with ORM, admin panel, auth, templates, forms, and more — all built in. It follows the **MVT** (Model-View-Template) pattern.

\`\`\`concept
{
  "title": "MVT Architecture",
  "description": "Django's architecture: URLs route to Views, Views query Models and render Templates. Different naming from MVC but same separation of concerns.",
  "points": [
    "Model: data layer — defines database schema via Python classes",
    "View: business logic — processes requests, queries models, returns responses",
    "Template: presentation layer — HTML with Django template language",
    "URL patterns: maps URL paths to view functions/classes",
    'Django philosophy: "Don\'t repeat yourself" (DRY) and "Convention over configuration"',
    "Admin panel: auto-generated CRUD interface for all models — zero code required"
  ]
}
\`\`\`

## Project vs App

\`\`\`bash
# Install and create project:
pip install django
django-admin startproject mysite .  # '.' = current directory
python manage.py startapp blog      # create an app

# Project structure:
# mysite/
#   __init__.py
#   settings.py      ← all configuration
#   urls.py          ← root URL routing
#   wsgi.py          ← WSGI entry point (prod)
#   asgi.py          ← ASGI entry point (async/channels)
# blog/
#   __init__.py
#   admin.py         ← register models with admin
#   apps.py          ← app configuration
#   models.py        ← database models
#   views.py         ← request handlers
#   urls.py          ← app-level URL routing
#   tests.py         ← tests
#   templates/blog/  ← HTML templates
#   migrations/      ← database migrations

# Run dev server:
python manage.py runserver           # http://127.0.0.1:8000
python manage.py migrate             # apply migrations
python manage.py createsuperuser     # create admin user
\`\`\`

## URL Routing

\`\`\`python
# mysite/urls.py — root URL config
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("blog/", include("blog.urls")),    # delegate to blog app
    path("api/", include("api.urls")),
]

# blog/urls.py — app-level URL config
from django.urls import path
from . import views

app_name = "blog"  # namespace for URL reversing

urlpatterns = [
    path("", views.post_list, name="list"),           # /blog/
    path("<int:pk>/", views.post_detail, name="detail"),  # /blog/42/
    path("create/", views.post_create, name="create"),    # /blog/create/
    path("<int:pk>/edit/", views.post_edit, name="edit"), # /blog/42/edit/
    path("<slug:slug>/", views.post_by_slug, name="by_slug"),  # /blog/my-post/
]
\`\`\`

## Function-Based Views (FBVs)

\`\`\`python
# blog/views.py
from django.shortcuts import render, get_object_or_404, redirect
from django.http import HttpRequest, HttpResponse, JsonResponse
from django.contrib.auth.decorators import login_required
from .models import Post
from .forms import PostForm

def post_list(request: HttpRequest) -> HttpResponse:
    posts = Post.objects.filter(is_published=True).order_by("-created_at")
    return render(request, "blog/post_list.html", {"posts": posts})

def post_detail(request: HttpRequest, pk: int) -> HttpResponse:
    post = get_object_or_404(Post, pk=pk, is_published=True)
    return render(request, "blog/post_detail.html", {"post": post})

@login_required  # redirects to /accounts/login/ if not authenticated
def post_create(request: HttpRequest) -> HttpResponse:
    if request.method == "POST":
        form = PostForm(request.POST)
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user
            post.save()
            return redirect("blog:detail", pk=post.pk)
    else:
        form = PostForm()
    return render(request, "blog/post_form.html", {"form": form})

# JSON API view:
def api_posts(request: HttpRequest) -> JsonResponse:
    posts = list(Post.objects.values("id", "title", "created_at"))
    return JsonResponse({"posts": posts, "count": len(posts)})
\`\`\`

## Settings Configuration

\`\`\`python
# mysite/settings.py (key settings to know)

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Your apps:
    "blog",
    "api",
    "rest_framework",  # Django REST Framework
]

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.environ["DB_NAME"],
        "USER": os.environ["DB_USER"],
        "PASSWORD": os.environ["DB_PASSWORD"],
        "HOST": os.environ.get("DB_HOST", "localhost"),
        "PORT": "5432",
    }
}

# Static files:
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"  # collected for production

# Media files (user uploads):
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# Templates:
TEMPLATES = [{"DIRS": [BASE_DIR / "templates"], ...}]

# Security (production):
SECRET_KEY = os.environ["DJANGO_SECRET_KEY"]
DEBUG = os.environ.get("DEBUG", "False") == "True"
ALLOWED_HOSTS = os.environ.get("ALLOWED_HOSTS", "").split(",")
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What is the difference between a Django 'project' and an 'app'?",
      "options": [
        "No difference",
        "A project is the full web application (settings, URLs); an app is a self-contained module (models, views, templates) for a specific feature",
        "Apps are for templates only",
        "Projects can only contain one app"
      ],
      "answer": 1,
      "explanation": "A Django project is the configuration and container. Apps are reusable components within a project. One project can have many apps (blog, shop, api). Apps should be self-contained and potentially reusable across projects."
    },
    {
      "q": "What does 'include(\"blog.urls\")' do in the root URLs file?",
      "options": [
        "Imports the blog app",
        "Delegates all URLs matching the prefix to the blog app's url patterns",
        "Creates URL aliases",
        "Enables the blog admin"
      ],
      "answer": 1,
      "explanation": "include() delegates URL routing to another URLconf file. path('blog/', include('blog.urls')) means any URL starting with 'blog/' is stripped of 'blog/' and passed to blog/urls.py for further routing."
    }
  ]
}
\`\`\`
`,
    },
  ],
};
