'use client';

import React, { useState, Suspense, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Canvas } from '@react-three/fiber';
import ThreeDButton from '@/components/ThreeDButton';
import FuturisticDialog from '@/components/FuturisticDialog';
import ThreeDInput from '@/components/ThreeDInput';

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
      <Canvas camera={{ position: [0, 0, 30], fov: 50 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />

        <Suspense fallback={null}>
          <ThreeSceneContent aiResponse={response} isLoading={isLoading} isSpeaking={isSpeaking} />
        </Suspense>

        <group position={[0, -5, 0]}> {/* Adjust Y position to move input below head */}
          <ThreeDInput
            value={prompt}
            onChange={setPrompt}
            placeholder="Enter your prompt here..."
            disabled={isLoading}
          />
        </group>

        <group position={[0, -10, 0]}> {/* Adjust Y position to move button below input */}
          <ThreeDButton
            onClick={handleSubmit}
            text={isLoading ? 'TRANSMITTING...' : 'INITIATE QUERY'}
            color="orange"
          />
        </group>

        {/* AI Response Display */}
        {response && !isLoading && (
          <group position={[0, -15, 0]}> {/* Adjust Y position to move dialog below button */}
              <FuturisticDialog aiResponse={response} />
          </group>
        )}
      </Canvas>
    </main>
  );
}
