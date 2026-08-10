import "@/styles/blog.css";
import Footer from "@/components/Footer";
import BlogHero from "@/components/BlogHero";
import PostCard from "@/components/PostCard";
import InsightsBlock from "@/components/InsightsBlock";
import BlogSubscribe from "@/components/BlogSubscribe";
import PageReveal from "@/components/PageReveal";
import { getPageBySlug, getPosts, getInsights } from "@/lib/wordpress";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const page = await getPageBySlug("blog");
  return {
    title: page?.acf?.seo_title || page?.title?.rendered || "Blog — Merwadj",
    description: page?.acf?.seo_description || "Insights, ideas, and expertise to help you elevate customer experience.",
  };
}

export default async function BlogPage() {
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
