"use client";

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, Cylinder } from '@react-three/drei';
import * as THREE from 'three';

// Represents a single base pair step in the DNA helix
const BasePair = ({ index, total }: { index: number; total: number }) => {
    const groupRef = useRef<THREE.Group>(null);
    const angle = (index / total) * Math.PI * 4; // 2 full turns
    const yOffset = (index - total / 2) * 0.4;
    const radius = 2;

    const x1 = Math.cos(angle) * radius;
    const z1 = Math.sin(angle) * radius;
    const x2 = Math.cos(angle + Math.PI) * radius;
    const z2 = Math.sin(angle + Math.PI) * radius;

    useFrame((state) => {
        if (groupRef.current) {
            // Add a subtle wave animation
            groupRef.current.position.y = yOffset + Math.sin(state.clock.elapsedTime * 2 + index * 0.5) * 0.1;
        }
    });

    return (
        <group ref={groupRef} position={[0, yOffset, 0]}>
            {/* Backbone Spheres */}
            <Sphere position={[x1, 0, z1]} args={[0.3, 16, 16]}>
                <meshStandardMaterial color="#4f46e5" roughness={0.2} metalness={0.8} />
            </Sphere>
            <Sphere position={[x2, 0, z2]} args={[0.3, 16, 16]}>
                <meshStandardMaterial color="#ec4899" roughness={0.2} metalness={0.8} />
            </Sphere>

            {/* Connecting rung */}
            <Cylinder
                position={[0, 0, 0]}
                args={[0.08, 0.08, radius * 2, 8]}
                rotation={[Math.PI / 2, 0, angle]}
            >
                <meshStandardMaterial color="#94a3b8" />
            </Cylinder>
        </group>
    );
};

const DnaHelix = () => {
    const basePairsCount = 30;
    const helixRef = useRef<THREE.Group>(null);

    useFrame(() => {
        if (helixRef.current) {
            // Constant rotation
            helixRef.current.rotation.y -= 0.01;
        }
    });

    return (
        <group ref={helixRef}>
            {Array.from({ length: basePairsCount }).map((_, i) => (
                <BasePair key={i} index={i} total={basePairsCount} />
            ))}
        </group>
    );
};

export default function DnaModel() {
    return (
        <div className="w-full h-full min-h-[400px] relative">
            <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
                <pointLight position={[-10, -10, -10]} intensity={0.5} color="#4f46e5" />
                <DnaHelix />
                <OrbitControls enableZoom={false} autoRotate={false} />
            </Canvas>
        </div>
    );
}
