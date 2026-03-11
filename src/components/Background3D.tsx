import { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function Particles({ count = 150 }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const light = useRef<THREE.PointLight>(null);

  // Generate random positions for the particles once on mount
  const [particles] = useState(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        time: Math.random() * 100,
        factor: 20 + Math.random() * 100,
        speed: 0.01 + Math.random() / 200,
        x: Math.random() * 10 - 5,
        y: Math.random() * 10 - 5,
        z: Math.random() * 10 - 5,
      });
    }
    return temp;
  });

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    particles.forEach((particle, i) => {
      const { factor, speed, x, y, z } = particle;
      
      // Update time
      const time = particle.time += speed / 2;
      
      // Calculate oscillation based on time
      const s = Math.cos(time);
      dummy.position.set(
        x + Math.cos(time / 10) * (factor / 20),
        y + Math.sin(time / 10) * (factor / 20),
        z + s * (factor / 20)
      );

      // Add a slow rotation to each particle
      dummy.rotation.set(s * 5, s * 5, s * 5);
      
      dummy.updateMatrix();
      
      if (mesh.current) {
        mesh.current.setMatrixAt(i, dummy.matrix);
      }
    });

    if (mesh.current) {
      mesh.current.instanceMatrix.needsUpdate = true;
    }

    // Make the light softly follow the cursor
    if (light.current) {
      light.current.position.x = THREE.MathUtils.lerp(
        light.current.position.x,
        (state.pointer.x * state.viewport.width) / 2,
        0.05
      );
      light.current.position.y = THREE.MathUtils.lerp(
        light.current.position.y,
        (state.pointer.y * state.viewport.height) / 2,
        0.05
      );
    }
  });

  return (
    <>
      <pointLight ref={light} distance={40} intensity={8} color="#00d4ff" />
      <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
        <dodecahedronGeometry args={[0.02, 0]} />
        <meshStandardMaterial color="#00d4ff" roughness={0.1} />
      </instancedMesh>
    </>
  );
}

export function Background3D() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none opacity-60">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ alpha: true, antialias: false }}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={["#030305"]} />
        <ambientLight intensity={0.2} />
        <Particles count={300} />
      </Canvas>
    </div>
  );
}
