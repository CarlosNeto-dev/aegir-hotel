export const SETTINGS_ROUTES = ["/"] as const;

export function hasSettings(pathname: string) {
  return SETTINGS_ROUTES.some((route) =>
    route === "/"
      ? pathname === "/"
      : pathname === route || pathname.startsWith(`${route}/`),
  );
}
