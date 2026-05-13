"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Splash() {
  const [show, setShow] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const seen = sessionStorage.getItem("vf-splash-seen");
    if (seen) {
      setShow(false);
      return;
    }
    const t = setTimeout(() => {
      setShow(false);
      sessionStorage.setItem("vf-splash-seen", "1");
    }, 2400);
    return () => clearTimeout(t);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.04, filter: "blur(8px)" }}
          transition={{ duration: 0.9, ease: [0.22, 0.61, 0.36, 1] }}
          className="fixed inset-0 z-[100] grid place-items-center overflow-hidden bg-char-950"
        >
          <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-mint-500/15 blur-[120px]" />

          <div className="relative flex flex-col items-center gap-7">
            <motion.div
              initial={{ scale: 0.6, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: [0.22, 0.61, 0.36, 1] }}
              className="relative grid h-20 w-20 place-items-center"
            >
              <span className="absolute inset-0 rounded-3xl bg-mint-gradient blur-xl opacity-70 animate-breathe" />
              <span className="relative grid h-20 w-20 place-items-center rounded-3xl bg-mint-gradient">
                <svg viewBox="0 0 24 24" className="h-9 w-9 text-char-950" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 0.61, 0.36, 1] }}
              className="relative"
            >
              <h1 className="font-display text-5xl tracking-[-0.03em] text-white md:text-7xl">
                vibeflix<span className="text-mint-400">.</span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="relative h-[2px] w-32 overflow-hidden rounded-full bg-white/[0.06]"
            >
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.6, delay: 0.4, ease: "easeInOut" }}
                className="absolute inset-y-0 w-full bg-mint-gradient"
              />
            </motion.div>
          </div>

          <Waves />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Waves() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] overflow-hidden">
      <svg className="absolute inset-x-0 bottom-0 w-[200%] animate-wave-slow" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path
          d="M0,224 C240,160 480,288 720,256 C960,224 1200,128 1440,192 L1440,320 L0,320 Z"
          fill="rgba(34,185,122,0.10)"
        />
      </svg>
      <svg className="absolute inset-x-0 bottom-0 w-[200%] animate-wave-mid" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path
          d="M0,256 C320,192 640,304 960,256 C1200,224 1320,176 1440,224 L1440,320 L0,320 Z"
          fill="rgba(63,203,137,0.12)"
        />
      </svg>
      <svg className="absolute inset-x-0 bottom-0 w-[200%] animate-wave-fast" viewBox="0 0 1440 320" preserveAspectRatio="none">
        <path
          d="M0,272 C360,224 720,320 1080,272 C1260,248 1380,224 1440,256 L1440,320 L0,320 Z"
          fill="rgba(111,220,166,0.18)"
        />
      </svg>
    </div>
  );
}
