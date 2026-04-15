import BlogPostShell from "@/components/blog/BlogPostShell";
import { BLOG_POSTS } from "@/data/blog-posts";

const post = BLOG_POSTS.find((p) => p.slug === "alumni-interviewer-playbook")!;

export const metadata = {
  title: `${post.title} — KairosLearn`,
  description: post.excerpt,
};

export default function Page() {
  return (
    <BlogPostShell post={post}>
      <h2>The shape of a real alumni report</h2>
      <p>
        Most applicants think of the alumni interview as a gatekept chat that ends with a
        thumbs-up or thumbs-down. It isn&apos;t. The interviewer goes home and fills in a
        structured form. Leaked versions of these forms from Harvard, Yale, Princeton, and
        Stanford all share a surprisingly consistent skeleton:
      </p>
      <ul>
        <li>A 1–5 rating on <strong>academic potential</strong>, <strong>personal qualities</strong>, and <strong>fit with the school&apos;s community</strong>.</li>
        <li>A short narrative — usually 150–300 words — that the admissions committee actually reads.</li>
        <li>Two or three verbatim quotes the interviewer liked enough to copy down.</li>
      </ul>
      <p>
        The narrative and quotes are doing the real work. A 5/5/5 numeric rating with a
        flat narrative is weaker than 4/4/5 with a specific anecdote the reader can picture.
      </p>

      <h2>What alumni reward</h2>
      <p>Across hundreds of reflections on r/ApplyingToCollege and College Confidential, alumni interviewers describe three things that earn the specific, quotable praise:</p>
      <ol>
        <li><strong>Specificity under pressure.</strong> You mention a project; the interviewer probes for a detail; you produce a concrete detail at the right level of abstraction.</li>
        <li><strong>Intellectual self-correction.</strong> You say something, reconsider it mid-answer, and end with a sharper claim. Alumni quote this verbatim more often than any other move.</li>
        <li><strong>A reason for <em>this</em> school specifically.</strong> Not the brand. A professor, a class, a residential system, a research lab — something only this school has.</li>
      </ol>

      <h2>What sinks a report fast</h2>
      <ul>
        <li>Rehearsed-sounding answers where every word is in its optimal slot.</li>
        <li>Bragging about a program name instead of what you did in it.</li>
        <li>&quot;I love how the school cares about community&quot; — substanceless and universal.</li>
        <li>Not asking a single real question when invited to. Alumni interpret this as low curiosity.</li>
      </ul>

      <p className="mt-8">
        We built our college-interview practice mode around these patterns: the voice agent
        probes for specifics, rewards self-correction, and flags abstraction in the scorecard.
      </p>
    </BlogPostShell>
  );
}
