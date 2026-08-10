"use client";

import { useEffect } from "react";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error(error);
    // ChunkLoadError after a new deploy — reload once to pick up fresh chunks
    if (error?.name === "ChunkLoadError") {
      window.location.reload();
    }
  }, [error]);

  return (
    <div className="page-wrap">
      <div className="error-card">
        <h2 className="error-card__title">Something went wrong</h2>
        <p className="error-card__text">
          The frontend could not load data from WordPress. Check your API URL
          and make sure the WordPress backend is reachable.
        </p>
        <button className="error-card__button" onClick={() => reset()}>
          Try again
        </button>
      </div>
    </div>
  );
}
