const FACEBOOK_URL = "https://www.facebook.com/inwood.official";
const INSTAGRAM_URL = "https://www.instagram.com/in_wood_official";
const TELEGRAM_URL = "https://t.me/in_wood_bot";

export default function SocialLinks({
  className,
  tone = "dark",
  size = "default",
}: {
  className?: string;
  tone?: "dark" | "light";
  size?: "default" | "compact";
}) {
  const sizeClass = size === "compact" ? "h-6 w-6" : "h-9 w-9";
  const iconClass =
    tone === "dark"
      ? `flex ${sizeClass} items-center justify-center rounded-full border border-white/20 text-white/85 transition hover:border-gold hover:text-gold`
      : `flex ${sizeClass} items-center justify-center rounded-full border border-navy-dim/30 text-navy-dark transition hover:border-gold-dim hover:text-gold-dim`;
  const iconSize = size === "compact" ? "12" : "16";

  return (
    <div className={`flex items-center gap-3 ${className ?? ""}`}>
      <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={iconClass}>
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="currentColor">
          <path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.91h-2.33V22c4.78-.76 8.44-4.92 8.44-9.94Z" />
        </svg>
      </a>
      <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={iconClass}>
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
        </svg>
      </a>
      <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Telegram" className={iconClass}>
        <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      </a>
    </div>
  );
}
