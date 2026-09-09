export type PortalRole = "dealer" | "dealer_distributor" | "manager" | "staff";
export type Tariff = "retail" | "dealer" | "distributor" | "builder" | "epicenter" | "export";

export const VIEW_AS_COOKIE = "portal_view_as";

export const PORTAL_ROLES: PortalRole[] = ["dealer", "dealer_distributor", "manager", "staff"];

export const roleLabels: Record<PortalRole, string> = {
  dealer: "Дилер",
  dealer_distributor: "Дилер + роздріб + дистрибуція",
  manager: "Менеджер (тільки калькулятор)",
  staff: "Співробітник IN WOOD",
};

// Той самий розподіл тарифів за роллю, що й у RLS-політиках Supabase
// (supabase/migrations/0009_manager_role.sql) — тримати синхронізованим.
export const TARIFFS_BY_ROLE: Record<PortalRole, Tariff[] | "all"> = {
  dealer: ["dealer"],
  dealer_distributor: ["retail", "dealer", "distributor"],
  manager: "all",
  staff: "all",
};

export function isPortalRole(value: unknown): value is PortalRole {
  return typeof value === "string" && (PORTAL_ROLES as string[]).includes(value);
}
