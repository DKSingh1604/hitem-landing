/* eslint-disable no-unused-vars */
import React, { useLayoutEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Environment, ScrollControls, useScroll, Scroll } from '@react-three/drei';
import gsap from 'gsap';

/* CONFIGURATION CONSTANTS 
   Adjust these if your model is too big/small or facing the wrong way 
*/
const MODEL_SCALE = 1.5;
const INITIAL_POSITION = [0, -1, 0]; // [x, y, z]

function Model() {
  const { scene } = useGLTF('/hitem3d.glb');
  const modelRef = useRef();
  const scroll = useScroll();
  const tl = useRef();

  useLayoutEffect(() => {
    // GSAP Timeline synced to the scroll progress
    tl.current = gsap.timeline({
      defaults: { duration: 1, ease: 'power1.inOut' },
    });

    // ANIMATION SEQUENCE
    // The timeline length (0 to 3) corresponds to scroll distance (0→1)

    // 0% → 33%: Rotate 90° and move left
    tl.current
      .to(modelRef.current.rotation, { y: -Math.PI / 2 }, 0)
      .to(modelRef.current.position, { x: -1.5 }, 0)

      // 33% → 66%: Rotate back, tilt up, move right
      .to(modelRef.current.rotation, { y: Math.PI / 4, x: 0.2 }, 1)
      .to(modelRef.current.position, { x: 1.5, z: 1 }, 1)

      // 66% → 100%: Spin fast to center and zoom in
      .to(modelRef.current.rotation, { y: Math.PI * 2, x: 0 }, 2)
      .to(modelRef.current.position, { x: 0, z: 2 }, 2);

    // Pause timeline so we drive it manually via scroll
    tl.current.pause();
  }, []);

  // Every frame: sync GSAP timeline progress with scroll offset
  useFrame(() => {
    if (tl.current) {
      tl.current.progress(scroll.offset);
    }
  });

  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={MODEL_SCALE}
      position={INITIAL_POSITION}
    />
  );
}

export default function LandingPage() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0a0a0a', color: 'white' }}>
      {/* 3D SCENE CONTAINER */}
      <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }}>
        {/* Cinematic Lighting */}
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={100} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={50} color="#ff0000" />

        {/* Environment adds realistic metal reflections */}
        <Environment preset="city" />

        {/* ScrollControls handles the "virtual" scroll height */}
        <ScrollControls pages={4} damping={0.2}>
          {/* Model placed outside <Scroll> so it stays fixed in the viewport */}
          <Model />

          {/* HTML layer — scrollable text overlays */}
          <Scroll html style={{ width: '100%' }}>
            <div style={{ position: 'absolute', top: '100vh', left: '10vw', width: '30vw' }}>
              <h1 style={{ fontSize: '4rem', fontWeight: 'bold', fontFamily: 'Impact, sans-serif' }}>
                LEAN INTO IT
              </h1>
              <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>
                Experience the next generation of motion.
                Aerodynamic design meets raw power.
              </p>
            </div>

            <div style={{ position: 'absolute', top: '200vh', right: '10vw', width: '30vw', textAlign: 'right' }}>
              <h2 style={{ fontSize: '3rem', fontWeight: 'bold' }}>
                PERFORMANCE
              </h2>
              <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>
                0-100 kph in 2.8 seconds.
                <br />
                Carbon fiber chassis.
              </p>
            </div>

            <div style={{ position: 'absolute', top: '300vh', width: '100%', textAlign: 'center' }}>
              <h2 style={{ fontSize: '5rem', color: '#ff0000', fontWeight: '900' }}>
                PRE-ORDER NOW
              </h2>
            </div>
          </Scroll>
        </ScrollControls>
      </Canvas>
    </div>
  );
}