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
