import { SITE_URL } from "@/lib/seo";

// llms.txt (llmstxt.org) — короткий факт-насичений опис сайту для AI-агентів
// та LLM-пошуковиків (ChatGPT, Perplexity тощо), аналог robots.txt/sitemap.xml,
// але для "розуміння" сайту, а не для сканування. Тримаємо тут, а не як
// статичний файл у public/, щоб посилання автоматично оновились на
// inwood.com.ua, коли домен перенесуть (SITE_URL з lib/seo.ts).
function buildLlmsTxt(): string {
  const u = (path: string) => `${SITE_URL}${path}`;

  return `# IN WOOD

> IN WOOD is a full-cycle interior door manufacturer based in Poltava, Ukraine, with 20+ years of experience, 50+ door models across 5 collections, a dealer network of 35+ partners across Ukraine, and export experience to Canada, France, Switzerland, Lithuania, and Latvia.

IN WOOD designs and manufactures its own interior doors (panel/skinned doors, veneered doors, PVC-film-coated doors, painted doors, and concealed-installation/hidden doors) at its own production facility in Poltava. The site is available in Ukrainian (default), Russian, English, and Polish. Prices are shown to retail visitors when enabled by the manufacturer; wholesale/dealer pricing requires a partner-portal login.

## Product collections

- [ETALON](${u("/ua/catalog#etalon")}): panel door collection, 40 mm slab thickness, wooden frame 80×27 mm, honeycomb core (18 mm cell), 6 mm MDF facing, aluminum molding, PVC film finish.
- [NOMINAL](${u("/ua/catalog#nominal")}): panel door collection, 34 mm slab thickness, same core construction as ETALON, PVC film finish.
- [FREZZATTI](${u("/ua/catalog#frezzatti")}): 34 mm slab thickness, 4 mm MDF facing, finished in PVC film or RAL/NCS painted colors.
- [PERFETTO](${u("/ua/catalog#perfetto")}): 40 mm slab thickness, 6 mm MDF facing, RAL/NCS painted colors only.
- [Hidden-installation doors](${u("/ua/catalog#hidden-doors")}): concealed/flush-mount interior doors.

Standard slab sizes: height 1800-2100 mm (max 2300 mm, 50 mm step), width 600-900 mm (50 mm step).

## Key pages

- [Catalog](${u("/ua/catalog")}): full retail catalog with an interactive price calculator (color, frame/casing/jamb-extension, hardware routing, soundproofing, custom sizing).
- [3D door fitting tool](${u("/ua/3d-prymirka-dverei")}): interactive 3D configurator to preview a door model with a chosen film/paint color, frame, and hardware before ordering.
- [Gallery](${u("/ua/galereya")}): real interior photos grouped by model and color across all 4 collections.
- [About us](${u("/ua/pro-nas")}): company background and production facts.
- [Specifications](${u("/ua/harakterystyky")}): technical construction details per collection (materials, layer thicknesses, sizing).
- [Our dealers](${u("/ua/nashi-dileri")}): dealer network map and list, grouped by city, with dedicated pages per city (e.g. Kyiv, Kharkiv, Odesa, Dnipro).
- [Become a partner](${u("/ua/spivpratsya")}): dealership/distribution/export partnership terms and application form. IN WOOD is actively recruiting dealers in cities without current coverage — Lviv, Vinnytsia, Ivano-Frankivsk, Uzhhorod, Chernivtsi, Khmelnytskyi, and Kropyvnytskyi — with a dedicated page per city (e.g. ${u("/ua/staty-dylerom/lviv")}).
- [Payment and delivery](${u("/ua/oplata-dostavka")}): payment and shipping terms for dealers and export partners.
- [Service](${u("/ua/servis")}): after-sales service terms.
- [Warranty](${u("/ua/garantiya")}): warranty terms for dealers and export partners.
- [FAQ](${u("/ua/faq")}): common questions about manufacturing lead times, sizing, materials, installation, and warranty.
- [Blog](${u("/ua/blog")}): articles about choosing, installing, and maintaining interior doors.
- [Contacts](${u("/ua/kontakty")}): address, phone, email, and contact form.
- [Partner portal](${u("/portal/login")}): login for dealers, distributors, and staff to view wholesale pricing and place orders (not indexed by search engines).

## Frequently asked questions

- **How long does it take to manufacture IN WOOD interior doors?** Standard interior doors take 30 days to manufacture. Custom sizes take 45 days.
- **What are the standard sizes of IN WOOD interior doors?** Width: 400-900 mm; height: 1800-2100 mm (up to 2300 mm for an extra fee).
- **What materials are IN WOOD interior doors made of, and how thick are they?** A frame of solid wood and MDF, with a honeycomb core infill; manufactured in 34 mm and 40 mm thickness.
- **Which door finish is better: PVC film or paint?** PVC-film finish is practical, moisture-resistant and easy to maintain. Painted doors have a more premium look, a wide colour palette, and allow more complex design solutions; IN WOOD can paint doors in any colour from the RAL/NCS catalogues.
- **What are flush (hidden) installation doors?** Interior doors with an aluminum frame installed flush with the wall, staying invisible after finishing, with standard and inside opening options — they create the effect of a single plane with the wall.
- **What warranty applies to IN WOOD interior doors?** A 1-year warranty from the shipping date, covering manufacturing and material defects when storage, transport and installation guidelines are followed.
- **Can I buy just the door leaf, without the frame and casing?** Yes, the door leaf can be purchased separately from the frame and casing set.
- **Does IN WOOD operate across all of Ukraine?** Yes, IN WOOD delivers across Ukraine and works with a network of official dealers in many cities (see the dealers page above).

Full list: ${u("/ua/faq")} (also available at /ru/faq, /en/faq, /pl/faq).

## Contact

- Address: 4 Sportyvnyi Lane, Poltava, Ukraine
- Phone: +380 (50) 880-38-41
- Export inquiries: +380 (50) 308-18-99, export@inwood.com.ua
- Email: info@inwood.com.ua

## Notes

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
