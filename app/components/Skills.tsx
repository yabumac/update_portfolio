import { skillCategories } from "../data";
import Section from "./Section";

const fill = {
  amber: "bg-amber",
  violet: "bg-violet",
};
const dot = {
  amber: "bg-amber",
  violet: "bg-violet",
};

export default function Skills() {
  return (
    <Section id="skills" label="Skills & tools">
      <div className="lg:grid lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-3">
          <p className="text-sm leading-relaxed text-muted">
            Levels, not buzzwords. Two signal lamps — violet for build, amber
            for the craft side.
          </p>
        </div>

        <div className="grid gap-10 sm:grid-cols-3 lg:col-span-9">
          {skillCategories.map((cat) => (
            <div key={cat.name}>
              <div className="mb-5 flex items-center gap-2">
                <span
                  className={`h-2 w-2 rounded-full ${dot[cat.accent]}`}
                  aria-hidden="true"
                />
                <h3 className="font-display text-lg font-semibold text-text">
                  {cat.name}
                </h3>
              </div>

              <ul className="space-y-5">
                {cat.skills.map((skill) => (
                  <li key={skill.label}>
                    <div className="mb-1.5 flex items-baseline justify-between">
                      <span className="text-sm font-medium text-text">
                        {skill.label}
                      </span>
                      <span className="font-mono text-xs text-muted">
                        {skill.level}%
                      </span>
                    </div>
                    <div
                      className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2"
                      role="meter"
                      aria-valuenow={skill.level}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${skill.label} level`}
                    >
                      <div
                        className={`h-full rounded-full ${fill[cat.accent]}`}
                        style={{ width: `${skill.level}%` }}
                      />
                    </div>
                    {skill.note && (
                      <p className="mt-1 font-mono text-[10px] text-muted">
                        {skill.note}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}
