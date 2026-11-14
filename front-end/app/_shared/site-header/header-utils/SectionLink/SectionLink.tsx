"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AriaAttributes, MouseEvent, ReactNode } from "react";
import { scrollToSection } from "../../header-hooks/scroll-to-section";

type SectionLinkProps = {
  href: `#${string}`;
  className?: string;
  children: ReactNode;
  onNavigate?: () => void;
} & AriaAttributes;

export default function SectionLink({
  href,
  className,
  children,
  onNavigate,
  ...aria
}: SectionLinkProps) {
  const pathname = usePathname();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onNavigate?.();
    if (pathname !== "/") return;
    if (event.metaKey || event.ctrlKey || event.shiftKey) return;
    event.preventDefault();
    scrollToSection(href.slice(1));
  }

  return (
    <Link href={`/${href}`} className={className} onClick={handleClick} {...aria}>
      {children}
    </Link>
  );
}
