import { readFileSync } from "fs";
import { join } from "path";

export const dynamic = "force-static";
export const contentType = "image/svg+xml";

export default function Icon() {
  const svg = readFileSync(join(process.cwd(), "public/logo.svg"), "utf-8");
  return new Response(svg, {
    headers: { "Content-Type": "image/svg+xml" },
  });
}
