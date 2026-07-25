import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PresentationControls, Environment } from '@react-three/drei';
import * as THREE from 'three';

function WalletModel() {
  const meshRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group ref={meshRef}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        {/* Simple stylized wallet shape using primitives */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[3, 2, 0.5]} />
          <meshPhysicalMaterial 
            color="#0ea5e9" 
            metalness={0.6}
            roughness={0.2}
            clearcoat={1}
            clearcoatRoughness={0.1}
          />
        </mesh>
        
        {/* Wallet Flap */}
        <mesh position={[0, 0.5, 0.26]} castShadow>
          <boxGeometry args={[3, 1, 0.1]} />
          <meshPhysicalMaterial 
            color="#0284c7" 
            metalness={0.5}
            roughness={0.3}
          />
        </mesh>

        {/* Floating Coin */}
        <mesh position={[1, 1.2, 0.5]} rotation={[Math.PI / 4, 0, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 0.05, 32]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
        </mesh>
        
        {/* Second Floating Coin */}
        <mesh position={[-1, 0.8, 0.8]} rotation={[-Math.PI / 4, Math.PI / 4, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.05, 32]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
        </mesh>
      </Float>
    </group>
  );
}

export default function ThreeDWallet() {
  return (
    <div className="w-full h-full min-h-[200px]">
      <Canvas shadows camera={{ position: [0, 0, 6], fov: 45 }}>
        <color attach="background" args={['transparent']} />
        <ambientLight intensity={0.7} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        <PresentationControls 
          global 
          rotation={[0.13, 0.1, 0]} 
          polar={[-0.4, 0.2]} 
          azimuth={[-1, 0.75]} 
          config={{ mass: 2, tension: 400 }} 
          snap={{ mass: 4, tension: 400 }}
        >
          <WalletModel />
        </PresentationControls>
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
