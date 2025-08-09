'use client';

import React, { useRef, useState, useEffect, useLayoutEffect } from 'react';
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
  const textRef = useRef<any>(null); // Use 'any' for now to access boundingBox
  const [isFocused, setIsFocused] = useState(false);
  const [textPosX, setTextPosX] = useState(0);
  const [textAnchorX, setTextAnchorX] = useState<'left' | 'center' | 'right'>('center');
  const [textPosY, setTextPosY] = useState(290); // Initial Y position for text

  useLayoutEffect(() => {
    if (textRef.current) {
      textRef.current.sync(); // Ensure text geometry is updated
      const initialYPosition = 10; // The starting Y position for the text

      if (value) {
        const textWidth = textRef.current.geometry.boundingBox.max.x - textRef.current.geometry.boundingBox.min.x;
        const maxInputWidth = 300; // From maxWidth prop
        const leftEdgeOfInputArea = -maxInputWidth / 2; // -150

        // Horizontal positioning logic
        if (textWidth <= maxInputWidth / 2) {
          setTextPosX(0); // Keep the anchor point at the center
          setTextAnchorX('right'); // Text expands from center to left
        } else {
          // Text is longer than half the max width, so fix its left edge at the left boundary
          setTextPosX(leftEdgeOfInputArea); // Position the text so its left edge is at -150
          setTextAnchorX('left'); // Anchor to the left
        }

        // Vertical scrolling logic
        const textHeight = textRef.current.geometry.boundingBox.max.y - textRef.current.geometry.boundingBox.min.y;
        const lineHeight = 10; // fontSize * estimatedLineHeightMultiplier
        const maxVisibleLines = 2; // User wants scrolling after 2 lines

        // Calculate how many lines exceed the visible area
        const currentLines = Math.ceil(textHeight / lineHeight);
        if (currentLines > maxVisibleLines) {
          const linesToScroll = currentLines - maxVisibleLines;
          const scrollAmount = linesToScroll * lineHeight;
          setTextPosY(initialYPosition + scrollAmount); // Move text up (increase Y) to scroll
        } else {
          setTextPosY(initialYPosition); // Reset to initial position if within limits
        }

      } else {
        // Placeholder case: centered
        setTextPosX(0);
        setTextAnchorX('center');
        setTextPosY(initialYPosition); // Reset Y position for placeholder
      }
    }
  }, [value]);

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
        <boxGeometry args={[500, 700, 5]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh
        ref={meshRef}
        onClick={() => setIsFocused(true)}
        position={[0, 0, 0]} // Adjusted for centering
      >
        <boxGeometry args={[310, 600, 3]} />
        <meshStandardMaterial color={'black'} transparent={true} opacity={1} roughness={1} metalness={0} />
        <Text
          ref={textRef}
          position={[textPosX, textPosY, 15.1]}
          fontSize={10}
          color="#39FF14"
          anchorX={textAnchorX}
          anchorY={"top"}
          maxWidth={300} // Set maxWidth to 290 units for wrapping
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