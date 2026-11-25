import type { CSSProperties, ElementType } from "react";
import styles from "./VanishText.module.scss";

export type TextPart = string | { accent: string };

type VanishTextProps = {
  as?: ElementType;
  parts: readonly TextPart[];
  className?: string;
  id?: string;
};

function partText(part: TextPart) {
  return typeof part === "string" ? part : part.accent;
}

function splitParts(parts: readonly TextPart[]) {
  let index = 0;

  return parts.map((part) => ({
    accent: typeof part !== "string",
    words: partText(part)
      .split(" ")
      .map((word) => Array.from(word).map((char) => ({ char, index: index++ }))),
  }));
}

export default function VanishText({
  as: Tag = "p",
  parts,
  className = "",
  id,
}: VanishTextProps) {
  const label = parts.map(partText).join("");
  const groups = splitParts(parts);
  const total = groups.flatMap((group) => group.words.flat()).length;

  return (
    <Tag
      id={id}
      className={`${styles.root} ${className}`}
      aria-label={label}
      data-vanish=""
      style={{ "--n": total } as CSSProperties}
    >
      {groups.map((group, groupIndex) => {
        const Wrapper = group.accent ? "em" : "span";

        return (
          <Wrapper key={groupIndex} aria-hidden="true">
            {group.words.map((word, wordIndex) => (
              <span key={wordIndex}>
                <span className={styles.word}>
                  {word.map(({ char, index }) => (
                    <span
                      key={index}
                      className={styles.char}
                      style={{ "--i": index } as CSSProperties}
                    >
                      {char}
                    </span>
                  ))}
                </span>
                {wordIndex < group.words.length - 1 ? " " : ""}
              </span>
            ))}
          </Wrapper>
        );
      })}
    </Tag>
  );
}
