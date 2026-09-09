"use client";

import { useState } from "react";
import PhoneInputWithCountrySelect, {
  formatPhoneNumberIntl,
  isValidPhoneNumber,
  type Country,
} from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import countryLabels from "react-phone-number-input/locale/en.json";
import "react-phone-number-input/style.css";

// Ключові країни для селектора: Україна (за замовчуванням) + реальні країни
// експорту IN WOOD (Англія, Франція, Швейцарія, Литва, Латвія) + решта
// Європи й найпоширеніші напрямки звернень. Для будь-якої іншої країни є
// перемикач "Ввести номер вручну" — простий текстовий ввід без маски.
const COUNTRIES: Country[] = [
  "UA",
  "GB",
  "FR",
  "CH",
  "LT",
  "LV",
  "PL",
  "DE",
  "CZ",
  "SK",
  "RO",
  "MD",
  "HU",
  "IT",
  "ES",
  "PT",
  "NL",
  "BE",
  "AT",
  "IE",
  "SE",
  "NO",
  "DK",
  "FI",
  "EE",
  "BG",
  "HR",
  "GR",
  "US",
  "CA",
  "IL",
  "AE",
  "TR",
  "GE",
  "AZ",
  "KZ",
];

export default function PhoneInput({
  name = "phone",
  placeholder,
  required,
  className,
  value,
  onChange,
}: {
  name?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}) {
  const [internalValue, setInternalValue] = useState("");
  const [touched, setTouched] = useState(false);
  const [manual, setManual] = useState(false);
  const current = value ?? internalValue;
  const invalid = touched && current.length > 0 && !manual && !isValidPhoneNumber(current);

  function handleChange(next?: string) {
    if (onChange) onChange(next ?? "");
    else setInternalValue(next ?? "");
  }

  function handleManualChange(e: React.ChangeEvent<HTMLInputElement>) {
    handleChange(e.target.value);
  }

  return (
    <div>
      {manual ? (
        <input
          type="tel"
          name={name}
          placeholder={placeholder ?? "+"}
          required={required}
          value={current}
          onChange={handleManualChange}
          onBlur={() => setTouched(true)}
          className={className}
        />
      ) : (
        <>
          <PhoneInputWithCountrySelect
            international
            defaultCountry="UA"
            countries={COUNTRIES}
            labels={countryLabels}
            flags={flags}
            addInternationalOption={false}
            required={required}
            value={current}
            onChange={handleChange}
            onBlur={() => setTouched(true)}
            placeholder={placeholder ?? "+380 XX XXX XX XX"}
            className={className ? `iw-phone ${className}` : "iw-phone"}
            style={invalid ? { borderColor: "#dc2626" } : undefined}
          />
          <input type="hidden" name={name} value={current ? formatPhoneNumberIntl(current) : ""} />
        </>
      )}
      <button
        type="button"
        onClick={() => {
          setManual((m) => !m);
          handleChange("");
          setTouched(false);
        }}
        className="mt-1 text-xs text-navy-dim underline decoration-dotted hover:text-gold-dim"
      >
        {manual ? "Обрати країну зі списку" : "Немає моєї країни в списку — ввести номер вручну"}
      </button>
      {invalid && (
        <p className="mt-1 text-xs text-red-600">Перевірте номер телефону — введіть коректний номер</p>
      )}
    </div>
  );
}
