'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface ThreeDInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled: boolean;
}

const ThreeDInput: React.FC<ThreeDInputProps> = ({ value, onChange, placeholder, disabled }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<THREE.Mesh>(null); // Ref for the Text mesh
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isFocused && !disabled) {
        if (event.key === 'Backspace') {
          onChange(value.slice(0, -1));
        } else if (event.key.length === 1) { // Only handle single character keys
          onChange(value + event.key);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [value, onChange, isFocused, disabled]);

  return (
    <group>
      <mesh
        ref={meshRef}
        onClick={() => setIsFocused(true)}
        position={[0, 0, 0]} // Reverted to original position
      >
        <boxGeometry args={[60, 5, 0.5]} />
        <meshStandardMaterial color={'black'} /> {/* Removed focus color change */}
        <Text
          ref={textRef}
          position={[0, 0, 0.30]}
          fontSize={1}
          color="#00FF00"
          anchorX="center"
          anchorY="middle"
          maxWidth={58}
          letterSpacing={0.1}
          font="/Neon.ttf"
        >
          {value || placeholder}
        </Text>
      </mesh>
    </group>
  );
};

export default ThreeDInput;
