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

export default function InsightCard({ post, animDelay }) {
  const acf = post.acf || {};
  const authorPhotoUrl = getAuthorPhotoUrl(acf.post_author_photo);
  const authorName = acf.post_author_name || null;
  const authorRole = acf.post_author_role || null;
  const hasAuthor = authorName || authorPhotoUrl;

  const category = getCategory(post);
  const date = formatDate(post.date);
  const readTime = acf.post_read_time || null;

  const href = `/insights/${post.slug}`;

  return (
    <article className="insight-card" {...(animDelay != null ? { "data-anim": animDelay } : {})}>
      {post.featuredImage?.sourceUrl && (
        <Link href={href} className="insight-card__image-link">
          <Image
            src={post.featuredImage.sourceUrl}
            alt={post.featuredImage.alt || post.title?.rendered || ""}
            fill
            className="insight-card__image"
            sizes="(min-width: 960px) 40vw, 100vw"
          />
        </Link>
      )}

      <div className="insight-card__body">
        <div className="insight-card__meta">
          {[category, date, readTime].filter(Boolean).join(" • ")}
        </div>

        <Link href={href} className="insight-card__title-link">
          <h3
            className="insight-card__title"
            dangerouslySetInnerHTML={{ __html: post.title?.rendered || "" }}
          />
        </Link>

        <div
          className="insight-card__excerpt"
          dangerouslySetInnerHTML={{ __html: post.excerpt?.rendered || "" }}
        />

        <Link href={href} className="insight-card__btn">
          Read article
        </Link>

        {hasAuthor && (
          <div className="insight-card__author">
            {authorPhotoUrl ? (
              <Image
                src={authorPhotoUrl}
                alt={authorName || ""}
                className="insight-card__author-photo"
                width={44}
                height={44}
              />
            ) : (
              <div className="insight-card__author-photo insight-card__author-photo--placeholder" />
            )}
            <div className="insight-card__author-info">
              {authorName && <span className="insight-card__author-name">{authorName}</span>}
              {authorRole && <span className="insight-card__author-role">{authorRole}</span>}
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
