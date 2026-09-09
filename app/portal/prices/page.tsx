import { redirect } from "next/navigation";

// Тимчасово вимкнено на прохання власника — простий текстовий прайс без
// фото не влаштовує. Планується прайс-каталог із фото замість цієї
// сторінки; попередня реалізація лишається в історії git для повторного
// використання.
export default async function PortalPricesPage() {
  redirect("/portal");
}
