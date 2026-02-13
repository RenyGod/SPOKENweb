import { Fingerprint, Type } from "lucide-react";

type RecognitionMode = "static" | "alphabets" | null;

interface ActionButtonsProps {
  activeMode: RecognitionMode;
  onModeChange: (mode: RecognitionMode) => void;
}

const ActionButtons = ({ activeMode, onModeChange }: ActionButtonsProps) => {
  const handleClick = (mode: "static" | "alphabets") => {
    if (activeMode === mode) {
      onModeChange(null);
    } else {
      onModeChange(mode);
    }
  };

  return (
    <div className="slide-up flex w-full flex-col gap-4 sm:flex-row sm:gap-6" style={{ animationDelay: "0.1s" }}>
      <button
        onClick={() => handleClick("static")}
        className={`action-button flex flex-1 items-center justify-center gap-3 ${
          activeMode === "static" ? "action-button-primary" : ""
        }`}
        aria-pressed={activeMode === "static"}
        aria-label="Enable static gestures recognition mode"
      >
        <Fingerprint className="h-6 w-6" aria-hidden="true" />
        <span>Static Gestures</span>
      </button>
      
      <button
        onClick={() => handleClick("alphabets")}
        className={`action-button flex flex-1 items-center justify-center gap-3 ${
          activeMode === "alphabets" ? "action-button-primary" : ""
        }`}
        aria-pressed={activeMode === "alphabets"}
        aria-label="Enable alphabets recognition mode"
      >
        <Type className="h-6 w-6" aria-hidden="true" />
        <span>Alphabets</span>
      </button>
    </div>
  );
};

export default ActionButtons;
