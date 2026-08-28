import "@/styles/blog.css";
import { notFound } from "next/navigation";
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
  if (!INSIGHTS_ENABLED) {
    return buildMetadata({ title: "Page not found", path: "/404", noIndex: true });
  }

  const page = await getPageBySlug("blog");
  return buildMetadata({
    title: page?.acf?.seo_title || stripHtml(page?.title?.rendered) || "Research & Insights",
    description:
      page?.acf?.seo_description ||
      "Technical writing on material selection, embodied carbon and supplier verification.",
    path: "/blog",
  });
}

export default async function BlogPage() {
  if (!INSIGHTS_ENABLED) notFound();

  const [page, posts, insights] = await Promise.all([
    getPageBySlug("blog"),
    getPosts(),
    getInsights(),
  ]);

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
