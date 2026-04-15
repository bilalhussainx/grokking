// SP-14 — shared layout for blog posts.
import Link from "next/link";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import type { ReactNode } from "react";
import type { BlogPost } from "@/data/blog-posts";

export default function BlogPostShell({
  post,
  children,
}: {
  post: BlogPost;
  children: ReactNode;
}) {
  return (
    <article className="min-h-screen bg-black">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> All posts
        </Link>

        <header className="mb-10">
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
            <span className="px-3 py-1 bg-[#D4AF37]/10 text-[#D4AF37] rounded-full text-xs font-medium">
              {post.category}
            </span>
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(post.date).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.readTime}
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-4">
            {post.title}
          </h1>
          <p className="text-lg text-gray-300">{post.excerpt}</p>
          <p className="text-sm text-gray-500 mt-4">By {post.author}</p>
        </header>

        <div className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-gray-300 prose-li:text-gray-300 prose-strong:text-white prose-a:text-[#D4AF37] hover:prose-a:text-[#D4AF37]/80">
          {children}
        </div>
      </div>
    </article>
  );
}
