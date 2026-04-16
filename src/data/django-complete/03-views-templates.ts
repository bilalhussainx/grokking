import { Module } from "../types";

export const module3: Module = {
  id: "views-templates",
  title: "Views, Templates & Class-Based Views",
  description: "Function-based views, Django template language, class-based views (CBV), mixins, and the generic view system",
  lessons: [
    {
      id: "cbv-templates",
      slug: "cbv-templates",
      title: "Class-Based Views & Django Templates",
      content: `
# Class-Based Views (CBVs) & Templates

## Class-Based Views

CBVs reduce boilerplate for common patterns (CRUD). Django provides generic CBVs for list, detail, create, update, and delete.

\`\`\`tabs
[
  {
    "label": "Generic CBVs",
    "content": "# views.py\\nfrom django.views.generic import (\\n    ListView, DetailView, CreateView, UpdateView, DeleteView\\n)\\nfrom django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin\\nfrom django.urls import reverse_lazy\\nfrom .models import Post\\nfrom .forms import PostForm\\n\\nclass PostListView(ListView):\\n    model = Post\\n    template_name = 'blog/post_list.html'\\n    context_object_name = 'posts'        # name in template (default: object_list)\\n    paginate_by = 10                     # auto-pagination!\\n    ordering = ['-created_at']\\n\\n    def get_queryset(self):\\n        # Override to filter published only:\\n        return Post.objects.filter(status='published').select_related('author')\\n\\nclass PostDetailView(DetailView):\\n    model = Post\\n    template_name = 'blog/post_detail.html'\\n    context_object_name = 'post'\\n\\n    def get_object(self):\\n        obj = super().get_object()\\n        # Increment view count on each visit:\\n        Post.objects.filter(pk=obj.pk).update(views_count=models.F('views_count') + 1)\\n        return obj"
  },
  {
    "label": "Create / Update / Delete",
    "content": "class PostCreateView(LoginRequiredMixin, CreateView):\\n    model = Post\\n    form_class = PostForm\\n    template_name = 'blog/post_form.html'\\n    success_url = reverse_lazy('blog:list')\\n\\n    def form_valid(self, form):\\n        form.instance.author = self.request.user  # set author before save\\n        return super().form_valid(form)\\n\\nclass PostUpdateView(LoginRequiredMixin, UpdateView):\\n    model = Post\\n    form_class = PostForm\\n    template_name = 'blog/post_form.html'\\n\\n    def get_success_url(self):\\n        return reverse_lazy('blog:detail', kwargs={'pk': self.object.pk})\\n\\n    def get_queryset(self):\\n        # Users can only edit their own posts:\\n        return super().get_queryset().filter(author=self.request.user)\\n\\nclass PostDeleteView(LoginRequiredMixin, DeleteView):\\n    model = Post\\n    template_name = 'blog/post_confirm_delete.html'\\n    success_url = reverse_lazy('blog:list')"
  },
  {
    "label": "Mixins",
    "content": "# Custom mixin — reuse across views:\\nclass AuthorRequiredMixin:\\n    def get_queryset(self):\\n        # Ensure user can only see their own objects:\\n        return super().get_queryset().filter(author=self.request.user)\\n\\nclass PostUpdateView(LoginRequiredMixin, AuthorRequiredMixin, UpdateView):\\n    model = Post\\n    form_class = PostForm\\n    # AuthorRequiredMixin.get_queryset() called automatically\\n\\n# Order matters for MRO (Method Resolution Order):\\n# LoginRequiredMixin must come before AuthorRequiredMixin"
  }
]
\`\`\`

## Django Template Language (DTL)

\`\`\`html
{# base.html — layout template #}
<!DOCTYPE html>
<html>
<head>
    <title>{% block title %}My Blog{% endblock %}</title>
    {% load static %}
    <link rel="stylesheet" href="{% static 'css/main.css' %}">
</head>
<body>
    <nav>
        {% if user.is_authenticated %}
            Hello, {{ user.username }}! {# variable output #}
            <a href="{% url 'logout' %}">Logout</a>
        {% else %}
            <a href="{% url 'login' %}">Login</a>
        {% endif %}
    </nav>

    <main>
        {% block content %}{% endblock %} {# child fills this #}
    </main>
</body>
</html>

{# post_list.html — extends base #}
{% extends "base.html" %}

{% block title %}Posts{% endblock %}

{% block content %}
    <h1>Blog Posts</h1>

    {# For loop #}
    {% for post in posts %}
        <article>
            <h2>
                <a href="{% url 'blog:detail' pk=post.pk %}">
                    {{ post.title }}
                </a>
            </h2>
            <p>{{ post.summary|truncatewords:30 }}</p>
            <small>
                By {{ post.author.get_full_name|default:post.author.username }}
                on {{ post.created_at|date:"M d, Y" }}
            </small>
        </article>
    {% empty %}
        <p>No posts yet.</p>
    {% endfor %}

    {# Pagination (built into ListView) #}
    {% if is_paginated %}
        {% if page_obj.has_previous %}
            <a href="?page={{ page_obj.previous_page_number }}">Previous</a>
        {% endif %}
        Page {{ page_obj.number }} of {{ page_obj.num_pages }}
        {% if page_obj.has_next %}
            <a href="?page={{ page_obj.next_page_number }}">Next</a>
        {% endif %}
    {% endif %}
{% endblock %}
\`\`\`

## Template Filters & Tags

\`\`\`concept
{
  "title": "Common Template Filters",
  "description": "Filters transform values in templates. Applied with pipe | operator.",
  "points": [
    "{{ text|truncatewords:50 }} — limit to 50 words",
    "{{ date|date:'M d, Y' }} — format date",
    "{{ amount|floatformat:2 }} — 2 decimal places",
    "{{ name|default:'Anonymous' }} — fallback if falsy",
    "{{ html_content|safe }} — mark as safe HTML (careful!)",
    "{{ list|join:', ' }} — join iterable with separator",
    "{{ text|linebreaks }} — convert newlines to <br>/<p>",
    "{{ text|urlize }} — convert URLs to links",
    "{{ value|yesno:'yes,no,maybe' }} — boolean to string"
  ]
}
\`\`\`

## Custom Template Tags & Filters

\`\`\`python
# blog/templatetags/blog_tags.py
from django import template
from django.utils.html import format_html

register = template.Library()

# Custom filter:
@register.filter
def reading_time(text: str) -> int:
    """Estimate reading time in minutes."""
    words = len(text.split())
    return max(1, words // 200)  # 200 words per minute

# Usage in template: {{ post.content|reading_time }} min read

# Custom inclusion tag (renders a sub-template):
@register.inclusion_tag("blog/recent_posts.html")
def recent_posts(count=5):
    from blog.models import Post
    posts = Post.objects.filter(status="published").order_by("-created_at")[:count]
    return {"posts": posts}

# Usage: {% load blog_tags %}  {% recent_posts 3 %}
\`\`\`

\`\`\`quiz
{
  "questions": [
    {
      "q": "What does paginate_by = 10 in a ListView do?",
      "options": [
        "Limits the queryset to 10 items total",
        "Automatically paginates the queryset — 10 items per page, adds page_obj to context",
        "Caches 10 items",
        "Creates 10 pages"
      ],
      "answer": 1,
      "explanation": "paginate_by enables automatic pagination. ListView splits the queryset into pages of N items and adds is_paginated, page_obj, and paginator to the template context. URL uses ?page=2 for navigation."
    },
    {
      "q": "In Django templates, how do you prevent HTML injection vulnerabilities?",
      "options": [
        "Use {{ var }} — Django auto-escapes HTML by default",
        "Use {% safe var %} always",
        "HTML is never injected in Django",
        "Use !!!var!!! syntax"
      ],
      "answer": 0,
      "explanation": "Django templates auto-escape HTML characters in {{ variable }} output by default, converting < > & \" to HTML entities. Use |safe only for trusted content you explicitly want to render as HTML."
    }
  ]
}
\`\`\`
`,
    },
  ],
};
