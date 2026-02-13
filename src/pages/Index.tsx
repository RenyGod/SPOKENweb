import { useState } from "react";
import Header from "@/components/Header";
import CameraView from "@/components/CameraView";
import ActionButtons from "@/components/ActionButtons";
import ResultBox from "@/components/ResultBox";

type RecognitionMode = "static" | "alphabets" | null;

const Index = () => {
  const [activeMode, setActiveMode] = useState<RecognitionMode>(null);
  const [result, setResult] = useState<string>("");

  const handleModeChange = (mode: RecognitionMode) => {
    setActiveMode(mode);
    // Clear result when mode changes
    if (mode !== activeMode) {
      setResult("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-3xl px-4 pb-12">
        <Header />
        
        <main className="flex flex-col items-center gap-8" role="main">
          <CameraView isActive={activeMode !== null} />
          
          <ActionButtons 
            activeMode={activeMode} 
            onModeChange={handleModeChange} 
          />
          
          <ResultBox 
            result={result} 
            isActive={activeMode !== null} 
          />
        </main>
        
        <footer className="mt-12 text-center">
          <p className="text-sm text-muted-foreground/60">
            Accessibility-first sign language recognition
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
