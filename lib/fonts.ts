import { Playfair_Display, Manrope } from "next/font/google";

// next/font самостійно хостить шрифти (завантажує їх при білді й віддає
// з того ж домену) замість <link>/@import на fonts.googleapis.com —
// без окремого стороннього запиту, що блокував першу відмальовку сторінки.
export const playfairDisplay = Playfair_Display({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["700", "800", "900"],
  variable: "--font-serif",
  display: "swap",
});

export const manrope = Manrope({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});
