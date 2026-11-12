import type { HTMLAttributes, HTMLInputTypeAttribute } from "react";

export type AccountFieldConfig = {
  name: string;
  label: string;
  type: HTMLInputTypeAttribute;
  autoComplete: string;
  inputMode?: HTMLAttributes<HTMLInputElement>["inputMode"];
  placeholder?: string;
  help?: string;
};

export const SIGN_IN_FIELDS = [
  {
    name: "email",
    label: "E-mail",
    type: "email",
    autoComplete: "email",
    placeholder: "voce@email.com",
  },
  {
    name: "password",
    label: "Senha",
    type: "password",
    autoComplete: "current-password",
  },
] as const satisfies readonly AccountFieldConfig[];

export const SIGN_UP_FIELDS = [
  {
    name: "name",
    label: "Nome completo",
    type: "text",
    autoComplete: "name",
  },
  {
    name: "cpf",
    label: "CPF",
    type: "text",
    autoComplete: "off",
    inputMode: "numeric",
    placeholder: "000.000.000-00",
  },
  {
    name: "email",
    label: "E-mail",
    type: "email",
    autoComplete: "email",
    placeholder: "voce@email.com",
  },
  {
    name: "password",
    label: "Senha",
    type: "password",
    autoComplete: "new-password",
    help: "Pelo menos 8 caracteres.",
  },
  {
    name: "phone",
    label: "Telefone",
    type: "tel",
    autoComplete: "tel",
    placeholder: "(00) 00000-0000",
  },
] as const satisfies readonly AccountFieldConfig[];

export const FORGOT_PASSWORD_FIELDS = [
  {
    name: "email",
    label: "E-mail da conta",
    type: "email",
    autoComplete: "email",
    placeholder: "voce@email.com",
  },
] as const satisfies readonly AccountFieldConfig[];
