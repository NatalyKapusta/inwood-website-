/** Звичайне завантаження файлу браузером. */
export function saveBlob(blob: Blob, filename: string) {
  const u = URL.createObjectURL(blob), a = document.createElement('a');
  a.href = u;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(u), 4000);
}

export function copyText(t: string): Promise<boolean> {
  const fallback = () => {
    const ta = document.createElement('textarea');
    ta.value = t;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      /* немає доступу до буфера */
    }
    document.body.removeChild(ta);
    return ok;
  };
  return new Promise((res) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(t).then(() => res(true), () => res(fallback()));
        return;
      }
    } catch {
      /* перехід на запасний спосіб */
    }
    res(fallback());
  });
}
