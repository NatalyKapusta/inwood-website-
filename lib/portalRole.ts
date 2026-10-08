export type PortalRole =
  | "dealer"
  | "dealer_distributor"
  | "manager"
  | "staff"
  | "epicenter"
  | "distributor"
  | "builder"
  | "export";
export type Tariff = "retail" | "dealer" | "distributor" | "builder" | "epicenter" | "export";

export const VIEW_AS_COOKIE = "portal_view_as";

export const PORTAL_ROLES: PortalRole[] = [
  "dealer",
  "dealer_distributor",
  "manager",
  "staff",
  "epicenter",
  "distributor",
  "builder",
  "export",
];

export const roleLabels: Record<PortalRole, string> = {
  dealer: "Дилер",
  dealer_distributor: "Дилер + роздріб + дистрибуція",
  manager: "Менеджер (тільки калькулятор)",
  staff: "Співробітник IN WOOD",
  epicenter: "Епіцентр",
  distributor: "Дистриб'ютор",
  builder: "Забудовник",
  export: "Експорт",
};

// Той самий розподіл тарифів за роллю, що й у RLS-політиках Supabase
// (supabase/migrations/0014_extra_tariff_roles.sql, 0031_extra_roles_see_retail.sql)
// — тримати синхронізованим.
export const TARIFFS_BY_ROLE: Record<PortalRole, Tariff[] | "all"> = {
  dealer: ["retail", "dealer"],
  dealer_distributor: ["retail", "dealer", "distributor"],
  manager: "all",
  staff: "all",
  epicenter: ["retail", "epicenter"],
  distributor: ["retail", "distributor"],
  builder: ["retail", "builder"],
  export: ["retail", "export"],
};

export function isPortalRole(value: unknown): value is PortalRole {
  return typeof value === "string" && (PORTAL_ROLES as string[]).includes(value);
}
