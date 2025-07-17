'use client';

import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface ThreeDButtonProps {
  onClick: () => void;
  text: string;
  color: string;
  isXRotationPaused: boolean;
  isYRotationPaused: boolean;
  isZRotationPaused: boolean;
  onRotationChange: (x: number, y: number, z: number) => void;
}

interface EnhancedTextProps {
    text: string;
    font: string;
    fontSize: number;
    maxWidth: number;
    position: [number, number, number];
    mainColor: string;
    shadowColor: string;
    thicknessColor: string;
  }
  
const EnhancedText: React.FC<EnhancedTextProps> = ({
    text,
    font,
    fontSize,
    maxWidth,
    position,
    mainColor,
    shadowColor,
    thicknessColor,
}) => {
    const [x, y, z] = position;
    return (
      <>
        {/* Shadow */}
        <Text position={[x + 2, y - 2, z - 0.2]} fontSize={fontSize} color="#000000" font={font} fontWeight="bold" maxWidth={maxWidth}>
          {text}
        </Text>
        {/* Thickness layer */}
        <Text position={[x + 0.5, y - 0.5, z - 0.1]} fontSize={fontSize} color={thicknessColor} font={font} fontWeight="bold" maxWidth={maxWidth}>
          {text}
        </Text>
        {/* Main Text */}
        <Text position={[x, y, z + 5]} fontSize={fontSize} color={mainColor} font={font} fontWeight="bold" maxWidth={maxWidth}>
          <meshStandardMaterial attach="material" />
          {text}
        </Text>
      </>
    );
};

const ThreeDButton: React.FC<ThreeDButtonProps> = ({ onClick, text, color, isXRotationPaused, isYRotationPaused, isZRotationPaused, onRotationChange }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  const [scale, setScale] = useState(new THREE.Vector3(1, 1, 1));
  const lastLogTime = useRef(0);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      const time = clock.elapsedTime;
      // X-axis rotation (more forward/back tilt)
      if (!isXRotationPaused) {
        meshRef.current.rotation.x = -0.3 + Math.sin(time * 0.8) * (30 * Math.PI / 180); // Increased for equal top/bottom visibility
      }
      // Y-axis rotation
      if (!isYRotationPaused) {
        meshRef.current.rotation.y = Math.sin(time * 0.6) * (30 * Math.PI / 180); // See east+west sides
      }
      // Z-axis rotation
      if (!isZRotationPaused) {
        meshRef.current.rotation.z = Math.sin(time * 0.7) * (25 * Math.PI / 180);
      }

      // Smoothly animate scale
      const targetScale = hovered ? 1.2 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

      // Smoothly animate emissive intensity
      const targetEmissiveIntensity = hovered ? 1 : 0.2;
      if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
        meshRef.current.material.emissiveIntensity = THREE.MathUtils.lerp(
          meshRef.current.material.emissiveIntensity,
          targetEmissiveIntensity,
          0.1
        );
      }

      // Smoothly animate Z-position on click
      const targetZ = active ? -1 : 0; // Move slightly back when active
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, targetZ, 0.1);

      // Pass rotation values to parent
      onRotationChange(meshRef.current.rotation.x, meshRef.current.rotation.y, meshRef.current.rotation.z);

      // Log coordinates every 10 seconds
      // if (time - lastLogTime.current > 1) {
      //   console.log(
      //     `Button Rotation: X=${meshRef.current.rotation.x.toFixed(2)}, Y=${meshRef.current.rotation.y.toFixed(2)}, Z=${meshRef.current.rotation.z.toFixed(2)}`
      //   );
      //   lastLogTime.current = time;
      // }
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
      position={[-5, -30, 0]} // Adjusted for centering and visibility
    >
      <boxGeometry args={[176.61925, 53.15725, 26.578625]} />
      <meshStandardMaterial
        color={hovered ? 'hotpink' : color}
        metalness={0.7}
        roughness={0.2}
        emissive={hovered ? 'hotpink' : color}
        emissiveIntensity={hovered ? 0.5 : 0.2}
      />
      <EnhancedText
        text={text}
        font="/Neon.ttf"
        fontSize={26.578625}
        maxWidth={200}
        position={[0, 0, 18]}
        mainColor="lime"
        shadowColor="black"
        thicknessColor="darkgreen"
      />
    </mesh>
  );
};

export default ThreeDButton;