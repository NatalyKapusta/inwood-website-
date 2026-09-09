const FACEBOOK_URL = "https://www.facebook.com/inwood.official";
const INSTAGRAM_URL = "https://www.instagram.com/in_wood_official";

export default function SocialLinks({
  className,
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  const iconClass =
    tone === "dark"
      ? "flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white/85 transition hover:border-gold hover:text-gold"
      : "flex h-9 w-9 items-center justify-center rounded-full border border-navy-dim/30 text-navy-dark transition hover:border-gold-dim hover:text-gold-dim";

  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`}>
      <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={iconClass}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
        </svg>
      </a>
      <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={iconClass}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
        </svg>
      </a>
    </div>
  );
}
