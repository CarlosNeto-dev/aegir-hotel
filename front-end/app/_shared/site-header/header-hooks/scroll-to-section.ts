import { goToSection } from "../../lib/section-nav";
import { NAV_ITEMS } from "../header-utils/header-items";

export function scrollToSection(id: string) {
  const item = NAV_ITEMS.find((entry) => entry.id === id);
  return goToSection(id, item?.label ?? "");
}
