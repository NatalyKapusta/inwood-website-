// Той самий блок сертифіката на п'яти сторінках (/pro-nas,
// /derzhavnym-zakladam, /export, /dlya-zabudovnykiv, /spivpratsya) —
// тендерний закупівельник, забудовник і закордонний партнер шукають саме
// цей документ, а він раніше лежав лише на /pro-nas (ТЗ 23.09.2026, задача 4).
// Текст спільний для всіх п'яти — dictionaries/*.json, ключ common.certificate.
export default function CertificateBlock({
  title,
  text,
  details,
  pdfHref,
  pdfLabel,
}: {
  title: string;
  text: string;
  details: string[];
  // Скан/PDF сертифіката поки не додано в репозиторій — коли з'явиться
  // файл, посилання можна ввімкнути одразу на всіх п'яти сторінках, не
  // чіпаючи розмітку кожної окремо.
  pdfHref?: string;
  pdfLabel?: string;
}) {
  return (
    <section className="bg-panel-alt py-16 text-center sm:py-24">
      <div className="mx-auto max-w-3xl px-4">
        <h2 className="font-serif text-xl font-bold text-navy-dark">{title}</h2>
        <p className="mt-4 text-navy-dim">{text}</p>
        <ul className="mx-auto mt-6 max-w-md space-y-2 text-left text-sm text-navy-dark">
          {details.map((d) => (
            <li key={d} className="flex items-start gap-2">
              <span className="text-gold-dim">✔</span>
              <span>{d}</span>
            </li>
          ))}
        </ul>
        {pdfHref && (
          <a
            href={pdfHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold-dim hover:text-navy-dark"
          >
            {pdfLabel} →
          </a>
        )}
      </div>
    </section>
  );
}
