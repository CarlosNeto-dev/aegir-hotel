"use client";

import { useEffect, useRef } from "react";
import styles from "./DemoVideo.module.scss";

function prefersLessMotion() {
  return (
    document.documentElement.hasAttribute("data-reduce-motion") ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export default function DemoVideo({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          video.pause();
          return;
        }
        video
          .play()
          .then(() => {
            if (prefersLessMotion()) video.pause();
          })
          .catch(() => {});
      },
      { threshold: 0.25 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.root}>
      <video
        ref={videoRef}
        className={styles.video}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
      >
        <source src={`${src}.webm`} type="video/webm" />
        <source src={`${src}.mp4`} type="video/mp4" />
      </video>
    </div>
  );
}
