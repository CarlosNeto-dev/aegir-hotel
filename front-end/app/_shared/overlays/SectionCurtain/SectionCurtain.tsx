"use client";

import { useEffect, useRef } from "react";
import { gsap } from "../../lib/gsap";
import { setCurtain } from "../../lib/section-nav";
import styles from "./SectionCurtain.module.scss";

export default function SectionCurtain() {
  const rootRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);

  useEffect(
    () =>
      setCurtain((label, jump, done) => {
        const root = rootRef.current;
        const text = labelRef.current;
        if (!root || !text) {
          jump();
          done();
          return;
        }

        text.textContent = label;
        const parts = root.children;

        gsap
          .timeline({
            onComplete: () => {
              gsap.set(root, { clearProps: "clipPath,visibility" });
              done();
            },
          })
          .set(root, { visibility: "visible" })
          .fromTo(
            root,
            { clipPath: "inset(100% 0% 0% 0%)" },
            { clipPath: "inset(0% 0% 0% 0%)", duration: 0.55, ease: "power3.inOut" },
          )
          .fromTo(
            parts,
            { y: 18, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: 0.4, stagger: 0.06, ease: "power2.out" },
            0.25,
          )
          .add(jump, 0.62)
          .to(
            parts,
            { y: -14, autoAlpha: 0, duration: 0.3, stagger: 0.04, ease: "power2.in" },
            1.05,
          )
          .to(
            root,
            { clipPath: "inset(0% 0% 100% 0%)", duration: 0.6, ease: "power3.inOut" },
            1.2,
          );
      }),
    [],
  );

  return (
    <div ref={rootRef} className={styles.root} aria-hidden="true">
      <span className={styles.kicker}>Indo para</span>
      <p ref={labelRef} className={styles.label} />
    </div>
  );
}
