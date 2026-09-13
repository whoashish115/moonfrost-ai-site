"use client";

import { useEffect, useRef, useState } from "react";

import { AUTHOR } from "@/lib/content";
import { GitHubIcon, GlobeIcon, HuggingFaceIcon, WandbIcon, XIcon } from "./Icons";

/** Each brand in its own colours; GitHub and X inherit, having none. */
const ICONS = {
  github: GitHubIcon,
  huggingface: HuggingFaceIcon,
  x: XIcon,
  globe: GlobeIcon,
  wandb: WandbIcon,
} as const;

/**
 * The info button and the panel behind it.
 *
 * A native <dialog> gets the focus trap, the backdrop and Escape for free, which is most of
 * what a modal has to get right. The avatar is fetched from GitHub rather than committed,
 * so it stays current without the repository carrying a copy of it.
 */
export default function AboutDialog() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const node = dialog.current;
    if (!node) return;
    if (open && !node.open) node.showModal();
    if (!open && node.open) node.close();
  }, [open]);

  return (
    <>
      <button className="icon-link" type="button" onClick={() => setOpen(true)}
              title="About this project" aria-label="About this project">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
             strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="9.2" />
          <path d="M12 16.6v-5.2M12 7.9h.01" />
        </svg>
      </button>

      <dialog ref={dialog} className="about" onClose={() => setOpen(false)}
              onClick={(event) => {
                // a click on the backdrop lands on the dialog itself, not on its contents
                if (event.target === dialog.current) setOpen(false);
              }}>
        <div className="about-inner">
          <img className="about-avatar" src={AUTHOR.avatar} alt="" width={104} height={104} />
          <h2>{AUTHOR.name}</h2>
          <a className="about-handle" href={AUTHOR.profile} target="_blank" rel="noopener">
            {AUTHOR.handle}
          </a>
          <p className="about-role">{AUTHOR.role}</p>

          <div className="about-links">
            {AUTHOR.links.map((link) => {
              const Icon = ICONS[link.icon];
              return (
                <a key={link.href} href={link.href} target="_blank" rel="noopener">
                  <Icon />
                  {link.label}
                </a>
              );
            })}
          </div>

          <button className="about-close" type="button" onClick={() => setOpen(false)}>
            Close
          </button>
        </div>
      </dialog>
    </>
  );
}
