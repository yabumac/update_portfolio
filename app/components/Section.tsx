type SectionProps = {
  id: string;
  label: string;
  children: React.ReactNode;
};

export default function Section({ id, label, children }: SectionProps) {
  return (
    <section id={id} className="relative border-b border-line">
      {/* signal-line waypoint marker */}
      <div
        className="absolute top-0 left-6 hidden h-1.5 w-1.5 rounded-full bg-amber sm:block"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-6xl px-6 py-20 sm:px-10 sm:py-28">
        <div className="mb-12 flex items-baseline gap-3">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-text sm:text-3xl">
            {label}
          </h2>
        </div>
        {children}
      </div>
    </section>
  );
}
