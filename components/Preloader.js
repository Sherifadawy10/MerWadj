/**
 * `svgCode` arrives from the ACF `preloader` option and has already been
 * through sanitizeInlineSvg(), so it is a real vector under the size budget.
 * Anything raster or oversized is rejected upstream and we fall back to the
 * static mark, which is 1.4 KB of vector rather than 1.2 MB of base64 PNG.
 */
export default function Preloader({ svgCode = null }) {
  return (
    <div className="preloader" aria-hidden="true">
      <div className="preloader__background">
        <div className="preloader__panel preloader__panel--top" />
        <div className="preloader__panel preloader__panel--bottom" />
      </div>

      <div className="preloader__inner">
        <div className="preloader__logo-wrap">
          {svgCode ? (
            <div
              className="preloader__logo"
              dangerouslySetInnerHTML={{ __html: svgCode }}
            />
          ) : (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src="/logo.svg"
              alt=""
              width={96}
              height={96}
              className="preloader__logo"
            />
          )}
        </div>
      </div>
    </div>
  );
}
