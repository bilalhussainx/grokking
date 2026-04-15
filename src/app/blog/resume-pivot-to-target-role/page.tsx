import BlogPostShell from "@/components/blog/BlogPostShell";
import { BLOG_POSTS } from "@/data/blog-posts";

const post = BLOG_POSTS.find((p) => p.slug === "resume-pivot-to-target-role")!;

export const metadata = {
  title: `${post.title} — KairosLearn`,
  description: post.excerpt,
};

export default function Page() {
  return (
    <BlogPostShell post={post}>
      <h2>You&apos;re not faking — you&apos;re reframing</h2>
      <p>
        Pivoting to a role you haven&apos;t officially held is one of the highest-leverage
        resume moves you can make, and one of the most anxiety-inducing. The trick is:
        don&apos;t invent experience. <strong>Reframe the impact you already produced in the
        language the target role uses.</strong>
      </p>

      <h2>Three patterns that actually work</h2>
      <ol>
        <li>
          <strong>Lift transferable verbs.</strong> A tutoring bullet written as
          &quot;explained ideas to students&quot; becomes &quot;ran 1:1 sessions with 12
          students and iterated the curriculum each week based on comprehension data.&quot;
          Same work — now it reads like product management.
        </li>
        <li>
          <strong>Lead with the decision you made.</strong> Not the tools you used. A
          decision implies judgment; judgment is the thing hiring managers read resumes for.
        </li>
        <li>
          <strong>Quantify what you can, strip what you can&apos;t.</strong> A number without
          context (&quot;improved by 40%&quot;) is worse than a clean qualitative sentence.
          Only keep the percentage if you can say <em>percent of what, over what period</em>.
        </li>
      </ol>

      <h2>What our resume optimizer does</h2>
      <p>
        You paste a target job description, and the rewrite pass pulls concrete verbs and
        competencies out of the JD, then walks each bullet in your resume and asks: does this
        bullet tell the reader anything the JD is looking for? If not, rewrite. If yes, sharpen.
      </p>
      <p>
        The output is a side-by-side diff so you can see why each line changed — not a black box.
      </p>
    </BlogPostShell>
  );
}
