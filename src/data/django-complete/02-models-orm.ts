import { Module } from "../types";

export const module2: Module = {
  id: "models-orm",
  title: "Models & Django ORM",
  description: "Define database schema with Django models, master QuerySet API, relationships, migrations, and advanced ORM patterns",
  lessons: [
    {
      id: "models-queryset",
      slug: "models-queryset",
      title: "Models, QuerySets & Migrations",
      content: `
# Django Models & ORM

Django's ORM lets you define your database schema in Python and query it without writing SQL.

## Model Definition

\`\`\`python
# blog/models.py
from django.db import models
from django.contrib.auth import get_user_model
from django.utils.text import slugify

User = get_user_model()

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(unique=True)

    class Meta:
        verbose_name_plural = "categories"
        ordering = ["name"]

    def __str__(self):
        return self.name

class Post(models.Model):
    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        PUBLISHED = "published", "Published"
        ARCHIVED = "archived", "Archived"

    title = models.CharField(max_length=200)
    slug = models.SlugField(unique=True, blank=True)
    content = models.TextField()
    summary = models.TextField(max_length=500, blank=True)

    # Relationships:
    author = models.ForeignKey(
        User,
        on_delete=models.CASCADE,       # delete posts when user deleted
        related_name="posts",           # user.posts.all()
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,      # keep post if category deleted
        null=True, blank=True,
        related_name="posts",
    )
    tags = models.ManyToManyField("Tag", blank=True, related_name="posts")

    # Metadata:
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.DRAFT)
    views_count = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False)

    # Timestamps:
    created_at = models.DateTimeField(auto_now_add=True)  # set on create only
    updated_at = models.DateTimeField(auto_now=True)      # set on every save
    published_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["status", "created_at"]),
            models.Index(fields=["author", "status"]),
        ]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name
\`\`\`

## Field Types Reference

\`\`\`concept
{
  "title": "Common Django Field Types",
  "description": "Key field types to know for interviews and day-to-day use",
  "points": [
    "CharField(max_length=N): fixed-length string, requires max_length",
    "TextField(): unlimited text (no max_length)",
    "IntegerField, PositiveIntegerField, BigIntegerField",
    "FloatField, DecimalField(max_digits, decimal_places): use Decimal for money",
    "BooleanField: True/False",
    "DateField, TimeField, DateTimeField(auto_now_add, auto_now)",
    "EmailField, URLField, SlugField: CharField with validation",
    "JSONField: stores JSON (PostgreSQL native, SQLite via json)",
    "ForeignKey, OneToOneField, ManyToManyField: relationships",
    "ImageField, FileField: file uploads (requires Pillow for images)"
  ]
}
\`\`\`

## Migrations

\`\`\`bash
# After creating/modifying models:
python manage.py makemigrations          # detect model changes → create migration files
python manage.py migrate                 # apply pending migrations to database
python manage.py showmigrations          # show migration status
python manage.py sqlmigrate blog 0001   # show SQL that migration 0001 will run
python manage.py migrate blog 0001      # roll back to migration 0001

# Migration file is generated code — always review before applying!
# Never edit migration files manually (causes merge conflicts)
\`\`\`

## QuerySet API

\`\`\`tabs
[
  {
    "label": "Basic Queries",
    "content": "# QuerySets are LAZY — no DB hit until evaluated!\\nfrom blog.models import Post\\n\\n# All records:\\nPost.objects.all()\\n\\n# Filter (AND conditions by default):\\nPost.objects.filter(status='published', author=user)\\n\\n# Exclude:\\nPost.objects.exclude(status='draft')\\n\\n# Get single record (raises exception if 0 or >1):\\npost = Post.objects.get(pk=42)      # DoesNotExist or MultipleObjectsReturned\\npost = Post.objects.get(slug='my-post')\\n\\n# Safe single record:\\nfrom django.shortcuts import get_object_or_404\\npost = get_object_or_404(Post, pk=42)  # returns 404 HTTP response if not found"
  },
  {
    "label": "Chaining & Lookups",
    "content": "# Field lookups (__ separator):\\nPost.objects.filter(title__icontains='django')   # case-insensitive contains\\nPost.objects.filter(created_at__year=2024)       # year component\\nPost.objects.filter(views_count__gte=1000)       # >=\\nPost.objects.filter(author__username='alice')    # traverse ForeignKey!\\nPost.objects.filter(tags__name='python')         # traverse M2M!\\n\\n# Chaining (each returns new QuerySet):\\npublished_posts = (\\n    Post.objects\\n    .filter(status='published')\\n    .exclude(is_featured=False)\\n    .order_by('-views_count', 'title')\\n    .select_related('author', 'category')  # JOIN — avoid N+1\\n    .prefetch_related('tags')              # separate query for M2M\\n)"
  },
  {
    "label": "Aggregation & Annotation",
    "content": "from django.db.models import Count, Avg, Sum, Max, Min, Q\\n\\n# Count all published posts:\\nPost.objects.filter(status='published').count()\\n\\n# Aggregate over all rows:\\nfrom django.db.models import Avg\\nPost.objects.aggregate(avg_views=Avg('views_count'))\\n# {'avg_views': 1234.5}\\n\\n# Annotate: add computed field to each row:\\nfrom django.db.models import Count\\nposts = Post.objects.annotate(\\n    comment_count=Count('comments')\\n).order_by('-comment_count')\\n\\n# Complex Q objects (OR conditions):\\nposts = Post.objects.filter(\\n    Q(status='published') | Q(is_featured=True)\\n)"
  },
  {
    "label": "Bulk Operations",
    "content": "# Bulk create (single INSERT):\\nPost.objects.bulk_create([\\n    Post(title='Post 1', author=user, status='draft'),\\n    Post(title='Post 2', author=user, status='draft'),\\n], batch_size=100)\\n\\n# Bulk update (single UPDATE):\\nPost.objects.filter(author=user).update(status='archived')\\n\\n# Update or create:\\npost, created = Post.objects.update_or_create(\\n    slug='my-post',  # lookup\\n    defaults={'title': 'Updated Title', 'status': 'published'},  # update/create with\\n)\\n\\n# get_or_create:\\ncategory, created = Category.objects.get_or_create(\\n    name='Python',\\n    defaults={'slug': 'python'},\\n)"
  }
]
\`\`\`

## N+1 Query Problem

\`\`\`python
# N+1 Problem — NEVER do this:
posts = Post.objects.filter(status='published')  # 1 query
for post in posts:
    print(post.author.name)  # N queries (one per post)!

# Fix with select_related (SQL JOIN for ForeignKey/OneToOne):
posts = Post.objects.select_related('author', 'category').filter(status='published')
# Now 1 query with JOIN — no extra queries in the loop

# Fix with prefetch_related (separate optimized query for M2M/reverse FKs):
posts = Post.objects.prefetch_related('tags', 'comments').filter(status='published')
# 3 queries total: posts + tags + comments (much better than N queries)

# Use only() to load a subset of fields:
posts = Post.objects.only('id', 'title', 'slug').filter(status='published')
# SELECT id, title, slug FROM blog_post WHERE status='published'
# Accessing other fields triggers extra queries — use carefully
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What is the N+1 query problem and how does Django's ORM solve it?",
      "options": [
        "A recursion issue — solved with caching",
        "Accessing a related object in a loop triggers N extra queries — solved with select_related (JOIN) or prefetch_related (batched query)",
        "Too many database connections — solved with connection pooling",
        "Slow migrations — solved with squashmigrations"
      ],
      "answer": 1,
      "explanation": "N+1: loop over N posts, each accessing post.author triggers 1 extra query = N+1 total. select_related() does a JOIN (1 query). prefetch_related() does a smart batch query (2 queries). Both eliminate the N extra queries."
    },
    {
      "q": "auto_now_add=True vs auto_now=True — what's the difference?",
      "options": [
        "No difference",
        "auto_now_add sets the timestamp once on creation; auto_now updates it on every save",
        "auto_now_add is for DateField only; auto_now for DateTimeField",
        "auto_now_add allows manual override; auto_now does not"
      ],
      "answer": 1,
      "explanation": "auto_now_add=True: timestamp set once when the record is first created (good for created_at). auto_now=True: timestamp updated on every model.save() call (good for updated_at). Both are editable=False."
    }
  ]
}
\`\`\`
`,
    },
  ],
};
