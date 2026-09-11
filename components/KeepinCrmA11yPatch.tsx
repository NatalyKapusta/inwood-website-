"use client";

import { useEffect } from "react";

// KeepinCRM-віджет (chat-widget.js) сам вставляє в DOM кнопку й iframe без
// aria-label/title — PageSpeed фіксує це як проблему доступності. Ми не
// керуємо їхнім кодом, тож просто спостерігаємо за DOM і одразу підписуємо
// ці елементи, щойно вони з'являться (віджет вантажиться асинхронно).
export default function KeepinCrmA11yPatch() {
  useEffect(() => {
    const patch = () => {
      const button = document.getElementById("keepincrmChatButton");
      if (button && !button.getAttribute("aria-label")) {
        button.setAttribute("aria-label", "Відкрити чат з менеджером");
      }
      const iframe = document.getElementById("keepincrmChatIframe");
      if (iframe && !iframe.getAttribute("title")) {
        iframe.setAttribute("title", "Чат з менеджером IN WOOD");
      }
    };

    patch();
    const observer = new MutationObserver(patch);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  return null;
}
