import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { SCENE_LAYERS } from '../motion/sceneManifest';

function useAssetReady(src) {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let alive = true;
    fetch(src, { method: 'HEAD' })
      .then((res) => { if (alive) setReady(res.ok); })
      .catch(() => { if (alive) setReady(false); });
    return () => { alive = false; };
  }, [src]);
  return ready;
}

function LoopAnimation(spec, reduced) {
  if (reduced || spec.anim === 'none') return {};
  switch (spec.anim) {
    case 'drift':
      return {
        animate: { x: [spec.reverse ? 40 : -40, spec.reverse ? -40 : 40, spec.reverse ? 40 : -40] },
        transition: { duration: spec.duration, repeat: Infinity, ease: 'easeInOut' },
      };
    case 'sway':
      return {
        animate: { rotate: [-1.4, 1.4, -1.4] },
        transition: { duration: spec.duration, repeat: Infinity, ease: 'easeInOut' },
      };
    case 'wave':
      return {
        animate: { rotate: [-2.5, 2.5, -2.5] },
        transition: { duration: spec.duration, repeat: Infinity, ease: 'easeInOut' },
      };
    case 'pulse':
      return {
        animate: { scale: [1, 1.07, 1] },
        transition: { duration: spec.duration, repeat: Infinity, ease: 'easeInOut' },
      };
    case 'twinkle':
      return {
        animate: { opacity: [0.55, 1, 0.55] },
        transition: { duration: spec.duration, repeat: Infinity, ease: 'easeInOut' },
      };
    default:
      return null;
  }
}

function SceneLayer({ spec, index }) {
  const ready = useAssetReady(spec.src);
  const [broken, setBroken] = useState(false);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -spec.parallax * 240]);
  const loop = LoopAnimation(spec, reduced);
  if (!ready || broken) return null;

  return (
    <motion.img
      src={spec.src}
      alt=""
      aria-hidden
      draggable={false}
      onError={() => setBroken(true)}
      style={{
        position: 'absolute',
        left: spec.left,
        bottom: spec.bottom,
        width: `${spec.size}%`,
        maxWidth: 'none',
        y,
        transformOrigin: '50% 100%',
        pointerEvents: 'none',
        userSelect: 'none',
      }}
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1, ...(loop ? loop.animate : {}) }}
      transition={{
        opacity: { duration: 0.6, delay: 0.2 + index * 0.05 },
        scale: { duration: 0.6, delay: 0.2 + index * 0.05 },
        ...(loop ? loop.transition : {}),
      }}
    />
  );
}

export default function AndeanScene() {
  return (
    <div
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none', overflow: 'hidden' }}
    >
      {SCENE_LAYERS.map((spec, i) => (
        <SceneLayer key={spec.id} spec={spec} index={i} />
      ))}
    </div>
  );
}