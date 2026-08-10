import HeaderClient from "@/components/HeaderClient";
import { getMenu, getSiteOptions } from "@/lib/wordpress";

export default async function Header() {
  let menu = [];
  let logoSvg = null;
  let blackLogoSvg = null;

  try {
    const [menuData, options] = await Promise.all([
      getMenu("primary_menu"),
      getSiteOptions(),
    ]);
    menu = menuData;
    const raw = options?.logo;
    const rawBlack = options?.black_logo || options?.["black-logo"];
    logoSvg = typeof raw === "string" && raw.trim() ? raw.trim() : null;
    blackLogoSvg = typeof rawBlack === "string" && rawBlack.trim() ? rawBlack.trim() : null;
  } catch (error) {
    console.error(error);
  }

  return <HeaderClient menu={menu} logoSvg={logoSvg} blackLogoSvg={blackLogoSvg} />;
}
