import { languages } from "../data";
import Section from "./Section";

export default function Languages() {
  return (
    <Section id="languages" label="Languages">
      <div className="lg:grid lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-3">
          <p className="text-sm leading-relaxed text-muted">
            Quiet detail. I build and work across these.
          </p>
        </div>
        <ul className="grid gap-4 sm:grid-cols-4 lg:col-span-9">
          {languages.map((lang) => (
            <li
              key={lang.name}
              className="flex items-center justify-between border border-line bg-surface px-4 py-3"
            >
              <span className="text-sm font-medium text-text">{lang.name}</span>
              <span className="h-2 w-2 rounded-full bg-amber" aria-hidden="true" />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
