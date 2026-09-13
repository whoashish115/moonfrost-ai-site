import Image from "next/image";

import { LINKS } from "@/lib/content";
import { GitHubIcon, HuggingFaceIcon, WandbIcon } from "./Icons";
import AboutDialog from "./AboutDialog";
import ThemeToggle from "./ThemeToggle";

const SECTIONS = [
  { href: "#architecture", label: "Architecture" },
  { href: "#training", label: "Training" },
  { href: "#results", label: "Results" },
  { href: "#spec", label: "Spec" },
];

const EXTERNAL = [
  { href: LINKS.github, label: "GitHub", Icon: GitHubIcon },
  { href: LINKS.collection, label: "Hugging Face", Icon: HuggingFaceIcon },
  { href: LINKS.wandb, label: "Weights & Biases", Icon: WandbIcon },
];

export default function Nav() {
  return (
    <header className="nav">
      <div className="wrap nav-inner">
        <a className="brand" href="#top">
          <Image src="/logo.png" alt="" width={64} height={52} priority className="brand-mark" />
          <span className="brand-name">Moonfrost AI</span>
        </a>

        <nav className="nav-links" aria-label="Sections">
          {SECTIONS.map((item) => (
            <a key={item.href} className="nav-link" href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>

        {/* An icon is not a name, so each carries a title and an aria-label. */}
        <nav className="nav-icons" aria-label="Project links">
          {EXTERNAL.map(({ href, label, Icon }) => (
            <a key={href} className="icon-link" href={href} title={label}
               aria-label={label} target="_blank" rel="noopener">
              <Icon />
            </a>
          ))}
          <AboutDialog />
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}
