"use client";
import { useState } from "react";
import InsightCard from "@/components/InsightCard";

const PER_PAGE = 6;

export default function InsightsBlock({ insights: initialInsights = [], title = "LATEST PUBLICATION" }) {
  const [items, setItems] = useState(initialInsights);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialInsights.length === PER_PAGE);

  if (!initialInsights.length) return null;

  async function loadMore() {
    setLoading(true);
    try {
      const res = await fetch(`/api/insights?perPage=${PER_PAGE}&offset=${items.length}`);
      const next = await res.json();
      setItems((prev) => [...prev, ...next]);
      if (next.length < PER_PAGE) setHasMore(false);
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="insights-block">
      <div className="insights-block__inner">
        <h2 className="insights-block__heading" data-anim="0">{title}</h2>

        <div className="insights-block__list">
          {items.map((post, i) => (
            <InsightCard key={post.id} post={post} animDelay={i * 120} />
          ))}
        </div>

        {hasMore && (
          <div className="insights-block__footer">
            <button
              type="button"
              className="insights-block__load-more"
              onClick={loadMore}
              disabled={loading}
            >
              {loading ? "Loading..." : "Load more articles"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
