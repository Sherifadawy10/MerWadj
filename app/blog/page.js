import "@/styles/blog.css";
import Footer from "@/components/Footer";
import BlogHero from "@/components/BlogHero";
import PostCard from "@/components/PostCard";
import InsightsBlock from "@/components/InsightsBlock";
import BlogSubscribe from "@/components/BlogSubscribe";
import PageReveal from "@/components/PageReveal";
import { getPageBySlug, getPosts, getInsights } from "@/lib/wordpress";
import { buildMetadata } from "@/lib/site";
import { INSIGHTS_ENABLED } from "@/lib/features";
import { stripHtml } from "@/lib/html";

export const revalidate = 120;

export async function generateMetadata() {
  const page = await getPageBySlug("blog");
  const title =
    page?.acf?.seo_title || stripHtml(page?.title?.rendered) || "Research & Insights";

  if (!INSIGHTS_ENABLED) {
    return buildMetadata({
      title,
      description: "Our research is being prepared for publication.",
      path: "/blog",
    });
  }

  return buildMetadata({
    title,
    description:
      page?.acf?.seo_description ||
      "Technical writing on material selection, embodied carbon and supplier verification.",
    path: "/blog",
  });
}

export default async function BlogPage() {
  const page = await getPageBySlug("blog");

  /*
   * Articles unpublished, page intact.
   *
   * The hero stays exactly as designed and the body says the research is
   * on its way. No post cards, no insights strip, no subscribe form —
   * those all render the writing that is being withheld.
   */
  if (!INSIGHTS_ENABLED) {
    return (
      <>
        <BlogHero page={page} />

        <section className="blog-soon">
          <div className="blog-soon__inner">
            <p className="blog-soon__eyebrow">Coming soon</p>
            <h2 className="blog-soon__title">Our research is on its way</h2>
            {/* Review 03 item 19: the client's wording, verbatim. */}
            <p className="blog-soon__text">
              We are actively expanding our materials research and technical
              testing. In the meantime, we welcome the opportunity to
              collaborate with designers and project teams on material
              exploration, custom sourcing, and project-specific requirements.
              Reach out to start a conversation.
            </p>
            <a href="/contact" className="blog-soon__cta">
              Talk to a specialist
            </a>
          </div>
        </section>

        <PageReveal />
        <Footer />
      </>
    );
  }

  const [posts, insights] = await Promise.all([getPosts(), getInsights()]);

  return (
    <>
      <BlogHero page={page} />

      <section className="blog-section">
        <div className="blog-section__inner">
          {posts.length ? (
            <div className="blog-featured-layout">
              <PostCard post={posts[0]} featured animDelay={0} />
              {posts.length > 1 && (
                <div className="blog-secondary">
                  {posts.slice(1).map((post, i) => (
                    <PostCard key={post.id} post={post} animDelay={i * 100} />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="blog-empty">No posts found.</div>
          )}
        </div>
      </section>

      <InsightsBlock insights={insights} />

      <BlogSubscribe
        title={page?.acf?.blog_subscribe_title}
        text={page?.acf?.blog_subscribe_text}
      />
      <PageReveal />
      <Footer />
    </>
  );
}
