import { useState } from "react";
import HandTracker from "./HandTracker";

function App() {
  // mode can be: null | "STATIC" | "ALPHABET"
  const [mode, setMode] = useState<"STATIC" | "ALPHABET" | null>(null);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        color: "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      {/* HEADER */}
      <h1 style={{ fontSize: "2rem", marginBottom: "10px" }}>
        SpeakBySign
      </h1>
      <p style={{ marginBottom: "20px", opacity: 0.8 }}>
        Real-time Sign Language Recognition
      </p>

      {/* BUTTONS */}
      <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
        <button
          onClick={() => setMode("STATIC")}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            backgroundColor: mode === "STATIC" ? "#22c55e" : "#334155",
            color: "white",
            fontSize: "16px",
          }}
        >
          Static Gestures
        </button>

        <button
          onClick={() => setMode("ALPHABET")}
          style={{
            padding: "10px 20px",
            borderRadius: "8px",
            border: "none",
            cursor: "pointer",
            backgroundColor: mode === "ALPHABET" ? "#3b82f6" : "#334155",
            color: "white",
            fontSize: "16px",
          }}
        >
          Alphabets
        </button>
      </div>

      {/* STATUS TEXT */}
      {mode === null && (
        <p style={{ opacity: 0.7 }}>
          Select a mode to start detection
        </p>
      )}

      {mode === "STATIC" && (
        <p style={{ marginBottom: "10px", color: "#22c55e" }}>
          Static Gesture Detection Mode
        </p>
      )}

      {mode === "ALPHABET" && (
        <p style={{ marginBottom: "10px", color: "#3b82f6" }}>
          Alphabet Detection Mode
        </p>
      )}

      {/* CAMERA + MEDIAPIPE */}
      {mode && <HandTracker enabled={true} mode={mode} />}
    </div>
  );
}

export default App;
15