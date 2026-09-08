import products from "@/data/products.json";

export type KomplektOption = { label: string; price: number };
export type Komplekt = { korob: KomplektOption[]; lyshtva: KomplektOption[]; dobir: KomplektOption[] };
export type ColorOption = { slug: string; label: string; image: string };
export type ProductModel = { code: string; basePrice: number; colors: ColorOption[] };
export type HiddenVariant = { label: string; price: number; image: string };
export type Collection = {
  label: string;
  thickness: string;
  komplekt: Komplekt;
  extra?: string;
  models?: ProductModel[];
  variants?: HiddenVariant[];
};

export const collections = products as Record<string, Collection>;

export const collectionOrder = ["etalon", "nominal", "frezzatti", "perfetto", "hidden-doors"];
