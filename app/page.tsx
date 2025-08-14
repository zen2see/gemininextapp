'use client';

import React, { useState, Suspense, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Canvas, useThree } from '@react-three/fiber';
import ThreeDButton from '@/components/ThreeDButton';
import FuturisticDialog from '@/components/FuturisticDialog';
import ThreeDInput from '@/components/ThreeDInput';
import { OrbitControls, Text } from '@react-three/drei';
import CustomLine from '@/components/CustomLine';

const ThreeSceneContent = dynamic(() => import('@/components/ThreeScene'), { ssr: false });

function OrbitControlsSetup() {
  const { gl } = useThree();
  return <OrbitControls domElement={gl.domElement} />;
}

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false); // New state for speech status
  const spokenResponseRef = useRef(''); // Tracks what has been spoken

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      const newUtterance = new SpeechSynthesisUtterance();
      newUtterance.lang = 'en-US'; // Set language
      newUtterance.onend = () => {
        setIsSpeaking(false); // Stop animation when speech ends
      };
      utteranceRef.current = newUtterance;
    }
  }, []);

  useEffect(() => {
    if (utteranceRef.current && response && !isLoading && response !== spokenResponseRef.current) {
      // Only speak if a new, non-empty response is available and not loading
      utteranceRef.current.text = response;
      window.speechSynthesis.speak(utteranceRef.current);
      setIsSpeaking(true); // Start animation when speech actually begins
      spokenResponseRef.current = response; // Mark this response as spoken
    } else if (isLoading) {
      // If loading, cancel any ongoing speech and reset state
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      spokenResponseRef.current = ''; // Reset for next response
    }
  }, [response, isLoading]); // Dependencies are response and isLoading

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();       
      setResponse(data.text);
    } catch (error) {
      console.error('Error fetching from Gemini API:', error);
      setResponse('Error: Unable to get response from AI.');
    } finally {
      setIsLoading(false);
    }
  };

  const [isXRotationPaused, setIsXRotationPaused] = useState(false);
  const [isYRotationPaused, setIsYRotationPaused] = useState(false);
  const [isZRotationPaused, setIsZRotationPaused] = useState(false);
  const [buttonRotation, setButtonRotation] = useState({ x: 0, y: 0, z: 0 });

  const handleRotationChange = (x: number, y: number, z: number) => {
    setButtonRotation({ x, y, z });
  };

  // Keyboard event listener for toggling rotation
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey) { // Check if Alt key is pressed
        switch (event.key.toLowerCase()) {
          case 'x':
            setIsXRotationPaused((prev) => !prev);
            break;
          case 'y':
            setIsYRotationPaused((prev) => !prev);
            break;
          case 'z':
            setIsZRotationPaused((prev) => !prev);
            break;
        }
      } else {
        // If Alt key is not pressed, do nothing for these keys
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <main className="flex flex-col h-screen bg-black text-gray-300 items-center ">
      {/* Head Canvas */}
      <div className="w-full h-[55vh] flex justify-center items-center mt-[50px]">
        <Canvas className="w-full h-full" camera={{ position: [0, 0, 60], fov: 75 }} dpr={[1, 1.5]}>
          <Suspense fallback={null}>
            <ThreeSceneContent aiResponse={response} isLoading={isLoading} isSpeaking={isSpeaking} />
          </Suspense>
          <OrbitControlsSetup />
        </Canvas>
      </div>
      
      {/* Input Canvas */}
      <div className="w-full h-[10vh] flex justify-center items-center"> 
          {/* style={{ border: '1px solid yellow' }} */}
          <Canvas className="w-full h-full" dpr={[1, 1.5]} camera={{ position: [0, 0, 40], fov: 75 }}>
            <ambientLight intensity={1.5} />
            <pointLight position={[0, 0, 10]} intensity={2} />
            <ThreeDInput
              value={prompt}
              onChange={setPrompt}
              placeholder="Enter your prompt here..."
              disabled={isLoading}
            />
          </Canvas>
      </div>

      {/* Button Canvas */}
      <div className="w-full h-[25vh] flex justify-center items-center mt-[5px]" style={{ border: '1px solid yellow' }}>
          <Canvas className="w-full h-full" dpr={[1, 1.5]} camera={{ position: [0, 0, 120], fov: 75 }}>
            <ambientLight intensity={1.5} />
            <directionalLight position={[0, 10, 10]} intensity={2.5} />
            <directionalLight position={[0, -10, 10]} intensity={1} />
            <ThreeDButton
                onClick={handleSubmit}
                text={isLoading ? 'TRANSMITTING...' : 'INITIATE QUERY'}
                color="orange"
                isXRotationPaused={isXRotationPaused}
                isYRotationPaused={isYRotationPaused}
                isZRotationPaused={isZRotationPaused}
                onRotationChange={handleRotationChange}
                isSpeaking={isSpeaking}
            />
            {/* X-axis diagram line */}
            <CustomLine points={[[-20, 0, 0], [20, 0, 0]]} color="red" position={[250, -30, 0]} />
            <Text position={[250 + 25, -30 + 8 + 2, 0]} fontSize={15} color="red" fontWeight={isXRotationPaused ? "bold" : "normal"}>X</Text>
            {/* Y-axis diagram line */}
            <CustomLine points={[[0, -20, 0], [0, 20, 0]]} color="green" position={[250, -30, 0]} />
            <Text position={[250, -30 + 25 + 8, 0]} fontSize={15} color="green" fontWeight={isYRotationPaused ? "bold" : "normal"}>Y</Text>
            {/* Z-axis diagram line */}
            <CustomLine points={[[0, 0, -20], [0, 0, 20]]} color="blue" position={[250, -30, 0]} /> 
            <Text position={[244, -30, 25]} fontSize={15} color="blue" fontWeight={isZRotationPaused ? "bold" : "normal"}>Z</Text>
            {(isXRotationPaused || isYRotationPaused || isZRotationPaused) && (
              <>
                <Text position={[255 + 40, 27, 0]} fontSize={12} color="yellow">press ALT + KEY to UNDO</Text>
                <Text position={[255 + 40, 43, 0]} fontSize={14} color="yellow">
                  {`PAUSED ${isXRotationPaused ? 'X' : ''}${isYRotationPaused ? 'Y' : ''}${isZRotationPaused ? 'Z' : ''}`.trim()}
                </Text>
              </>
            )}
            {/* Display rotation values when paused */}
            {(isXRotationPaused || isYRotationPaused || isZRotationPaused) && (
              <>
                <Text position={[250 + 50, 16, 0]} fontSize={10} color="red">{`X=${buttonRotation.x.toFixed(2)}`}</Text>
                <Text position={[250 + 49, 5, 0]} fontSize={10} color="green">{`Y=${buttonRotation.y.toFixed(2)}`}</Text>
                <Text position={[250 + 50, -6, 0]} fontSize={10} color="blue">{`Z=${buttonRotation.z.toFixed(2)}`}</Text>
              </>
            )}
          </Canvas>
      </div>

      {/* AI Response Display */}
      {response && !isLoading && (
        <div className="mt-[10px] w-full h-[15vh] flex justify-center items-center overflow-y-auto">
            <Canvas className="w-full h-full" dpr={[1, 1.5]} camera={{ position: [0, 0, 40], fov: 75 }}>
                <ambientLight intensity={1.5} />
                <pointLight position={[0, 0, 10]} intensity={2} />
                <FuturisticDialog aiResponse={response} />
            </Canvas>
        </div>
      )}
    </main>
  );
}


// npx https://github.com/google-gemini/gemini-cli