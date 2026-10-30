import { contact } from "../data";

export default function Contact() {
  return (
    <section id="contact" className="relative border-b border-line">
      <div
        className="absolute top-0 left-6 hidden h-1.5 w-1.5 rounded-full bg-amber sm:block"
        aria-hidden="true"
      />
      <div className="mx-auto max-w-6xl px-6 py-24 sm:px-10 sm:py-32">
        <p className="mb-6 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted">
          <span className="inline-block h-2 w-2 rounded-full bg-amber" />
          open channel
        </p>
        <h2 className="font-display max-w-3xl text-4xl font-bold leading-tight tracking-tight text-text sm:text-5xl">
          If it needs building, I&apos;ll build it — end to end.
        </h2>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-muted">
          Prefer a short message and a clear brief. I&apos;ll tell you what I
          can ship and when, and I don&apos;t disappear mid-build.
        </p>

        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-sm">
          <span className="text-muted">{contact.location}</span>
          <a
            href={`mailto:${contact.email}`}
            className="text-amber hover:underline"
          >
            {contact.email}
          </a>
          <a href={`tel:${contact.phone}`} className="text-muted hover:text-text">
            {contact.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
