import BlogPostShell from "@/components/blog/BlogPostShell";
import { BLOG_POSTS } from "@/data/blog-posts";

const post = BLOG_POSTS.find((p) => p.slug === "essays-that-survive-an-interview")!;

export const metadata = {
  title: `${post.title} — KairosLearn`,
  description: post.excerpt,
};

export default function Page() {
  return (
    <BlogPostShell post={post}>
      <h2>Every line in your essay is a potential interview question</h2>
      <p>
        Alumni interviewers often have your resume and sometimes your essay in front of them.
        Even when they don&apos;t, they&apos;ll ask about the shape of your application.
        Every abstract line — &quot;I discovered a passion for biology&quot; — is an invitation
        for the interviewer to ask: <em>discovered how? in what moment? with what evidence?</em>
      </p>
      <p>If you can&apos;t answer that for 60–90 seconds with specifics, the line is too abstract.</p>

      <h2>The 90-second test</h2>
      <p>
        Before submitting an essay, read each claim aloud and ask yourself: <em>If an interviewer
        pointed at this sentence, could I speak for 90 seconds with a specific scene, object,
        or number?</em> If the answer is &quot;I&apos;d repeat the essay in different words&quot;
        — the line is decorative, not load-bearing.
      </p>

      <h2>Replace vague verbs with scene-specific ones</h2>
      <ul>
        <li><strong>&quot;I led the team&quot;</strong> → <em>&quot;I ran the Tuesday stand-ups and rewrote our priority list after we missed the November deadline.&quot;</em></li>
        <li><strong>&quot;I was fascinated by&quot;</strong> → <em>&quot;I read the chapter on lipid bilayers on a bus ride home and spent that weekend trying to simulate one in Python.&quot;</em></li>
        <li><strong>&quot;It taught me perseverance&quot;</strong> → Cut entirely. Perseverance is inferred from the scene, never told.</li>
      </ul>

      <h2>The pre-flight probe</h2>
      <p>
        Our essay critic pass generates a set of probe questions <em>from your own draft</em> —
        the same questions an interviewer would reach for. If any of them surface a gap you
        can&apos;t answer confidently, tighten that line before the essay goes out.
      </p>
    </BlogPostShell>
  );
}
