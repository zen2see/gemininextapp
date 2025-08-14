
'use client';

import React, { useMemo } from 'react';
import * as THREE from 'three';

interface CustomLineProps {
  points: [number, number, number][];
  color?: THREE.ColorRepresentation;
  lineWidth?: number;
  position?: [number, number, number];
}

export default function CustomLine({ points, color = 'white', lineWidth = 1, position = [0, 0, 0] }: CustomLineProps) {
  const geometry = useMemo(() => {
    const bufferGeometry = new THREE.BufferGeometry();
    const vertices = new Float32Array(points.flat());
    bufferGeometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    return bufferGeometry;
  }, [points]);

  return (
    <line position={position}>
      <primitive object={geometry} />
      <lineBasicMaterial color={color} linewidth={lineWidth} />
    </line>
  );
}
