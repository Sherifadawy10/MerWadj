import HeaderClient from "@/components/HeaderClient";
import { getMenu, getSiteOptions, sanitizeInlineSvg, withContactLink } from "@/lib/wordpress";
import { filterInsightsFromMenu } from "@/lib/features";

export default async function Header() {
  let menu = [];
  let logoSvg = null;
  let blackLogoSvg = null;

  try {
    const [menuData, options] = await Promise.all([
      getMenu("primary_menu"),
      getSiteOptions(),
    ]);
    menu = filterInsightsFromMenu(withContactLink(menuData));
    logoSvg = sanitizeInlineSvg(options?.logo);
    blackLogoSvg = sanitizeInlineSvg(options?.black_logo || options?.["black-logo"]);
  } catch (error) {
    console.error(error);
  }

  return <HeaderClient menu={menu} logoSvg={logoSvg} blackLogoSvg={blackLogoSvg} />;
}
