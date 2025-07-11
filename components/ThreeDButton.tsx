'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface ThreeDButtonProps {
  onClick: () => void;
  text: string;
  color: string;
}

const ThreeDButton: React.FC<ThreeDButtonProps> = ({ onClick, text, color }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      // X-axis rotation (horizontal plane)
      meshRef.current.rotation.x = Math.sin(time * 0.8) * (30 * Math.PI / 180);
      // Y-axis rotation
      meshRef.current.rotation.y = Math.sin(time * 0.6) * (30 * Math.PI / 180);
      // Z-axis rotation
      meshRef.current.rotation.z = Math.sin(time * 0.7) * (30 * Math.PI / 180);
    }
  });

  return (
    <mesh
      ref={meshRef}
      onClick={onClick}
      onPointerOver={() => setHover(true)}
      onPointerOut={() => setHover(false)}
      onPointerDown={() => setActive(true)}
      onPointerUp={() => setActive(false)}
      position={[-5, -10, 0]} // Adjusted for centering and visibility
    >
      <boxGeometry args={[206, 62, 31]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : color} />
      <Text position={[0, 0, 15.6]} fontSize={31} color="lime" font="/Neon.ttf" fontWeight="bold" maxWidth={200} depthOffset={0.1} material-depthWrite={true}>
        {text}
      </Text>
      {/* Shadow Text */}
      <Text position={[3.08, -3.08, 15.4]} fontSize={31} color="lime" font="/Neon.ttf" fontWeight="bold" maxWidth={200} depthOffset={0.1} material-depthWrite={true}>
        {text}
      </Text>
    </mesh>
  );
};

export default ThreeDButton;