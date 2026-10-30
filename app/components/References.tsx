import Section from "./Section";

export default function References() {
  return (
    <Section id="references" label="References">
      <div className="lg:grid lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-3">
          <p className="text-sm leading-relaxed text-muted">Credentials.</p>
        </div>
        <div className="lg:col-span-9">
          <p className="max-w-xl text-base leading-relaxed text-muted">
            Available on request — from the leads, program partners, and
            clients I&apos;ve shipped with. Ask and I&apos;ll connect you
            directly.
          </p>
        </div>
      </div>
    </Section>
  );
}
