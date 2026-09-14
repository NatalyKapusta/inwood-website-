// Категорії-піли на головній сторінці (dict.home.categories) — посилання на
// каталог із попереднім фільтром. Порядок slug'ів відповідає порядку рядків
// у dict.home.categories (усі 4 мови); значення підтверджені власницею сайту
// в переписці з СММ/технологом.
export type CatalogCategorySlug =
  | "shchytovi"
  | "shtuchne-pokryttia"
  | "farbovani"
  | "frezerovani"
  | "dekor"
  | "prykhovanyi-montazh";

export const catalogCategorySlugs: CatalogCategorySlug[] = [
  "shchytovi",
  "shtuchne-pokryttia",
  "farbovani",
  "frezerovani",
  "dekor",
  "prykhovanyi-montazh",
];

export type CatalogCategoryDef = {
  collections: string[];
  // collectionId -> коди моделей, які треба виключити з цієї колекції
  excludeModelCodes?: Record<string, string[]>;
};

const MAIN_FOUR = ["etalon", "nominal", "frezzatti", "perfetto"];

export const catalogCategories: Record<CatalogCategorySlug, CatalogCategoryDef> = {
  // Увесь асортимент IN WOOD — щитової конструкції.
  shchytovi: { collections: MAIN_FOUR },
  // Те саме, що й щитові — окремо не рахуємо "Двері прихованого монтажу"/
  // "Двері під фарбування" покриттям (за уточненням власниці).
  "shtuchne-pokryttia": { collections: MAIN_FOUR },
  // Фарбування RAL/NCS доступне на FREZZATTI та PERFETTO — той самий набір
  // моделей, що й "фрезеровані" (відрізняється лише варіант покриття, який
  // каталог не фільтрує на рівні кольору).
  farbovani: { collections: ["frezzatti", "perfetto"] },
  frezerovani: { collections: ["frezzatti", "perfetto"] },
  // Усі моделі ETALON окрім ET-01 (базова, без декору) та NOMINAL окрім NL-01.
  // ET-19/ET-20 (дзеркальні вставки) поки відсутні в даних сайту.
  dekor: {
    collections: ["etalon", "nominal"],
    excludeModelCodes: { etalon: ["ET-01"], nominal: ["NL-01"] },
  },
  "prykhovanyi-montazh": { collections: ["hidden-doors"] },
};
