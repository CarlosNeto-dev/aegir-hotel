"use client";

import { usePathname } from "next/navigation";
import { useAuth } from "../../../auth/AuthProvider/AuthProvider";
import { firstName } from "../../../auth/auth-utils";
import GuestAvatar from "../../../auth/GuestAvatar/GuestAvatar";
import { usePanels } from "../../../panels/PanelProvider/PanelProvider";
import { ACTIONS } from "../header-items";
import { IconUser } from "../HeaderIcons/HeaderIcons";
import styles from "./HeaderAccount.module.scss";

export default function HeaderAccount() {
  const pathname = usePathname();
  const { layer, toggle } = usePanels();
  const { guest } = useAuth();

  if (pathname !== "/") return null;

  return (
    <button
      type="button"
      className={styles.root}
      aria-controls={ACTIONS.account.controls}
      aria-expanded={layer === "account"}
      aria-label={guest ? `Sua conta, ${guest.name}` : ACTIONS.account.label}
      onClick={() => toggle("account")}
    >
      {guest ? <GuestAvatar guest={guest} className={styles.avatar} /> : <IconUser />}
      <span className={styles.label} aria-hidden="true">
        {guest ? firstName(guest.name) : ACTIONS.account.label}
      </span>
    </button>
  );
}
