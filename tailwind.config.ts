import type { Config } from "tailwindcss";

// Кольори звірені з живого сайту inwood.com.ua та фірмового логотипу
// (ті самі токени, що й у reference/door-shop-retail.html, --dsh-*)
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          dark: "#333958", // основний navy (шапка, текст заголовків)
          DEFAULT: "#4C547A",
          text: "#3F4669",
          dim: "#626998", // затемнено для WCAG AA (4.5:1) на світлому фоні — було #8A90A6 (2.9:1)
        },
        gold: {
          DEFAULT: "#E3CCA1", // акцент, логотип
          dim: "#8A6836", // затемнено для WCAG AA (4.5:1) на світлому фоні — було #B7935A (2.6:1)
        },
        panel: {
          DEFAULT: "#FFFFFF",
          alt: "#F7F6F2",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
