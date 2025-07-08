'use client';

import React from 'react';
import { Text } from '@react-three/drei';

interface FuturisticDialogProps {
  aiResponse: string;
}

const FuturisticDialog: React.FC<FuturisticDialogProps> = ({ aiResponse }) => {
  return (
    <group>
      <mesh>
        <boxGeometry args={[60, 10, 0.2]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <Text
        position={[0, 0, 0.11]}
        fontSize={1}
        color="lightgrey"
        anchorX="center"
        anchorY="middle"
        maxWidth={58}
        font="/Neon.ttf"
      >
        {aiResponse}
      </Text>
    </group>
  );
};

export default FuturisticDialog;