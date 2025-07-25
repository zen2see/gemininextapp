'use client';

import React, { useRef, useEffect, forwardRef, Suspense } from 'react';
import { useGLTF, OrbitControls, useAnimations } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface ThreeSceneContentProps {
  aiResponse: string;
  isLoading: boolean;
  isSpeaking: boolean;
}

interface ModelProps {
  aiResponse: string;
  isLoading: boolean;
  isSpeaking: boolean;
}

const Model = forwardRef<THREE.Group, ModelProps>(({ aiResponse, isLoading, isSpeaking }, ref) => {
  const { scene, animations } = useGLTF('/blender_sushi.glb');
  const { actions } = useAnimations(animations, scene);

  useEffect(() => {
    if ((isLoading || isSpeaking) && actions && Object.keys(actions).length > 0) {
      const firstActionKey = Object.keys(actions)[0];
      // Stop all actions first to ensure clean restart
      Object.values(actions).forEach(action => action?.stop());
      actions[firstActionKey]?.play();
    } else if (!isLoading && !isSpeaking && actions) {
      // Stop animation when loading ends and speech ends
      Object.values(actions).forEach(action => action?.stop());
    }
  }, [actions, isLoading, isSpeaking]); // Depend on isLoading and isSpeaking

  return (
    <group
      ref={ref} // Attach the forwarded ref here
      scale={66}
      position={[-15, 0, 0]} // Adjusted for centering
      rotation-x={0} // Rotate 0 degrees on X-axis to stand upright
      rotation-y={0} // Rotate 0 degrees on Y-axis to face camera
      rotation-z={0.2}
    >
      <primitive object={scene} /> {/* Animation applies to the scene within this group */}
    </group>
  );
});

Model.displayName = 'Model'; // Add display name for better debugging

export default function ThreeSceneContent({ aiResponse, isLoading, isSpeaking }: ThreeSceneContentProps) {
  const modelRef = useRef<THREE.Group>(null); // Ref to get model's position for OrbitControls target
  const { gl } = useThree();

  return (
    <>
      
            <fog attach="fog" args={['#000000', 0.015]} />
      <ambientLight intensity={.2} />
      <pointLight position={[10, 20, 5]} intensity={2.5} />
      <directionalLight position={[-10, -5, 8]} intensity={1.8} />
      {/* Top-left red spotlight */}
      <spotLight
        position={[-50, 50, 20]} // Adjust position as needed
        intensity={1000} // Adjust intensity as needed
        angle={0.5} // Angle of the spotlight cone
        penumbra={0.5} // Softness of the spotlight edge
        color="red" // Red color
        castShadow // Enable shadow casting
      />
      {/* Top-right blue spotlight */}
      <spotLight
        position={[50, 50, 20]} // Adjust position as needed
        intensity={1000} // Adjust intensity as needed
        angle={0.5} // Angle of the spotlight cone
        penumbra={0.5} // Softness of the spotlight edge
        color="blue" // Blue color
        castShadow // Enable shadow casting
      />
      <Suspense fallback={null}>
        {/* Pass ref to Model */}
        <Model aiResponse={aiResponse} isLoading={isLoading} isSpeaking={isSpeaking} ref={modelRef} /> 
      </Suspense>
      {/* Set target to model and disable when animating/speaking */}
      {gl && (
        <OrbitControls makeDefault target={modelRef.current?.position} enabled={!isLoading && !isSpeaking} domElement={gl.domElement} />
      )} 
    </>
  );
}