import { initials, type Guest } from "../auth-utils";
import styles from "./GuestAvatar.module.scss";

type GuestAvatarProps = {
  guest: Pick<Guest, "name">;
  className?: string;
};

export default function GuestAvatar({ guest, className = "" }: GuestAvatarProps) {
  return (
    <span className={`${styles.root} ${className}`} aria-hidden="true">
      {initials(guest.name)}
    </span>
  );
}
