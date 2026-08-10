import React, { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { Float, ContactShadows } from '@react-three/drei';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as THREE from 'three';

const NAVY = 0x1b2a3a;

/* Model 3D hanya di-load kalau file benar-benar ada (anti-tipuan SPA-fallback) */
function useMascotReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let alive = true;
    fetch('/models/alpaca.glb', { method: 'HEAD' })
      .then((res) => {
        if (!alive) return;
        const ct = res.headers.get('content-type') || '';
        setReady(res.ok && !ct.includes('text/html'));
      })
      .catch(() => { if (alive) setReady(false); });
    return () => { alive = false; };
  }, []);
  return ready;
}

/* ── Rig: parallax halus mengikuti kursor ── */
function Rig({ children }) {
  const ref = useRef();
  useFrame((state, delta) => {
    const t = ref.current;
    t.rotation.y = THREE.MathUtils.damp(t.rotation.y, state.pointer.x * 0.22, 2.2, delta);
    t.rotation.x = THREE.MathUtils.damp(t.rotation.x, -state.pointer.y * 0.14, 2.2, delta);
  });
  return <group ref={ref}>{children}</group>;
}

/* ── Maskot 3D: alpaca.glb melayang lembut + bayangan sentuh ── */
function AlpacaModel() {
  const gltf = useLoader(GLTFLoader, '/models/alpaca.glb');
  return (
    <Float speed={2.2} rotationIntensity={0.25} floatIntensity={1.1}>
      <primitive object={gltf.scene} scale={1.15} position={[0, -0.55, 0]} />
      <ContactShadows position={[0, -1.95, 0]} opacity={0.42} scale={4.5} blur={2.6} far={3} color={NAVY} />
    </Float>
  );
}

function Scene({ modelReady }) {
  return modelReady ? (
    <Suspense fallback={null}>
      <AlpacaModel />
    </Suspense>
  ) : null;
}

export default function Hero3D() {
  const modelReady = useMascotReady();
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 9], fov: 42 }}
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.1} color="#f5f0e6" />
        <directionalLight position={[4, 6, 5]} intensity={1.6} color="#f5f0e6" />
        <pointLight position={[-4, -2, 3]} intensity={1.1} color="#e9b824" />
        <Rig>
          <Scene modelReady={modelReady} />
        </Rig>
      </Canvas>
    </div>
  );
}