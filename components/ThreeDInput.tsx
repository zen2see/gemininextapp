'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';

interface ThreeDInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  disabled: boolean;
}

const ThreeDInput: React.FC<ThreeDInputProps> = ({ value, onChange, placeholder, disabled }) => {
  const { invalidate } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<THREE.Mesh>(null); // Ref for the Text mesh
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    invalidate();
  }, [value, placeholder, disabled, invalidate]);

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
      {/* Border Mesh */}
      <mesh position={[-5, 0, -0.1]} >
        <boxGeometry args={[500, 540, 5]} />
        <meshStandardMaterial color="black" />
        
      </mesh>
      <mesh
        ref={meshRef}
        onClick={() => setIsFocused(true)}
        position={[0, 0, 0]} // Adjusted for centering
      >
        <boxGeometry args={[310, 400, 3]} />
        <meshStandardMaterial color={'black'} transparent={true} opacity={1} roughness={1} metalness={0} />
        <Text
          ref={textRef}
          position={value ? [-155, 0, 15.1] : [0, 0, 15.1]} // Adjust position based on value for alignment
          fontSize={10}
          color="#39FF14"
          anchorX={value ? "left" : "center"}
          anchorY="middle"
          maxWidth={310} // Set maxWidth to 310 units for wrapping
          letterSpacing={0.15} // Restore letterSpacing
          font="/Neonlux.ttf"
        >
          {value || placeholder}
        </Text>
      </mesh>
    </group>
  );
};

export default ThreeDInput;