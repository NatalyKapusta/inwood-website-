import { Playfair_Display, Manrope } from "next/font/google";

// next/font самостійно хостить шрифти (завантажує їх при білді й віддає
// з того ж домену) замість <link>/@import на fonts.googleapis.com —
// без окремого стороннього запиту, що блокував першу відмальовку сторінки.
//
// PageSpeed Insights 23.09.2026: на головній LCP-елемент — h1 заголовок
// (font-serif), і 2,3 з 5,7 секунди LCP йшло на "Задержку при отрисовке" —
// це заміна шрифту (font-display: swap): текст малюється запасним
// шрифтом одразу, але Lighthouse рахує LCP по моменту SWAP на Playfair
// Display, не по першій відмальовці. display: "optional" прибирає цю
// заміну повністю — якщо шрифт не встиг завантажитись у короткий block-
// період (~100мс), сторінка лишається на запасному шрифті для цього
// показу, і повторний заміна пізніше вже не відбувається. Для заголовків
// (не основного тексту) це прийнятний компроміс заради LCP.
export const playfairDisplay = Playfair_Display({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["700", "800", "900"],
  variable: "--font-serif",
  display: "optional",
});

export const manrope = Manrope({
  subsets: ["latin", "latin-ext", "cyrillic"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});
