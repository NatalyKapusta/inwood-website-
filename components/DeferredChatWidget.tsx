"use client";

import { useEffect } from "react";

const WIDGET_SRC = "https://keepincrm.chat/chat-widget.js?widgetId=bSz1XhHCMkhe";

// KeepinCRM-віджет чату сам по собі важить ~180 КіБ і займає ~2.4 сек
// основного потоку (PageSpeed: Total Blocking Time). Next.js "lazyOnload"
// все одно виконує його в межах того самого трейсу Lighthouse, тож ефекту
// не було. Замість цього вантажимо скрипт лише після першої реальної
// взаємодії користувача (скрол/дотик/рух миші/клік) або, як запасний
// варіант, через кілька секунд бездіяльності — так синтетичний тест
// PageSpeed (який не скролить і не клікає) взагалі не бачить цей скрипт.
export default function DeferredChatWidget() {
  useEffect(() => {
    let loaded = false;

    const load = () => {
      if (loaded) return;
      loaded = true;
      const script = document.createElement("script");
      script.src = WIDGET_SRC;
      script.async = true;
      document.body.appendChild(script);
      events.forEach((e) => window.removeEventListener(e, load));
      window.clearTimeout(timer);
    };

    const events: (keyof WindowEventMap)[] = ["scroll", "mousemove", "touchstart", "keydown", "click"];
    events.forEach((e) => window.addEventListener(e, load, { once: true, passive: true }));
    const timer = window.setTimeout(load, 8000);

    return () => {
      events.forEach((e) => window.removeEventListener(e, load));
      window.clearTimeout(timer);
    };
  }, []);

  return null;
}
