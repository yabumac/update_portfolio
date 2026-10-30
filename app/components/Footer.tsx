export default function Footer() {
  return (
    <footer className="mx-auto max-w-6xl px-6 py-10 sm:px-10">
      <div className="flex flex-col items-start justify-between gap-3 font-mono text-xs text-muted sm:flex-row sm:items-center">
        <span>© {new Date().getFullYear()} Yabsera Teshome</span>
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-amber" aria-hidden="true" />
          signal clear
        </span>
      </div>
    </footer>
  );
}
