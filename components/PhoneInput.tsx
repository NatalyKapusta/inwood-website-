"use client";

import { useState } from "react";

// Український мобільний номер: +380 XX XXX XX XX
function formatUaPhone(raw: string) {
  const digits = raw.replace(/\D/g, "").replace(/^380/, "");
  const d = digits.slice(0, 9);
  let out = "+380";
  if (d.length > 0) out += " " + d.slice(0, 2);
  if (d.length > 2) out += " " + d.slice(2, 5);
  if (d.length > 5) out += " " + d.slice(5, 7);
  if (d.length > 7) out += " " + d.slice(7, 9);
  return out;
}

function isValidUaPhone(value: string) {
  const digits = value.replace(/\D/g, "").replace(/^380/, "");
  return digits.length === 9;
}

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
  const invalid = touched && current.length > 0 && !isValidUaPhone(current);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const formatted = formatUaPhone(e.target.value);
    if (onChange) onChange(formatted);
    else setInternalValue(formatted);
  }

  return (
    <div>
      <input
        type="tel"
        name={name}
        placeholder={placeholder ?? "+380 XX XXX XX XX"}
        required={required}
        value={current}
        onChange={handleChange}
        onFocus={() => {
          if (!current) {
            if (onChange) onChange("+380 ");
            else setInternalValue("+380 ");
          }
        }}
        onBlur={() => setTouched(true)}
        className={className}
        style={invalid ? { borderColor: "#dc2626" } : undefined}
      />
      {invalid && <p className="mt-1 text-xs text-red-600">Перевірте номер телефону — формат +380 XX XXX XX XX</p>}
    </div>
  );
}
