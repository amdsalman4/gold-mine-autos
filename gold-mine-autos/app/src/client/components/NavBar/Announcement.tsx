const ANNOUNCEMENT_URL = "https://github.com/wasp-lang/wasp";

export function Announcement() {
  return (
    <div className="from-accent to-secondary text-primary-foreground relative flex w-full items-center justify-center gap-3 bg-gradient-to-r p-3 text-center font-semibold">
      <a
        href={ANNOUNCEMENT_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="underline font-medium"
      >
        💎 Exclusive for Ontario Dealers - Start Your 30-Day Trial 💎
      </a>
    </div>
  );
}
