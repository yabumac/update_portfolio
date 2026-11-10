import { projects, type Project } from "../data";
import Section from "./Section";

const groupMeta: Record<
  Project["category"],
  { title: string; note: string; accent: "amber" | "violet" }
> = {
  edtech: {
    title: "AI / EdTech systems",
    note: "Systems that run at scale",
    accent: "violet",
  },
  product: {
    title: "Product & mobile builds",
    note: "Things people use daily",
    accent: "amber",
  },
  freelance: {
    title: "Freelance",
    note: "Client sites, on time",
    accent: "amber",
  },
};

const order: Project["category"][] = ["edtech", "product", "freelance"];
const dot = {
  amber: "bg-amber",
  violet: "bg-violet",
};
const dotHover = {
  amber: "group-hover:bg-amber",
  violet: "group-hover:bg-violet",
};
const textAccent = {
  amber: "text-amber",
  violet: "text-violet",
};

function Module({ project }: { project: Project }) {
  const meta = groupMeta[project.category];
  const href = project.url ?? "#";
  const Tag = project.url ? "a" : "div";

  return (
    <Tag
      {...(project.url
        ? { href, target: "_blank", rel: "noopener noreferrer" }
        : {})}
      className="group block border border-line bg-surface p-5 transition-colors hover:border-amber/50"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="font-display text-lg font-semibold text-text">
          {project.name}
        </h3>
        <span
          className={`h-2 w-2 shrink-0 rounded-full bg-line transition-colors ${dotHover[meta.accent]}`}
          aria-hidden="true"
        />
      </div>

      <p className="mb-5 text-sm leading-relaxed text-muted">{project.what}</p>

      <div className="flex items-center justify-between gap-3">
        {project.outcome ? (
          <span
            className={`font-mono text-xs ${textAccent[meta.accent]}`}
          >
            {project.outcome}
          </span>
        ) : (
          <span className="font-mono text-xs text-muted">in production</span>
        )}
        {project.url && (
          <span className="font-mono text-xs text-muted opacity-0 transition-opacity group-hover:opacity-100">
            open ↗
          </span>
        )}
      </div>

      <ul className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4">
        {project.stack.map((tech) => (
          <li
            key={tech}
            className="font-mono text-[10px] text-muted"
          >
            {tech}
          </li>
        ))}
      </ul>
    </Tag>
  );
}

export default function Systems() {
  return (
    <Section id="systems" label="Systems built">
      <div className="grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-3">
          <p className="text-sm leading-relaxed text-muted">
            Proof of work, not a hobby shelf. Systems people actually use, and
            the numbers that came out of them.
          </p>
          <p className="mt-4 font-mono text-xs text-muted">
            {projects.length} modules / grouped by signal path
          </p>
        </div>

        <div className="lg:col-span-9">
          {order.map((cat) => {
            const meta = groupMeta[cat];
            const list = projects.filter((p) => p.category === cat);
            return (
              <div key={cat} className="mb-12 last:mb-0">
                <div className="mb-4 flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${dot[meta.accent]}`}
                    aria-hidden="true"
                  />
                  <h4 className="font-medium text-text">{meta.title}</h4>
                  <span className="font-mono text-xs text-muted">
                    / {meta.note}
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {list.map((p) => (
                    <Module key={p.name} project={p} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
