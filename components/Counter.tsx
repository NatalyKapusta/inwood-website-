// Раніше рахувало вгору з 0 на клієнті (IntersectionObserver): красиво для
// відвідувача, але в статичному HTML, який читають пошуковий робот і
// ШІ-асистент (без виконання JS), завжди лишався буквальний "0" — на
// головній це читалось як "0 років досвіду" (SEO-аудит 23.09.2026, задача 1).
// Блок стоїть на першому екрані обох сторінок, де він використовується,
// тож анімація рахунку тут не потрібна — просто віддаємо готове значення.
export default function Counter({
  to,
  suffix = "",
  label,
}: {
  to: number;
  suffix?: string;
  label: string;
}) {
  return (
    <div className="text-center">
      <p className="font-serif text-4xl font-bold text-gold sm:text-5xl">
        {to}
        {suffix}
      </p>
      <p className="mt-2 text-sm uppercase tracking-wide text-white/80">{label}</p>
    </div>
  );
}
