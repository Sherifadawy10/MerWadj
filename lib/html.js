const NAMED_ENTITIES = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  hellip: "…",
  mdash: "—",
  ndash: "–",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
  laquo: "«",
  raquo: "»",
  deg: "°",
  eacute: "é",
  egrave: "è",
  trade: "™",
  copy: "©",
  reg: "®",
};

/**
 * Decodes the entities WordPress puts in `rendered` fields.
 * Stripping tags with a regex leaves `&#8217;` behind and it ends up
 * visible in excerpts — this is the second half of that job.
 */
export function decodeEntities(input = "") {
  return String(input)
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&([a-z][a-z0-9]*);/gi, (match, name) => {
      const key = name.toLowerCase();
      return Object.prototype.hasOwnProperty.call(NAMED_ENTITIES, key)
        ? NAMED_ENTITIES[key]
        : match;
    });
}

/** Tags out, entities decoded, whitespace collapsed. */
export function stripHtml(input = "") {
  return decodeEntities(String(input).replace(/<[^>]+>/g, " "))
    .replace(/\s+/g, " ")
    .trim();
}

/** stripHtml plus a hard character budget, cut on a word boundary. */
export function excerptFrom(input = "", maxLength = 180) {
  const text = stripHtml(input);
  if (text.length <= maxLength) return text;
  const cut = text.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(" ");
  return `${(lastSpace > 0 ? cut.slice(0, lastSpace) : cut).replace(/[,.;:]$/, "")}…`;
}
