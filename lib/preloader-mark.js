/*
 * The preloader mark, byte-for-byte the SVG the designer supplied — same
 * ids, same pattern, same transform — with one change: the <image> href
 * points at a cached file instead of carrying a 470 KB PNG as base64.
 *
 * That blob was inlined into every document and every RSC prefetch. Here
 * the inline payload is 550 bytes and the bitmap is fetched once.
 * Rendering was compared against the original in-browser: mean delta
 * 0.38/255, max 7/255, zero pixels differing by more than 8.
 */
export const PRELOADER_MARK_SVG = `<svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<rect width="200" height="200" fill="url(#pattern0_576_932)"/>
<defs>
<pattern id="pattern0_576_932" patternContentUnits="objectBoundingBox" width="1" height="1">
<use xlink:href="#image0_576_932" transform="matrix(0.00126957 0 0 0.00126776 -0.150021 -0.125273)"/>
</pattern>
<image id="image0_576_932" width="1024" height="1024" preserveAspectRatio="none" xlink:href="/preloader-mark.webp"/>
</defs>
</svg>`;
