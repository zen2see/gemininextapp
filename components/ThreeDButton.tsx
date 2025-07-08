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

      meshRef.current.scale.x = meshRef.current.scale.y = meshRef.current.scale.z = active ? 0.9 : 1;
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
    >
      <boxGeometry args={[7, 2, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : color} />
      <Text position={[0, 0, 0.75]} fontSize={1} color="#00FFFF" font="/Neon.ttf" fontWeight="bold" maxWidth={6.5} depthOffset={-0.1} material-depthWrite={true}>
        {text}
      </Text>
      {/* Shadow Text */}
      <Text position={[0.1, -0.1, 0.70]} fontSize={1} color="black" font="/Neon.ttf" fontWeight="bold" maxWidth={6.5} depthOffset={-0.1} material-depthWrite={true}>
        {text}
      </Text>
    </mesh>
  );
};

export default ThreeDButton;
