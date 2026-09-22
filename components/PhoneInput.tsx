"use client";

import { lazy, Suspense, useEffect, useRef, useState } from "react";
import type { PhoneInputProps } from "./PhoneInputImpl";

// react-phone-number-input тягне за собою прапорці ~200 країн (~50 КБ JS +
// власний CSS) — важко для першого завантаження сторінки, хоча спочатку
// видно лише один прапорець. React.lazy() сам по собі виносить це в окремий
// чанк, але fetch() цього чанку React запускає одразу, щойно компонент
// намагається відрендеритись — тобто майже одразу після гідратації, навіть
// якщо форма внизу сторінки й відвідувач до неї не долистав. Тому монтуємо
// PhoneInputImpl лише коли обгортка наближається до viewport
// (IntersectionObserver, rootMargin із запасом) — на сторінках, де форму
// так і не побачили, ці ~50 КБ взагалі не завантажуються.
const PhoneInputImpl = lazy(() => import("./PhoneInputImpl"));

export default function PhoneInput(props: PhoneInputProps) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldLoad) return;
    const node = wrapperRef.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setShouldLoad(true);
      },
      { rootMargin: "300px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [shouldLoad]);

  const fallback = (
    <input
      type="tel"
      placeholder={props.placeholder}
      required={props.required}
      className={props.className}
      disabled
    />
  );

  return (
    <div ref={wrapperRef}>
      {shouldLoad ? (
        <Suspense fallback={fallback}>
          <PhoneInputImpl {...props} />
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  );
}
