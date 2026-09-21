"use client";

import { lazy, Suspense } from "react";
import type { PhoneInputProps } from "./PhoneInputImpl";

// react-phone-number-input тягне за собою прапорці ~200 країн (~50 КБ JS +
// власний CSS) — важко для першого завантаження сторінки, хоча спочатку
// видно лише один прапорець. Лінива підвантажка виносить це в окремий
// чанк, що вантажиться вже після гідратації, а не в спільному бандлі
// кожної сторінки із формою заявки.
const PhoneInputImpl = lazy(() => import("./PhoneInputImpl"));

export default function PhoneInput(props: PhoneInputProps) {
  return (
    <Suspense
      fallback={
        <input
          type="tel"
          placeholder={props.placeholder}
          required={props.required}
          className={props.className}
          disabled
        />
      }
    >
      <PhoneInputImpl {...props} />
    </Suspense>
  );
}
