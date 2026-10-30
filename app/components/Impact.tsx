import { achievements } from "../data";
import Section from "./Section";

export default function Achievements() {
  return (
    <Section id="impact" label="Impact">
      <div className="lg:grid lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-3">
          <p className="text-sm leading-relaxed text-muted">
            Written the way it lands for the people using it, not as a resume
            line.
          </p>
        </div>

        <ul className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-3 lg:col-span-9">
          {achievements.map((a) => (
            <li key={a.title} className="bg-base p-6">
              <div
                className="mb-4 h-0.5 w-8 bg-amber"
                aria-hidden="true"
              />
              <h3 className="mb-2 font-display text-base font-semibold text-text">
                {a.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted">{a.outcome}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
