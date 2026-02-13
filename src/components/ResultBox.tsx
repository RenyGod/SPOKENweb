import { MessageSquare, Volume2 } from "lucide-react";

interface ResultBoxProps {
  result: string;
  isActive: boolean;
}

const ResultBox = ({ result, isActive }: ResultBoxProps) => {
  const handleSpeak = () => {
    if (result && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(result);
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <div 
      className="slide-up result-box w-full" 
      style={{ animationDelay: "0.2s" }}
      role="region"
      aria-label="Recognition result"
      aria-live="polite"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <MessageSquare className="h-5 w-5" aria-hidden="true" />
          </div>
          <span className="text-sm font-medium text-muted-foreground">
            Recognition Result
          </span>
        </div>
        
        {result && (
          <button
            onClick={handleSpeak}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground transition-colors hover:bg-secondary/80"
            aria-label="Speak result aloud"
          >
            <Volume2 className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
      </div>
      
      <div className="mt-4 min-h-[80px] rounded-lg bg-muted/50 p-4">
        {result ? (
          <p className="text-xl font-medium text-foreground">{result}</p>
        ) : (
          <p className="text-muted-foreground/60">
            {isActive 
              ? "Waiting for sign detection..." 
              : "Results will appear here when you start recognition"}
          </p>
        )}
      </div>
    </div>
  );
};

export default ResultBox;
