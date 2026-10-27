import Link from "next/link";
import { NAV_ITEMS } from "../header-items";
import styles from "./HeaderNavList.module.scss";

type HeaderNavListProps = {
  variant: "bar" | "drawer";
  activeId?: string;
  onNavigate?: () => void;
};

export default function HeaderNavList({
  variant,
  activeId,
  onNavigate,
}: HeaderNavListProps) {
  return (
    <div className={`${styles.root} ${styles[variant]}`}>
      {variant === "bar" && (
        <span className={styles.indicator} aria-hidden="true" />
      )}
      <ul className={styles.list}>
        {NAV_ITEMS.map((item) => (
          <li key={item.id}>
            <Link
              href={item.href}
              className={styles.link}
              aria-current={item.id === activeId ? "location" : undefined}
              onClick={onNavigate}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
