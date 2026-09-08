import printEn from "@/data/print-en.json";

const { PRINT_EN_STATIC, PRINT_EN_TIERS, PRINT_EN_CATALOG, PRINT_EN_ROOTS } = printEn as unknown as {
  PRINT_EN_STATIC: Record<string, string>;
  PRINT_EN_TIERS: Record<string, string>;
  PRINT_EN_CATALOG: Record<string, string>;
  PRINT_EN_ROOTS: [string, string][];
};

export { PRINT_EN_STATIC, PRINT_EN_TIERS };

// Переклад назви товару/позиції для друку: точний збіг у каталозі,
// інакше — послідовна заміна кореневих слів (той самий алгоритм,
// що й translateForPrint() в оригінальному калькуляторі).
export function translateForPrint(str: string): string {
  if (!str) return str;
  if (Object.prototype.hasOwnProperty.call(PRINT_EN_CATALOG, str)) return PRINT_EN_CATALOG[str];
  let out = str;
  for (const [uk, en] of PRINT_EN_ROOTS) {
    out = out.split(uk).join(en);
  }
  return out;
}
