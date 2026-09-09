// Довідкові фото короба/лиштви/добору — загальні (не по кожній колекції окремо),
// перенесено з оригінального калькулятора. Показують, що саме означає обрана
// позиція (Телескопічний/Компланарний/прихованого монтажу), а не лише текст.
const ADDON_REFERENCE_PHOTOS = {
  aluminKorob: "/photos/addon-reference/alumin_korob.jpg",
  kompanarniyKorob: "/photos/addon-reference/kompanarniy_korob.jpg",
  kompanarniyNalichnik: "/photos/addon-reference/kompanarniy_nalichnik.jpg",
  teleskopicheskiyDobor: "/photos/addon-reference/teleskopicheskiy_dobor.jpg",
  teleskopicheskiyKorob: "/photos/addon-reference/teleskopicheskiy_korob.jpg",
  teleskopicheskiyNalichnik: "/photos/addon-reference/teleskopicheskiy_nalichnik.jpg",
} as const;

export function addonPhotoFor(addonType: "korob" | "lishtva" | "dobir", label: string | undefined) {
  if (!label) return undefined;
  if (addonType === "korob") {
    if (label.includes("прихованого монтажу")) return ADDON_REFERENCE_PHOTOS.aluminKorob;
    if (label.includes("Компланарний")) return ADDON_REFERENCE_PHOTOS.kompanarniyKorob;
    if (label.includes("Телескопічний")) return ADDON_REFERENCE_PHOTOS.teleskopicheskiyKorob;
    return undefined;
  }
  if (addonType === "lishtva") {
    if (label.includes("Компланарна")) return ADDON_REFERENCE_PHOTOS.kompanarniyNalichnik;
    if (label.includes("Телескопічна")) return ADDON_REFERENCE_PHOTOS.teleskopicheskiyNalichnik;
    if (label.includes("Система алюм. профілів")) return ADDON_REFERENCE_PHOTOS.aluminKorob;
    return undefined;
  }
  return ADDON_REFERENCE_PHOTOS.teleskopicheskiyDobor;
}
