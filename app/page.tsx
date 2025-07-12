'use client';

import React, { useState, Suspense, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import ThreeDButton from '@/components/ThreeDButton';
import FuturisticDialog from '@/components/FuturisticDialog';
import ThreeDInput from '@/components/ThreeDInput';
import { OrbitControls } from '@react-three/drei';

const ThreeSceneContent = dynamic(() => import('@/components/ThreeScene'), { ssr: false });

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false); // New state for speech status
  const [lastSpokenResponse, setLastSpokenResponse] = useState('');
  const speechInitiatedRef = useRef(false);

  // Speech Synthesis state and effects
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      const newUtterance = new SpeechSynthesisUtterance();
      newUtterance.lang = 'en-US'; // Set language
      newUtterance.onend = () => {
        setIsSpeaking(false); // Stop animation when speech ends
      };
      setUtterance(newUtterance);
    }
  }, []);

  useEffect(() => {
    if (utterance) {
      if (response && !isLoading && response !== lastSpokenResponse && !speechInitiatedRef.current) {
        utterance.text = response;
        window.speechSynthesis.speak(utterance);
        setIsSpeaking(true);
        setLastSpokenResponse(response); // Mark this response as spoken
        speechInitiatedRef.current = true; // Mark speech as initiated for this response
      } else if (isLoading) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setLastSpokenResponse(''); // Reset when loading new prompt
        speechInitiatedRef.current = false; // Reset ref for new prompt
      }
    }
  }, [response, isLoading, utterance, lastSpokenResponse]);

  const handleSubmit = async () => {
    setIsLoading(true);
    setResponse('Processing...');

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

  return (
    <main className="flex flex-col h-screen bg-black text-gray-300 items-center ">
      {/* Head Canvas */}
      <div className="w-full h-[60vh] flex justify-center items-center">
        <Canvas className="w-full h-full" camera={{ position: [0, 0, 60], fov: 75 }} dpr={[1, 2]}>
          <Suspense fallback={null}>
            <ThreeSceneContent aiResponse={response} isLoading={isLoading} isSpeaking={isSpeaking} />
          </Suspense>
          <OrbitControls />
        </Canvas>
      </div>
      
      {/* Input Canvas */}
      <div className="w-full h-[10vh] flex justify-center items-center">
          <Canvas className="w-full h-full" dpr={[1, 2]} camera={{ position: [0, 0, 40], fov: 75 }}>
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
      <div className="w-full h-[15vh] flex justify-center items-center" style={{ border: '1px solid red' }}>
          <Canvas className="w-full h-full" dpr={[1, 2]} camera={{ position: [0, 0, 100], fov: 75 }}>
            <ambientLight intensity={1.5} />
            <pointLight position={[0, 0, 10]} intensity={2} />
            <ThreeDButton
                onClick={handleSubmit}
                text={isLoading ? 'TRANSMITTING...' : 'INITIATE QUERY'}
                color="orange"
            />
          </Canvas>
      </div>

      {/* AI Response Display */}
      {response && !isLoading && (
        <div className="mt-[10px] w-full h-[15vh] flex justify-center items-center">
            <Canvas className="w-full h-full" dpr={[1, 2]} camera={{ position: [0, 0, 40], fov: 75 }}>
                <ambientLight intensity={1.5} />
                <pointLight position={[0, 0, 10]} intensity={2} />
                <FuturisticDialog aiResponse={response} />
            </Canvas>
        </div>
      )}
    </main>
  );
}