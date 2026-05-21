"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function SceneContent() {
  const meshRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);

  // Generate particle positions statically inside useMemo
  const positions = useMemo(() => {
    const count = 700;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.0 + Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame((state) => {
    const scrollY = typeof window !== "undefined" ? window.scrollY : 0;
    const maxScroll = typeof document !== "undefined" ? (document.documentElement.scrollHeight - window.innerHeight) || 1 : 1;
    const progress = Math.max(0, Math.min(1, scrollY / maxScroll));

    const t = state.clock.getElapsedTime();

    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.12 + progress * Math.PI * 2.5;
      meshRef.current.rotation.x = t * 0.08 + progress * Math.PI * 1.5;
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.2 - progress * Math.PI * 2.0;
      ring1Ref.current.rotation.y = t * 0.1;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -t * 0.15 + progress * Math.PI * 3.0;
      ring2Ref.current.rotation.z = t * 0.12;
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y = t * 0.03 + progress * Math.PI * 0.8;
      particlesRef.current.rotation.x = t * 0.01;
    }

    // Scroll triggering camera interpolation paths
    if (groupRef.current) {
      let targetZ = 0;
      let targetX = 0;
      let targetY = 0;
      let targetRotationY = 0;

      if (progress < 0.15) {
        // Hero: Centered and moving forward
        const localProg = progress / 0.15;
        targetZ = localProg * 4.5; // Zoom into the knot
        targetX = 0;
        targetY = 0;
      } else if (progress < 0.32) {
        // About/Studio: Deep zoom-through shift left
        const localProg = (progress - 0.15) / 0.17;
        targetZ = 4.5 + localProg * 2.5;
        targetX = -1.8 * localProg;
        targetY = 0.3 * localProg;
      } else if (progress < 0.55) {
        // Services: Shift to the right background, scale down slightly
        const localProg = (progress - 0.32) / 0.23;
        targetZ = 7.0 - localProg * 6.0; // zoom back out
        targetX = -1.8 + localProg * 3.8; // slide to the right
        targetY = 0.3 - localProg * 0.8;
      } else if (progress < 0.72) {
        // Works: Pull deep into center background
        const localProg = (progress - 0.55) / 0.17;
        targetZ = 1.0 - localProg * 4.5;
        targetX = 2.0 - localProg * 2.0;
        targetY = -0.5 + localProg * 0.5;
      } else if (progress < 0.85) {
        // Process & Stack: Lock in top right
        const localProg = (progress - 0.72) / 0.13;
        targetZ = -3.5 + localProg * 4.0;
        targetX = localProg * -1.6;
        targetY = localProg * 0.6;
      } else {
        // Final CTA: Expand, spin, and zoom centered
        const localProg = (progress - 0.85) / 0.15;
        targetZ = 0.5 + localProg * 4.0;
        targetX = -1.6 * (1 - localProg);
        targetY = 0.6 * (1 - localProg);
        targetRotationY = localProg * Math.PI * 1.5;
      }

      // Lerp properties for butter smooth transitions
      groupRef.current.position.z = THREE.MathUtils.lerp(groupRef.current.position.z, targetZ, 0.04);
      groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, targetX, 0.04);
      groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.04);

      // Mouse reactive movement
      const mouseX = state.pointer.x;
      const mouseY = state.pointer.y;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY + mouseX * 0.35, 0.06);
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, mouseY * 0.35, 0.06);
    }
  });

  return (
    <group ref={groupRef}>
      {/* Background soft ambient lights */}
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#c5a880" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#ffffff" />
      <directionalLight position={[0, 5, 0]} intensity={1.0} color="#c5a880" />

      {/* Main Visionatrix branding element */}
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[0.75, 0.22, 160, 16, 2, 5]} />
        <meshStandardMaterial
          color="#c5a880"
          wireframe
          transparent
          opacity={0.3}
          roughness={0.12}
          metalness={0.95}
        />
      </mesh>

      {/* Dynamic orbital track 1 */}
      <mesh ref={ring1Ref}>
        <torusGeometry args={[1.5, 0.015, 8, 120]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.1} wireframe />
      </mesh>

      {/* Dynamic orbital track 2 */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.9, 0.012, 8, 120]} />
        <meshBasicMaterial color="#c5a880" transparent opacity={0.15} wireframe />
      </mesh>

      {/* Swirling particle universe */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#c5a880"
          size={0.018}
          sizeAttenuation={true}
          transparent={true}
          opacity={0.55}
        />
      </points>

      {/* Subtle core core glow */}
      <mesh>
        <sphereGeometry args={[0.24, 32, 32]} />
        <meshBasicMaterial color="#c5a880" transparent opacity={0.05} />
      </mesh>
    </group>
  );
}

export default function Scene3D() {
  return (
    <div className="fixed inset-0 w-screen h-screen -z-10 pointer-events-none bg-[#0b0b0f]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
}
