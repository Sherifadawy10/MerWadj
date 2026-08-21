import "@/styles/post.css";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/wordpress";
import PostShareButtons from "@/components/PostShareButtons";
import Footer from "@/components/Footer";
import { articleSchema, buildMetadata } from "@/lib/site";
import { excerptFrom, stripHtml } from "@/lib/html";

export const revalidate = 300;

function getAuthorPhotoUrl(field) {
  if (!field) return null;
  if (typeof field === "string") return field;
  if (typeof field === "object") return field.url || field.source_url || null;
  return null;
}

function getCategory(post) {
  return post._embedded?.["wp:term"]?.[0]?.[0]?.name || null;
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
  })
    .format(new Date(dateStr))
    .toUpperCase();
}

function calcReadTime(content) {
  if (!content) return null;
  const words = stripHtml(content).split(/\s+/).filter(Boolean).length;
  if (!words) return null;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return buildMetadata({
      title: "Post not found",
      path: `/blog/${slug}`,
      noIndex: true,
    });
  }

  return buildMetadata({
    title: post?.acf?.seo_title || stripHtml(post.title?.rendered),
    description:
      post?.acf?.seo_description || excerptFrom(post.excerpt?.rendered, 180) || undefined,
    path: `/blog/${slug}`,
    image: post.featuredImage?.sourceUrl || undefined,
    type: "article",
    publishedTime: post.date_gmt ? `${post.date_gmt}Z` : undefined,
  });
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const acf = post.acf || {};
  const authorPhotoUrl = getAuthorPhotoUrl(acf.post_author_photo);
  const authorName = acf.post_author_name || null;
  const authorRole = acf.post_author_role || null;
  const hasAuthor = authorName || authorPhotoUrl;

  const category = getCategory(post);
  const date = formatDate(post.date);
  const readTime = acf.post_read_time || calcReadTime(post.content?.rendered);
  const meta = [category, date, readTime].filter(Boolean).join(" • ");
  const excerpt = stripHtml(post.excerpt?.rendered);
  const caption = post.featuredImage?.caption || "";

  const schema = articleSchema({
    title: stripHtml(post.title?.rendered),
    description: excerpt || undefined,
    path: `/blog/${slug}`,
    image: post.featuredImage?.sourceUrl || undefined,
    published: post.date_gmt ? `${post.date_gmt}Z` : undefined,
    modified: post.modified_gmt ? `${post.modified_gmt}Z` : undefined,
    author: authorName || undefined,
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <div className="post-page">

        {/* ── Narrow header: back / meta / title / excerpt / author ── */}
        <div className="post-narrow">
          <Link href="/blog" className="post-single__back">
            <svg width="11" height="12" viewBox="0 0 11 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0.219727 5.47012C-0.0732422 5.76309 -0.0732422 6.23887 0.219727 6.53184L3.96973 10.2818C4.2627 10.5748 4.73848 10.5748 5.03145 10.2818C5.32441 9.98887 5.32441 9.51309 5.03145 9.22012L2.55879 6.7498H9.74941C10.1643 6.7498 10.4994 6.41465 10.4994 5.9998C10.4994 5.58496 10.1643 5.2498 9.74941 5.2498H2.56113L5.0291 2.77949C5.32207 2.48652 5.32207 2.01074 5.0291 1.71777C4.73613 1.4248 4.26035 1.4248 3.96738 1.71777L0.217383 5.46777L0.219727 5.47012Z" fill="black"/>
            </svg>

            Back to journal
          </Link>

          {meta && <p className="post-single__meta">{meta}</p>}

          <h1
            className="post-single__title"
            dangerouslySetInnerHTML={{ __html: post.title?.rendered || "" }}
          />

          {excerpt && <p className="post-single__excerpt">{excerpt}</p>}

          <hr className="post-single__divider" />

          <div className="post-single__author-row">
            {hasAuthor && (
              <div className="post-single__author">
                {authorPhotoUrl ? (
                  <Image
                    src={authorPhotoUrl}
                    alt={authorName || ""}
                    className="post-single__author-photo"
                    width={44}
                    height={44}
                  />
                ) : (
                  <div className="post-single__author-photo post-single__author-photo--placeholder" />
                )}
                <div className="post-single__author-info">
                  {authorName && <span className="post-single__author-name">{authorName}</span>}
                  {authorRole && <span className="post-single__author-role">{authorRole}</span>}
                </div>
              </div>
            )}
            <PostShareButtons />
          </div>

          
        </div>

        {/* ── Wide cover: 1152px ── */}
        {post.featuredImage?.sourceUrl && (
          <div className="post-wide">
            <Image
              src={post.featuredImage.sourceUrl}
              alt={post.featuredImage.alt || post.title?.rendered || ""}
              width={1152}
              height={640}
              className="post-single__cover-img"
              sizes="(min-width: 1200px) 1152px, (min-width: 768px) 848px, 100vw"
              priority
            />
            {caption && <p className="post-single__caption">{caption}</p>}
          </div>
        )}

        {/* ── Narrow body: post content ── */}
        <div className="post-narrow post-narrow--body">
          <div
            className="post-single__content"
            dangerouslySetInnerHTML={{ __html: post.content?.rendered || "" }}
          />
        </div>

      </div>
      <Footer />
    </>
  );
}
