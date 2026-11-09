import { ACTIONS } from "../header-items";
import { IconUser } from "../HeaderIcons/HeaderIcons";
import styles from "./HeaderAccount.module.scss";

export default function HeaderAccount() {
  return (
    <button
      type="button"
      className={styles.root}
      aria-controls={ACTIONS.account.controls}
      aria-expanded={false}
    >
      <IconUser />
      <span>{ACTIONS.account.label}</span>
    </button>
  );
}
