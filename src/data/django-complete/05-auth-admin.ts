import { Module } from "../types";

export const module5: Module = {
  id: "auth-admin",
  title: "Auth, Admin & Forms",
  description: "Django's built-in auth system, custom user models, admin customization, and Django forms with validation",
  lessons: [
    {
      id: "auth-custom-user",
      slug: "auth-custom-user",
      title: "Custom User Model, Auth & Django Admin",
      content: `
# Django Authentication & Admin

## Custom User Model (Do This FIRST)

\`\`\`concept
{
  "title": "Custom User Model — Start Every Project With This",
  "description": "Django's default User model is hard to extend later. Always create a custom user model BEFORE your first migration. Once data exists, changing it is painful.",
  "points": [
    "Extend AbstractUser to add fields while keeping built-in auth",
    "Or extend AbstractBaseUser for full control (more work)",
    "Set AUTH_USER_MODEL = 'accounts.User' in settings.py",
    "Use get_user_model() everywhere instead of importing User directly",
    "Do this BEFORE running any migrations — especially migrate for the first time"
  ]
}
\`\`\`

\`\`\`python
# accounts/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # Add extra fields to Django's built-in user:
    bio = models.TextField(blank=True)
    avatar = models.ImageField(upload_to="avatars/", blank=True)
    is_verified = models.BooleanField(default=False)
    phone = models.CharField(max_length=20, blank=True)

    # Keep email unique and use it for login:
    email = models.EmailField(unique=True)
    USERNAME_FIELD = "email"       # login with email
    REQUIRED_FIELDS = ["username"] # still required for createsuperuser

    def __str__(self):
        return self.email

# settings.py:
AUTH_USER_MODEL = "accounts.User"

# Always import User this way (works regardless of custom model):
from django.contrib.auth import get_user_model
User = get_user_model()
\`\`\`

## Django Admin Customization

\`\`\`python
# blog/admin.py
from django.contrib import admin
from django.utils.html import format_html
from .models import Post, Category, Tag

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    # Columns shown in list view:
    list_display = ["title", "author", "status", "is_featured", "views_count", "created_at", "thumbnail"]
    list_filter = ["status", "is_featured", "category", "created_at"]
    search_fields = ["title", "content", "author__email"]
    list_editable = ["status", "is_featured"]  # edit inline in list
    date_hierarchy = "created_at"
    ordering = ["-created_at"]

    # Form layout in detail view:
    fieldsets = [
        ("Content", {"fields": ["title", "slug", "content", "summary"]}),
        ("Relationships", {"fields": ["author", "category", "tags"]}),
        ("Publishing", {"fields": ["status", "is_featured", "published_at"]}),
    ]

    filter_horizontal = ["tags"]  # M2M nice UI
    prepopulated_fields = {"slug": ("title",)}  # auto-fill slug from title
    readonly_fields = ["created_at", "updated_at", "views_count"]
    raw_id_fields = ["author"]  # better for large user tables

    # Custom column:
    def thumbnail(self, obj):
        if obj.cover_image:
            return format_html('<img src="{}" width="50">', obj.cover_image.url)
        return "-"
    thumbnail.short_description = "Image"

    # Bulk action:
    @admin.action(description="Publish selected posts")
    def make_published(self, request, queryset):
        queryset.update(status="published")

    actions = [make_published]

    def save_model(self, request, obj, form, change):
        if not obj.pk:
            obj.author = request.user  # auto-set author to logged-in admin
        super().save_model(request, obj, form, change)

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "slug"]
    prepopulated_fields = {"slug": ("name",)}
\`\`\`

## Django Forms

\`\`\`python
# blog/forms.py
from django import forms
from .models import Post

class PostForm(forms.ModelForm):
    class Meta:
        model = Post
        fields = ["title", "content", "summary", "category", "tags", "status"]
        widgets = {
            "content": forms.Textarea(attrs={"rows": 20, "class": "content-editor"}),
            "summary": forms.Textarea(attrs={"rows": 3}),
            "tags": forms.CheckboxSelectMultiple(),
        }

    def clean_title(self):
        title = self.cleaned_data.get("title", "").strip()
        if len(title) < 5:
            raise forms.ValidationError("Title must be at least 5 characters")
        return title

    def clean(self):
        cleaned_data = super().clean()
        status = cleaned_data.get("status")
        content = cleaned_data.get("content")
        if status == "published" and not content:
            raise forms.ValidationError("Content is required to publish")
        return cleaned_data

# Template rendering:
# {{ form.as_p }}  — each field in <p>
# {{ form.as_table }}  — table layout
# Manual field rendering:
# {{ form.title }}  — just the input
# {{ form.title.label_tag }}  — <label>
# {{ form.title.errors }}  — validation errors
\`\`\`

## Authentication Views

\`\`\`python
# Django provides built-in auth views — use them!
# urls.py:
from django.contrib.auth import views as auth_views

urlpatterns = [
    # Login, logout, password change/reset:
    path("accounts/", include("django.contrib.auth.urls")),
    # Provides:
    # /accounts/login/
    # /accounts/logout/
    # /accounts/password_change/
    # /accounts/password_reset/
    # /accounts/password_reset/done/
    # /accounts/reset/<uidb64>/<token>/
]

# settings.py:
LOGIN_URL = "/accounts/login/"
LOGIN_REDIRECT_URL = "/"      # after successful login
LOGOUT_REDIRECT_URL = "/"     # after logout

# Custom registration (not included by default):
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import login

class SignUpView(CreateView):
    form_class = UserCreationForm
    template_name = "registration/signup.html"
    success_url = reverse_lazy("home")

    def form_valid(self, form):
        response = super().form_valid(form)
        login(self.request, self.object)  # auto-login after signup
        return response
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "Why must you create a custom User model BEFORE the first migration?",
      "options": [
        "Performance reasons",
        "Django requires it for security",
        "Changing AUTH_USER_MODEL after data exists requires complex migration — extending later is very painful",
        "The default User model doesn't support passwords"
      ],
      "answer": 2,
      "explanation": "Swapping the user model after running migrations requires very complex schema changes. Django's documentation explicitly states: define a custom user model at project start, even if you don't need extra fields yet."
    },
    {
      "q": "form.cleaned_data is available:",
      "options": [
        "Always",
        "Only after calling form.is_valid() which returns True",
        "Before form validation",
        "Only for ModelForm, not Form"
      ],
      "answer": 1,
      "explanation": "cleaned_data is only populated after is_valid() is called and returns True. Before that (or if validation fails), accessing cleaned_data may raise an AttributeError or contain partial data."
    }
  ]
}
\`\`\`
`,
    },
  ],
};
