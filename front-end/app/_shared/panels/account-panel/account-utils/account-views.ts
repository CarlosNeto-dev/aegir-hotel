export type AccountView =
  | "signIn"
  | "signUp"
  | "forgotPassword"
  | "emailSent"
  | "signedIn";

export const ACCOUNT_VIEWS: Record<AccountView, { title: string }> = {
  signIn: { title: "Entrar" },
  signUp: { title: "Criar conta" },
  forgotPassword: { title: "Esqueci a senha" },
  emailSent: { title: "Confira seu e‑mail" },
  signedIn: { title: "Olá, hóspede" },
};

export const ACCOUNT_EYEBROW = "Sua conta";
