import PhoneInput from "@/components/PhoneInput";
import { submitLead } from "@/app/actions/lead";

type ExtraField = { placeholder: string; type?: string; name?: "email" | "misto" | string };

export default function ContactCta({
  title,
  text,
  nameLabel,
  phoneLabel,
  submitLabel,
  extraFields,
  source,
  sent,
  sentLabel,
}: {
  title: string;
  text: string;
  nameLabel: string;
  phoneLabel: string;
  submitLabel: string;
  extraFields?: ExtraField[];
  source: string;
  sent?: boolean;
  sentLabel?: string;
}) {
  return (
    <section className="mx-auto max-w-2xl px-4 py-16 text-center sm:py-24">
      <h2 className="font-serif text-2xl font-bold text-navy-dark sm:text-3xl">{title}</h2>
      <p className="mt-4 text-navy-dim">{text}</p>

      {sent ? (
        <p className="mx-auto mt-8 max-w-md rounded-lg bg-panel-alt px-6 py-4 text-navy-dark">
          {sentLabel ?? "Дякуємо! Заявку надіслано, ми скоро з вами зв'яжемось."}
        </p>
      ) : (
        <form action={submitLead} className="mx-auto mt-8 flex max-w-md flex-col gap-4">
          <input type="hidden" name="source" value={source} />
          <input
            type="text"
            name="name"
            placeholder={nameLabel}
            required
            className="rounded-lg border border-navy-dim/30 px-4 py-3 outline-none focus:border-gold"
          />
          <PhoneInput
            placeholder={phoneLabel}
            required
            className="w-full rounded-lg border border-navy-dim/30 px-4 py-3 outline-none focus:border-gold"
          />
          {extraFields?.map((f) => (
            <input
              key={f.placeholder}
              type={f.type ?? "text"}
              name={f.name === "email" || f.name === "misto" ? f.name : `comment_${f.placeholder}`}
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
      )}
    </section>
  );
}
