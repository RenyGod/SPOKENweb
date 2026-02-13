import { Camera, Video } from "lucide-react";

interface CameraViewProps {
  isActive: boolean;
}

const CameraView = ({ isActive }: CameraViewProps) => {
  return (
    <div className="slide-up w-full">
      <div 
        className="camera-container aspect-video w-full"
        role="img"
        aria-label="Camera feed area for sign language recognition"
      >
        <div className="flex h-full flex-col items-center justify-center gap-4 p-8">
          {isActive ? (
            <>
              <div className="flex items-center gap-2">
                <span className="pulse-dot" aria-hidden="true" />
                <span className="text-sm font-medium text-success">Live</span>
              </div>
              <Video className="h-16 w-16 text-muted-foreground/50" aria-hidden="true" />
              <p className="text-center text-sm text-muted-foreground">
                Camera feed will appear here
              </p>
            </>
          ) : (
            <>
              <Camera className="h-16 w-16 text-muted-foreground/40" aria-hidden="true" />
              <p className="text-center text-muted-foreground">
                Select a mode to start recognition
              </p>
              <p className="text-center text-sm text-muted-foreground/60">
                Camera access will be requested
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraView;
