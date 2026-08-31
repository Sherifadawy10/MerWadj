"use client";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Image from "next/image";
import { stripHtml } from "@/lib/html";

function decodeHtml(str) {
  if (!str) return "";
  return str.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&#(\d+);/g, (_, code) => String.fromCharCode(code));
}

export default function MatCatalog({ eyebrow, title, stones = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeCategory, setActiveCategory] = useState(null);
  const [modalStone, setModalStone] = useState(null);
  const [windowWidth, setWindowWidth] = useState(null);
  const touchStartX = useRef(null);

  const categories = useMemo(() => {
    const seen = new Set();
    const result = [];
    stones.forEach((stone) => {
      const cats = stone.stone_categories;
      if (Array.isArray(cats) && cats.length) {
        cats.forEach((cat) => {
          if (!seen.has(cat.slug)) {
            seen.add(cat.slug);
            result.push(cat);
          }
        });
      } else if (stone.acf?.stone_category) {
        const val = stone.acf.stone_category;
        if (!seen.has(val)) {
          seen.add(val);
          result.push({ slug: val, name: val });
        }
      }
    });
    return result;
  }, [stones]);

  const filteredStones = useMemo(() => {
    if (!activeCategory) return stones;
    return stones.filter((stone) => {
      if (Array.isArray(stone.stone_categories) && stone.stone_categories.length) {
        return stone.stone_categories.some((cat) => cat.slug === activeCategory);
      }
      return stone.acf?.stone_category === activeCategory;
    });
  }, [stones, activeCategory]);

  const total = filteredStones.length;

  useEffect(() => {
    const update = () => setWindowWidth(window.innerWidth);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const arcParams = useMemo(() => {
    if (!windowWidth || windowWidth > 959) return { R: 960, STEP_POS: 20, STEP_ROT: 25 };
    if (windowWidth <= 480) return { R: 640, STEP_POS: 20, STEP_ROT: 25 };
    return { R: 810, STEP_POS: 20, STEP_ROT: 25 };
  }, [windowWidth]);

  useEffect(() => { setActiveIndex(0); }, [activeCategory]);

  const prev = useCallback(
    () => setActiveIndex((i) => (i - 1 + total) % total),
    [total]
  );
  const next = useCallback(
    () => setActiveIndex((i) => (i + 1) % total),
    [total]
  );

  const handleTouchStart = useCallback((e) => {
    touchStartX.current = e.touches[0].clientX;
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) dx < 0 ? next() : prev();
    touchStartX.current = null;
  }, [next, prev]);

  useEffect(() => {
    const onKey = (e) => {
      if (modalStone) return;
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalStone, prev, next]);

  useEffect(() => {
    document.body.style.overflow = modalStone ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modalStone]);

  if (!stones.length) return null;

  const slides = filteredStones
    .map((stone, stoneIdx) => {
      let offset = ((stoneIdx - activeIndex) % total + total) % total;
      if (offset > Math.floor(total / 2)) offset -= total;
      return { stone, stoneIdx, offset };
    })
    .filter(({ offset }) => Math.abs(offset) <= 3);

  return (
    <section className="mat-catalog">
      <div className="mat-catalog__header">
        {eyebrow && <p className="mat-catalog__eyebrow">{eyebrow}</p>}
        {title && <h1 className="mat-catalog__title">{title}</h1>}
      </div>

      {categories.length > 0 && (
        <div className="mat-catalog__filter">
          <button
            className={`mat-catalog__filter-item${!activeCategory ? " mat-catalog__filter-item--active" : ""}`}
            onClick={() => setActiveCategory(null)}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.slug}
              className={`mat-catalog__filter-item${activeCategory === cat.slug ? " mat-catalog__filter-item--active" : ""}`}
              onClick={() => setActiveCategory(cat.slug)}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      <div className="mat-catalog__stage" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
        {slides.map(({ offset, stone, stoneIdx }) => {
          const name = decodeHtml(stone?.title?.rendered ?? stone?.title ?? "");
          const imageUrl = stone?.featuredImage?.sourceUrl ?? "";
          const category = stone?.acf?.stone_category ?? "";
          const use = stone?.acf?.stone_use ?? "";
          const meta = [category, use].filter(Boolean).join(" / ");
          const isActive = offset === 0;

          return (
            <div
              key={stoneIdx}
              className={`mat-catalog__card${isActive ? " mat-catalog__card--active" : ""}`}
              style={getCardStyle(offset, arcParams)}
              onClick={() =>
                isActive
                  ? setModalStone(stone)
                  : setActiveIndex((activeIndex + offset + total) % total)
              }
              role="button"
              tabIndex={isActive ? 0 : -1}
              aria-label={isActive ? `Open ${name}` : `Go to ${name}`}
            >
              {imageUrl && <div className="mat-catalog__card-face mat-catalog__card-face--left"  style={{ backgroundImage: `url(${imageUrl})` }} />}
              {imageUrl && <div className="mat-catalog__card-face mat-catalog__card-face--right" style={{ backgroundImage: `url(${imageUrl})` }} />}
              <div className="mat-catalog__card-inner" style={{ filter: `brightness(${[1, 0.62, 0.30][Math.abs(offset)] ?? 0.18})`, transition: "filter 0.6s ease" }}>
                {imageUrl && (
                  <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    className="mat-catalog__card-img"
                    draggable={false}
                  />
                )}
                {isActive && (
                  <div className="mat-catalog__card-caption">
                    <p className="mat-catalog__card-name">{name}</p>
                    {meta && <p className="mat-catalog__card-meta">{meta}</p>}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mat-catalog__nav">
        <button className="mat-catalog__nav-btn" onClick={prev} aria-label="Previous">
          <svg width="26" height="21" viewBox="0 0 26 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.24214e-07 10.4167L9.80625 20.2229C9.99968 20.4163 10.2293 20.5698 10.482 20.6744C10.7348 20.7791 11.0056 20.833 11.2792 20.833C11.5527 20.833 11.8236 20.7791 12.0763 20.6744C12.329 20.5698 12.5587 20.4163 12.7521 20.2229C12.9455 20.0295 13.0989 19.7998 13.2036 19.5471C13.3083 19.2944 13.3622 19.0235 13.3622 18.75C13.3622 18.4764 13.3083 18.2056 13.2036 17.9529C13.0989 17.7001 12.9455 17.4705 12.7521 17.2771L7.975 12.5L23.7792 12.5C24.3317 12.5 24.8616 12.2805 25.2523 11.8898C25.643 11.4991 25.8625 10.9692 25.8625 10.4167C25.8625 9.86412 25.643 9.33422 25.2523 8.94352C24.8616 8.55281 24.3317 8.33332 23.7792 8.33332L7.975 8.33332L12.7521 3.55624C12.9462 3.36321 13.1003 3.13371 13.2054 2.88093C13.3105 2.62815 13.3647 2.35709 13.3647 2.08332C13.3647 1.80955 13.3105 1.53849 13.2054 1.28571C13.1003 1.03293 12.9462 0.803429 12.7521 0.610401C12.3614 0.219837 11.8316 0.000431202 11.2792 0.000431195C10.7267 0.000431189 10.1969 0.219837 9.80625 0.610401L1.24214e-07 10.4167Z" fill="white" fillOpacity="0.2"/>
          </svg>
        </button>
        <button className="mat-catalog__nav-btn" onClick={next} aria-label="Next">
          <svg width="26" height="21" viewBox="0 0 26 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M25.8633 10.4164L16.057 0.610103C15.8636 0.416677 15.634 0.263241 15.3813 0.15856C15.1285 0.0538783 14.8577 -4.79033e-07 14.5841 -4.93028e-07C14.3106 -5.07023e-07 14.0397 0.0538783 13.787 0.15856C13.5343 0.263241 13.3046 0.416677 13.1112 0.610103C12.9178 0.803529 12.7643 1.03316 12.6597 1.28588C12.555 1.53861 12.5011 1.80947 12.5011 2.08302C12.5011 2.35656 12.555 2.62743 12.6597 2.88016C12.7643 3.13288 12.9178 3.36251 13.1112 3.55594L17.8883 8.33302L2.08412 8.33302C1.53158 8.33302 1.00168 8.55251 0.610975 8.94321C0.220275 9.33391 0.000783489 9.86382 0.000783465 10.4164C0.000783441 10.9689 0.220275 11.4988 0.610975 11.8895C1.00168 12.2802 1.53158 12.4997 2.08412 12.4997L17.8883 12.4997L13.1112 17.2768C12.9171 17.4698 12.763 17.6993 12.6579 17.9521C12.5527 18.2049 12.4986 18.4759 12.4986 18.7497C12.4986 19.0235 12.5527 19.2945 12.6579 19.5473C12.763 19.8001 12.9171 20.0296 13.1112 20.2226C13.5019 20.6132 14.0317 20.8326 14.5841 20.8326C15.1365 20.8326 15.6663 20.6132 16.057 20.2226L25.8633 10.4164Z" fill="white" fillOpacity="0.2"/>
          </svg>
        </button>
      </div>

      {modalStone && (
        <MatModal stone={modalStone} onClose={() => setModalStone(null)} />
      )}
    </section>
  );
}

function getCardStyle(offset, { R = 960, STEP_POS = 20, STEP_ROT = 25 } = {}) {
  const abs = Math.abs(offset);

  const θ = (offset * STEP_POS * Math.PI) / 180;

  const x    = R * Math.sin(θ);           // arc x  (-330px at offset ±1)
  const z    = R * (Math.cos(θ) - 1);     // arc z  (-58px  at offset ±1)
  const rotY = offset * STEP_ROT;         // tilt outward (-25deg at offset -1)

  const scales = [1, 1, 0.9, 0.75];
  const isBuffer = abs >= 3;

  return {
    transform: `translateX(${x.toFixed(1)}px) translateZ(${z.toFixed(1)}px) rotateY(${rotY}deg) scale(${scales[abs] ?? 0.6})`,
    zIndex: 10 - abs * 2,
    opacity: isBuffer ? 0 : 1,
    pointerEvents: isBuffer ? "none" : "auto",
    transition: "transform 0.6s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.4s ease",
  };
}

function MatModal({ stone, onClose }) {
  const [closing, setClosing] = useState(false);
  const acf = stone?.acf ?? {};
  const name = decodeHtml(stone?.title?.rendered ?? stone?.title ?? "");
  const imageUrl = stone?.featuredImage?.sourceUrl ?? "";

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(onClose, 340);
  }, [onClose]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleClose]);

  return (
    <div className={`mat-modal${closing ? " mat-modal--closing" : ""}`} onClick={handleClose}>
      <div className="mat-modal__inner" onClick={(e) => e.stopPropagation()}>
        <button className="mat-modal__close" onClick={handleClose} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 2L16 16M16 2L2 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>

        {imageUrl && (
          <div className="mat-modal__img-wrap">
            <img src={imageUrl} alt={name} className="mat-modal__img" />
          </div>
        )}

        <div className="mat-modal__content">
          <h2 className="mat-modal__name">{name}</h2>
          {acf.stone_code && (
            <p className="mat-modal__code">{acf.stone_code}</p>
          )}
          {acf.stone_description && (
            /*
             * ACF stores this in a wysiwyg field, so the REST value comes
             * back wrapped in <p>. Printed as a text node, those tags were
             * visible to the user.
             */
            <p className="mat-modal__desc">{stripHtml(acf.stone_description)}</p>
          )}
          {acf.stone_thicknesses && (
            <div className="mat-modal__spec">
              <p className="mat-modal__spec-label">THICKNESSES</p>
              <p className="mat-modal__spec-value">{acf.stone_thicknesses}</p>
            </div>
          )}
          {(acf.stone_use || acf.stone_availability) && (
            <div className="mat-modal__tags">
              {acf.stone_use && (
                <span className="mat-modal__tag">{acf.stone_use}</span>
              )}
              {acf.stone_use && acf.stone_availability && (
                <span className="mat-modal__dot">•</span>
              )}
              {acf.stone_availability && (
                <span className="mat-modal__tag">{acf.stone_availability}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
