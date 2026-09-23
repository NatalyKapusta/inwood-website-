export type CollectionPageSlug = "etalon" | "nominal" | "frezzatti" | "perfetto" | "pryhovani-dveri";

export const COLLECTION_PAGE_SLUGS: CollectionPageSlug[] = [
  "etalon",
  "nominal",
  "frezzatti",
  "perfetto",
  "pryhovani-dveri",
];

// URL-слаг сторінки колекції -> id колекції в data/products.json (там
// "приховані двері" мають id "hidden-doors", а не "pryhovani-dveri" —
// той самий id, що на якорі загального каталогу /catalog#hidden-doors).
export const COLLECTION_PAGE_TO_ID: Record<CollectionPageSlug, string> = {
  etalon: "etalon",
  nominal: "nominal",
  frezzatti: "frezzatti",
  perfetto: "perfetto",
  "pryhovani-dveri": "hidden-doors",
};

export function isCollectionPageSlug(v: string): v is CollectionPageSlug {
  return (COLLECTION_PAGE_SLUGS as string[]).includes(v);
}

// Тематичні підсторінки каталогу — не прив'язані до однієї колекції
// (RAL/NCS-фарбування доступне в FREZZATTI і PERFETTO, нестандартні
// розміри — в усіх), тому без ItemList-розмітки й без кнопки "Розрахувати
// вартість" на конкретний якір /catalog — лише текст, характеристики й
// форма. Той самий /catalog/<слаг> URL-простір, що й сторінки колекцій.
export type ThematicPageSlug =
  | "dveri-pid-farbuvannya-ral"
  | "nestandartni-rozmiry"
  | "bili-dveri"
  | "chorni-dveri"
  | "dveri-pid-derevo"
  | "dveri-z-moldyngom";

export const THEMATIC_PAGE_SLUGS: ThematicPageSlug[] = [
  "dveri-pid-farbuvannya-ral",
  "nestandartni-rozmiry",
  "bili-dveri",
  "chorni-dveri",
  "dveri-pid-derevo",
  "dveri-z-moldyngom",
];

export function isThematicPageSlug(v: string): v is ThematicPageSlug {
  return (THEMATIC_PAGE_SLUGS as string[]).includes(v);
}
