import Image from "next/image";
import Link from "next/link";

function getAuthorPhotoUrl(field) {
  if (!field) return null;
  if (typeof field === "string") return field;
  if (typeof field === "object") return field.url || field.source_url || null;
  return null;
}

function getCategory(post) {
  return post._embedded?.["wp:term"]?.[0]?.[0]?.name || null;
}

function calcReadTime(content) {
  if (!content) return null;
  const text = content.replace(/<[^>]+>/g, " ").trim();
  const words = text.split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
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

export default function PostCard({ post, featured = false, animDelay }) {
  const acf = post.acf || {};
  const authorPhotoUrl = getAuthorPhotoUrl(acf.post_author_photo);
  const authorName = acf.post_author_name || null;
  const authorRole = acf.post_author_role || null;
  const hasAuthor = authorName || authorPhotoUrl;

  const category = getCategory(post);
  const date = formatDate(post.date);
  const readTime = calcReadTime(post.content?.rendered);

  return (
    <article
      className={`post-card${featured ? " post-card--featured" : ""}`}
      {...(animDelay != null ? { "data-anim": animDelay } : {})}
    >
      {post.featuredImage?.sourceUrl ? (
        <Link href={`/blog/${post.slug}`} className="post-card__image-link">
          <Image
            src={post.featuredImage.sourceUrl}
            alt={post.featuredImage.alt || post.title.rendered}
            fill
            className="post-card__image"
            sizes="(min-width: 960px) 58vw, 100vw"
          />
        </Link>
      ) : null}

      <div className="post-card__body">
        {featured ? (
          /* Featured: category • date • read time on one line */
          <div className="post-card__meta post-card__meta--featured">
            {[category, date, readTime].filter(Boolean).join(" • ")}
          </div>
        ) : (
          /* Secondary: category on its own line */
          category && <p className="post-card__category">{category}</p>
        )}

        <Link href={`/blog/${post.slug}`} className="post-card__title-link">
          <h2
            className="post-card__title"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />
        </Link>

        <div
          className="post-card__excerpt"
          dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
        />

        {/* Secondary: date • read time at the bottom */}
        {!featured && (
          <div className="post-card__meta">
            {[date, readTime].filter(Boolean).join(" • ")}
          </div>
        )}

        {hasAuthor && featured && (
          <div className="post-card__author">
            {authorPhotoUrl ? (
              <Image
                src={authorPhotoUrl}
                alt={authorName || ""}
                className="post-card__author-photo"
                width={40}
                height={40}
              />
            ) : (
              <div className="post-card__author-photo post-card__author-photo--placeholder" />
            )}
            <div className="post-card__author-info">
              {authorName && <span className="post-card__author-name">{authorName}</span>}
              {authorRole && <span className="post-card__author-role">{authorRole}</span>}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
