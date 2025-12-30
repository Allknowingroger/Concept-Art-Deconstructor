
import React, { useState } from 'react';
import InputPanel from './components/InputPanel';
import Canvas from './components/Canvas';
import { generateCharacterSheet } from './services/geminiService';
import { CharacterInputs, GenerationStatus } from './types';

const App: React.FC = () => {
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (inputs: CharacterInputs) => {
    setStatus(GenerationStatus.GENERATING);
    setError(null);
    setGeneratedImage(null);

    try {
      const imageUrl = await generateCharacterSheet(inputs);
      setGeneratedImage(imageUrl);
      setStatus(GenerationStatus.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unknown error occurred during generation.");
      setStatus(GenerationStatus.ERROR);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 text-slate-900">
      {/* Left Sidebar / Input Panel */}
      <InputPanel onGenerate={handleGenerate} status={status} />

      {/* Main Content / Canvas */}
      <Canvas imageUrl={generatedImage} status={status} error={error} />
      
      {/* Mobile Overlay warning */}
      <div className="md:hidden absolute inset-0 bg-white z-50 flex items-center justify-center text-center p-8">
        <div className="font-mono text-cyan-700">
          <p className="text-xl font-bold mb-4">Desktop Recommended</p>
          <p className="text-sm text-slate-500">This specialized interface requires a larger viewport for schematic analysis.</p>
        </div>
      </div>
    </div>
  );
};

export default App;