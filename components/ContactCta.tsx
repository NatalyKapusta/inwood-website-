import PhoneInput from "@/components/PhoneInput";
import { submitLead } from "@/app/actions/lead";
import LeadConversionTracker from "@/components/LeadConversionTracker";

type ExtraField = {
  placeholder: string;
  type?: string;
  name?: "email" | "misto" | string;
  options?: string[];
};

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
  phoneManualLabel,
  phoneChooseCountryLabel,
  phoneInvalidLabel,
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
  phoneManualLabel?: string;
  phoneChooseCountryLabel?: string;
  phoneInvalidLabel?: string;
}) {
  return (
    <section className="mx-auto max-w-2xl px-4 py-16 text-center sm:py-24">
      <h2 className="font-serif text-2xl font-bold text-navy-dark sm:text-3xl">{title}</h2>
      <p className="mt-4 text-navy-dim">{text}</p>

      {sent ? (
        <>
          <LeadConversionTracker source={source} />
          <p className="mx-auto mt-8 max-w-md rounded-lg bg-panel-alt px-6 py-4 text-navy-dark">
            {sentLabel ?? "Дякуємо! Заявку надіслано, ми скоро з вами зв'яжемось."}
          </p>
        </>
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
            manualLabel={phoneManualLabel}
            chooseCountryLabel={phoneChooseCountryLabel}
            invalidLabel={phoneInvalidLabel}
          />
          {extraFields?.map((f) =>
            f.options ? (
              <select
                key={f.placeholder}
                name={f.name === "email" || f.name === "misto" ? f.name : `comment_${f.placeholder}`}
                defaultValue=""
                className="rounded-lg border border-navy-dim/30 px-4 py-3 text-navy-dark outline-none focus:border-gold"
              >
                <option value="" disabled>
                  {f.placeholder}
                </option>
                {f.options.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            ) : (
              <input
                key={f.placeholder}
                type={f.type ?? "text"}
                name={f.name === "email" || f.name === "misto" ? f.name : `comment_${f.placeholder}`}
                placeholder={f.placeholder}
                className="rounded-lg border border-navy-dim/30 px-4 py-3 outline-none focus:border-gold"
              />
            )
          )}
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
