'use client';

import React from 'react';
import { Text } from '@react-three/drei';

interface FuturisticDialogProps {
  aiResponse: string;
}

const FuturisticDialog: React.FC<FuturisticDialogProps> = ({ aiResponse }) => {
  return (
    <group>
      <mesh position={[-5, 0, 0]}>
        <boxGeometry args={[198, 33, 0.66]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <Text
        position={[0, 0, 0.363]}
        fontSize={3.3}
        color="lightgrey"
        anchorX="center"
        anchorY="middle"
        maxWidth={191.4}
        font="/Neon.ttf"
      >
        {aiResponse}
      </Text>
    </group>
  );
};

export default FuturisticDialog;
