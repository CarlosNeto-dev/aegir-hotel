"use client";

import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/app/_shared/auth/AuthProvider/AuthProvider";
import { firstName } from "@/app/_shared/auth/auth-utils";
import { usePanels } from "@/app/_shared/panels/PanelProvider/PanelProvider";
import SidePanel from "@/app/_shared/panels/SidePanel/SidePanel";
import { ACTIONS } from "@/app/_shared/site-header/header-utils/header-items";
import {
  ACCOUNT_EYEBROW,
  ACCOUNT_VIEWS,
  type AccountView,
} from "../account-utils/account-views";
import EmailSent from "../account-views/EmailSent/EmailSent";
import ForgotPassword from "../account-views/ForgotPassword/ForgotPassword";
import SignedIn from "../account-views/SignedIn/SignedIn";
import SignIn from "../account-views/SignIn/SignIn";
import SignUp from "../account-views/SignUp/SignUp";
import styles from "./AccountPanel.module.scss";

type GuestView = Exclude<AccountView, "signedIn">;

export default function AccountPanel() {
  const { layer } = usePanels();
  const { guest, signIn, signOut } = useAuth();
  const isOpen = layer === "account";
  const [guestView, setGuestView] = useState<GuestView>("signIn");
  const rootRef = useRef<HTMLDivElement>(null);
  const navigated = useRef(false);
  const view: AccountView = guest ? "signedIn" : guestView;

  useEffect(() => {
    if (isOpen) return;
    navigated.current = false;
    setGuestView("signIn");
  }, [isOpen]);

  useEffect(() => {
    if (!navigated.current) return;
    rootRef.current?.querySelector<HTMLElement>("input, button")?.focus();
  }, [view]);

  function navigate(next: AccountView) {
    navigated.current = true;
    if (next === "signedIn") {
      signIn();
      return;
    }
    if (guest) signOut();
    setGuestView(next);
  }

  const title = guest
    ? `Olá, ${firstName(guest.name)}`
    : ACCOUNT_VIEWS[view].title;

  return (
    <SidePanel
      layer="account"
      id={ACTIONS.account.controls}
      eyebrow={ACCOUNT_EYEBROW}
      title={title}
    >
      <div ref={rootRef} className={styles.root}>
        {view === "signIn" && <SignIn onNavigate={navigate} />}
        {view === "signUp" && <SignUp onNavigate={navigate} />}
        {view === "forgotPassword" && <ForgotPassword onNavigate={navigate} />}
        {view === "emailSent" && <EmailSent onNavigate={navigate} />}
        {view === "signedIn" && <SignedIn onNavigate={navigate} />}
      </div>
    </SidePanel>
  );
}
