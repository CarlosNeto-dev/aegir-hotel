export type Guest = { name: string; email: string };

export const PREVIEW_GUEST: Guest = {
  name: "Hóspede Aegir",
  email: "voce@email.com",
};

export function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("");
}

export function firstName(name: string) {
  return name.split(" ")[0];
}
