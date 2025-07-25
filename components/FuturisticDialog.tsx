'use client';

import React, { useEffect } from 'react';
import { Text } from '@react-three/drei';
import { useThree } from '@react-three/fiber';

interface FuturisticDialogProps {
  aiResponse: string;
}

const FuturisticDialog: React.FC<FuturisticDialogProps> = ({ aiResponse }) => {
  const { invalidate } = useThree();

  useEffect(() => {
    invalidate();
  }, [aiResponse, invalidate]);

  return (
    <group scale={[3, 3, 3]}>
      {/* Border Mesh */}
      <mesh position={[-5, 0, -0.2]} >
        <boxGeometry args={[200, 35, 0.6]} />
        <meshStandardMaterial color="#39FF14" /> {/* Neon green border */}
      </mesh>
      <mesh position={[-5, 0, 0]}>
        <boxGeometry args={[196, 31, 0.66]} />
        <meshStandardMaterial color="black" transparent={true} opacity={0.8} />
      </mesh>
      <Text
        position={[0, 0, 0.363]}
        fontSize={3.3}
        color="lightgrey"
        anchorX="center"
        anchorY="middle"
        maxWidth={150}
        font="/Neon.ttf"
      >
        {aiResponse}
      </Text>
    </group>
  );
};

export default FuturisticDialog;
