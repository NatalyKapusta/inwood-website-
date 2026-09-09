"use client";

import { useState } from "react";
import PhoneInputWithCountrySelect, {
  formatPhoneNumberIntl,
  getCountries,
  isValidPhoneNumber,
} from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import countryLabels from "react-phone-number-input/locale/en.json";
import "react-phone-number-input/style.css";

// Усі країни, підтримувані бібліотекою, окрім росії.
const COUNTRIES = getCountries().filter((code) => code !== "RU");

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
  const current = value ?? internalValue;
  const invalid = touched && current.length > 0 && !isValidPhoneNumber(current);

  function handleChange(next?: string) {
    if (onChange) onChange(next ?? "");
    else setInternalValue(next ?? "");
  }

  return (
    <div>
      <PhoneInputWithCountrySelect
        international
        defaultCountry="UA"
        countries={COUNTRIES}
        labels={countryLabels}
        flags={flags}
        countryCallingCodeEditable={false}
        required={required}
        value={current}
        onChange={handleChange}
        onBlur={() => setTouched(true)}
        placeholder={placeholder ?? "+380 XX XXX XX XX"}
        className={className ? `iw-phone ${className}` : "iw-phone"}
        style={invalid ? { borderColor: "#dc2626" } : undefined}
      />
      <input type="hidden" name={name} value={current ? formatPhoneNumberIntl(current) : ""} />
      {invalid && (
        <p className="mt-1 text-xs text-red-600">Перевірте номер телефону — введіть коректний номер</p>
      )}
    </div>
  );
}
