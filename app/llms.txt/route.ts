import { SITE_URL } from "@/lib/seo";

// llms.txt (llmstxt.org) — короткий факт-насичений опис сайту для AI-агентів
// та LLM-пошуковиків (ChatGPT, Perplexity тощо), аналог robots.txt/sitemap.xml,
// але для "розуміння" сайту, а не для сканування. Тримаємо тут, а не як
// статичний файл у public/, щоб посилання автоматично оновились на
// inwood.com.ua, коли домен перенесуть (SITE_URL з lib/seo.ts).
function buildLlmsTxt(): string {
  const u = (path: string) => `${SITE_URL}${path}`;

  return `# IN WOOD

> IN WOOD is a full-cycle interior door manufacturer based in Poltava, Ukraine, with 20+ years of experience, 50+ door models across 4 collections, a dealer network of 35+ partners across Ukraine, and export experience to the United Kingdom, France, Switzerland, Lithuania, and Latvia.

IN WOOD designs and manufactures its own interior doors (panel/skinned doors, veneered doors, PVC-film-coated doors, painted doors, and concealed-installation/hidden doors) at its own production facility in Poltava. The site is available in Ukrainian (default), Russian, and English. Prices are shown to retail visitors when enabled by the manufacturer; wholesale/dealer pricing requires a partner-portal login.

## Product collections

- [ETALON](${u("/ua/catalog#etalon")}): panel door collection, 40 mm slab thickness, wooden frame 80×27 mm, honeycomb core (18 mm cell), 6 mm MDF facing, aluminum molding, PVC film finish.
- [NOMINAL](${u("/ua/catalog#nominal")}): panel door collection, 34 mm slab thickness, same core construction as ETALON, PVC film finish.
- [FREZZATTI](${u("/ua/catalog#frezzatti")}): 34 mm slab thickness, 4 mm MDF facing, finished in PVC film or RAL/NCS painted colors.
- [PERFETTO](${u("/ua/catalog#perfetto")}): 40 mm slab thickness, 6 mm MDF facing, RAL/NCS painted colors only.
- [Hidden-installation doors](${u("/ua/catalog#hidden-doors")}): concealed/flush-mount interior doors.

Standard slab sizes: height 1800-2100 mm (max 2300 mm, 50 mm step), width 600-900 mm (50 mm step).

## Key pages

- [Catalog](${u("/ua/catalog")}): full retail catalog with an interactive price calculator (color, frame/casing/jamb-extension, hardware routing, soundproofing, custom sizing).
- [Gallery](${u("/ua/galereya")}): real interior photos grouped by model and color across all 4 collections.
- [About us](${u("/ua/pro-nas")}): company background and production facts.
- [Specifications](${u("/ua/harakterystyky")}): technical construction details per collection (materials, layer thicknesses, sizing).
- [Our dealers](${u("/ua/nashi-dileri")}): dealer network map and list, grouped by city.
- [Become a partner](${u("/ua/spivpratsya")}): dealership/distribution/export partnership terms and application form.
- [Payment and delivery](${u("/ua/oplata-dostavka")}): payment and shipping terms for dealers and export partners.
- [Service](${u("/ua/servis")}): after-sales service terms.
- [Warranty](${u("/ua/garantiya")}): warranty terms for dealers and export partners.
- [FAQ](${u("/ua/faq")}): common questions about manufacturing lead times, sizing, materials, installation, and warranty.
- [Blog](${u("/ua/blog")}): articles about choosing, installing, and maintaining interior doors.
- [Contacts](${u("/ua/kontakty")}): address, phone, email, and contact form.
- [Partner portal](${u("/portal/login")}): login for dealers, distributors, and staff to view wholesale pricing and place orders (not indexed by search engines).

## Contact

- Address: 4 Sportyvnyi Lane, Poltava, Ukraine
- Phone: +380 (50) 880-38-41
- Export inquiries: +380 (50) 308-18-99, export@inwood.com.ua
- Email: info@inwood.com.ua

## Notes

- This site is currently hosted at ${SITE_URL}; the production domain inwood.com.ua has not yet been migrated to it.
- Pricing shown publicly is retail pricing and may be hidden or shown at the manufacturer's discretion; wholesale/dealer pricing is only available through the partner portal.
`;
}

export async function GET() {
  return new Response(buildLlmsTxt(), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
