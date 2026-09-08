export default function ContactCta({
  title,
  text,
  nameLabel,
  phoneLabel,
  submitLabel,
  extraFields,
}: {
  title: string;
  text: string;
  nameLabel: string;
  phoneLabel: string;
  submitLabel: string;
  extraFields?: { placeholder: string; type?: string }[];
}) {
  return (
    <section className="mx-auto max-w-2xl px-4 py-16 text-center sm:py-24">
      <h2 className="font-serif text-2xl font-bold text-navy-dark sm:text-3xl">{title}</h2>
      <p className="mt-4 text-navy-dim">{text}</p>
      <form className="mx-auto mt-8 flex max-w-md flex-col gap-4">
        <input
          type="text"
          placeholder={nameLabel}
          required
          className="rounded-lg border border-navy-dim/30 px-4 py-3 outline-none focus:border-gold"
        />
        <input
          type="tel"
          placeholder={phoneLabel}
          required
          className="rounded-lg border border-navy-dim/30 px-4 py-3 outline-none focus:border-gold"
        />
        {extraFields?.map((f) => (
          <input
            key={f.placeholder}
            type={f.type ?? "text"}
            placeholder={f.placeholder}
            className="rounded-lg border border-navy-dim/30 px-4 py-3 outline-none focus:border-gold"
          />
        ))}
        <button
          type="submit"
          className="rounded-full bg-navy-dark px-7 py-3 font-semibold text-white transition hover:bg-gold hover:text-navy-dark"
        >
          {submitLabel}
        </button>
      </form>
    </section>
  );
}
