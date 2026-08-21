"use client";
import { usePathname } from "next/navigation";
import Preloader from "./Preloader";

export default function PreloaderManager({ svgCode }) {
  const pathname = usePathname();
  return <Preloader key={pathname} svgCode={svgCode} />;
}
