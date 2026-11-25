"use client";

import { useEffect, useRef, useState } from "react";
import { prefersLessMotion } from "../../../../lib/motion";
import styles from "./DemoVideo.module.scss";

/*
 * A demonstração de um ajuste em vídeo. Ela toca sozinha quando aparece na
 * tela. Quando o aparelho não deixa tocar sozinho (modo de economia de
 * bateria, "remover animações" ligado, menos movimento), o vídeo ficava
 * parado no primeiro quadro e parecia uma foto comum. Agora ele mostra um
 * botão ▶ e uma barrinha de progresso: dá para ver que é um vídeo e tocar.
 */
export default function DemoVideo({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    const bar = barRef.current;
    if (!video || !bar) return;

    let frame = 0;
    const paint = () => {
      if (video.duration) bar.style.transform = `scaleX(${video.currentTime / video.duration})`;
      frame = requestAnimationFrame(paint);
    };
    const onPlay = () => {
      setPlaying(true);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(paint);
    };
    const onPause = () => {
      setPlaying(false);
      cancelAnimationFrame(frame);
    };

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          video.pause();
          return;
        }
        // Com menos movimento, nada toca sozinho: a pessoa aperta o ▶.
        if (prefersLessMotion()) return;
        video.play().catch(() => setPlaying(false));
      },
      { threshold: 0.25 },
    );

    observer.observe(video);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
    };
  }, []);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  return (
    <span className={styles.root}>
      <video
        ref={videoRef}
        className={styles.video}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      >
        <source src={`${src}.webm`} type="video/webm" />
        <source src={`${src}.mp4`} type="video/mp4" />
      </video>

      {/* Um <button> dentro do <label> da opção não marca a opção ao ser tocado. */}
      <button
        type="button"
        className={styles.toggle}
        data-playing={playing ? "" : undefined}
        onClick={toggle}
        aria-label={playing ? "Pausar a demonstração" : "Tocar a demonstração"}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          {playing ? (
            <path d="M8 6h3v12H8zM13 6h3v12h-3z" fill="currentColor" />
          ) : (
            <path d="M8 5.5v13l10.5-6.5z" fill="currentColor" />
          )}
        </svg>
      </button>

      <span className={styles.track} aria-hidden="true">
        <span ref={barRef} className={styles.bar} />
      </span>
    </span>
  );
}
