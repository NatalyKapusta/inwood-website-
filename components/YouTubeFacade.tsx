"use client";

import { useState } from "react";

// YouTube iframe одразу тягне свій плеєр-JS і кукі, навіть коли відео ще
// не натиснули — на сторінці з 3 відео це мегабайти зайвого завантаження.
// Показуємо легку картинку-прев'ю, а сам iframe монтуємо лише по кліку.
export default function YouTubeFacade({
  videoId,
  title,
  playLabel,
}: {
  videoId: string;
  title: string;
  playLabel: string;
}) {
  const [playing, setPlaying] = useState(false);

  if (playing) {
    return (
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        title={title}
        className="absolute inset-0 h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={playLabel}
      className="group absolute inset-0 h-full w-full cursor-pointer"
      style={{
        backgroundImage: `url(https://img.youtube.com/vi/${videoId}/hqdefault.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <span className="absolute inset-0 bg-black/25 transition group-hover:bg-black/40" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg transition group-hover:scale-110">
          <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 fill-navy-dark">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>
    </button>
  );
}
