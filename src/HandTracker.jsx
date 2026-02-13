import { useEffect, useRef, useState } from "react";
import { Hands, HAND_CONNECTIONS } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import * as drawingUtils from "@mediapipe/drawing_utils";

export default function HandTracker({ enabled, mode }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraRef = useRef(null);

  const landmarksRef = useRef(null);
  const lastCallRef = useRef(0);
  const alphabetRequestRunning = useRef(false);

  // 🔥 Majority voting buffer
  const predictionBufferRef = useRef([]);
  const bufferStartTimeRef = useRef(0);
  const BUFFER_TIME = 2000; // 2 seconds

  const [output, setOutput] = useState("—");
  const [confidence, setConfidence] = useState(0);

  /* MEDIAPIPE */
  useEffect(() => {
    if (!enabled) return;

    const hands = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.6,
    });

    hands.onResults((results) => {
      if (results.multiHandLandmarks) {
        landmarksRef.current = results.multiHandLandmarks[0];
      } else {
        landmarksRef.current = null;
        predictionBufferRef.current = [];
        bufferStartTimeRef.current = 0;
        setOutput("—");
        setConfidence(0);
      }
    });

    cameraRef.current = new Camera(videoRef.current, {
      width: 640,
      height: 480,
      onFrame: async () => {
        await hands.send({ image: videoRef.current });
      },
    });

    cameraRef.current.start();
    return () => cameraRef.current.stop();
  }, [enabled]);

  /* LOOP */
  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const loop = async () => {
      if (videoRef.current?.readyState === 4) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        if (landmarksRef.current) {
          const landmarks = landmarksRef.current;

          if (mode === "STATIC") {
            drawingUtils.drawConnectors(
              ctx,
              landmarks,
              HAND_CONNECTIONS,
              { color: "#00FF00", lineWidth: 3 }
            );
            drawingUtils.drawLandmarks(ctx, landmarks, {
              color: "#FF0000",
              lineWidth: 2,
            });
          }

          const now = Date.now();

          /* STATIC */
          if (mode === "STATIC" && now - lastCallRef.current > 200) {
            lastCallRef.current = now;

            const flat = [];
            landmarks.forEach((p) => {
              flat.push(p.x);
              flat.push(p.y);
            });

            const res = await fetch("http://127.0.0.1:5000/api/static", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ landmarks: flat }),
            });

            const data = await res.json();
            setOutput(data.gesture);
            setConfidence(data.confidence);
          }

          /* ALPHABET */
          if (
            mode === "ALPHABET" &&
            now - lastCallRef.current > 400 &&
            !alphabetRequestRunning.current
          ) {
            lastCallRef.current = now;
            alphabetRequestRunning.current = true;

            const xs = landmarks.map(p => p.x * canvas.width);
            const ys = landmarks.map(p => p.y * canvas.height);

            const xMin = Math.max(Math.min(...xs) - 20, 0);
            const yMin = Math.max(Math.min(...ys) - 20, 0);
            const xMax = Math.min(Math.max(...xs) + 20, canvas.width);
            const yMax = Math.min(Math.max(...ys) + 20, canvas.height);

            const w = xMax - xMin;
            const h = yMax - yMin;

            if (w > 0 && h > 0) {
              const tempCanvas = document.createElement("canvas");
              tempCanvas.width = 224;
              tempCanvas.height = 224;

              tempCanvas
                .getContext("2d")
                .drawImage(
                  videoRef.current,
                  xMin,
                  yMin,
                  w,
                  h,
                  0,
                  0,
                  224,
                  224
                );

              const base64 = tempCanvas
                .toDataURL("image/jpeg")
                .split(",")[1];

              const res = await fetch("http://127.0.0.1:5000/api/alphabet", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: base64 }),
              });

              const data = await res.json();
              const pred = data.alphabet;
              const conf = data.confidence;

              if (conf > 0.4) { // light filter
                if (bufferStartTimeRef.current === 0) {
                  bufferStartTimeRef.current = Date.now();
                }

                predictionBufferRef.current.push(pred);

                const elapsed = Date.now() - bufferStartTimeRef.current;

                if (elapsed >= BUFFER_TIME) {
                  // 🔥 Majority vote
                  const counts = {};
                  predictionBufferRef.current.forEach(p => {
                    counts[p] = (counts[p] || 0) + 1;
                  });

                  const finalLetter = Object.keys(counts).reduce((a, b) =>
                    counts[a] > counts[b] ? a : b
                  );

                  setOutput(finalLetter);
                  setConfidence(conf);

                  // reset buffer
                  predictionBufferRef.current = [];
                  bufferStartTimeRef.current = 0;
                }
              }
            }

            alphabetRequestRunning.current = false;
          }
        }
      }

      requestAnimationFrame(loop);
    };

    loop();
  }, [enabled, mode]);

  return (
    <div style={{ position: "relative", width: 640 }}>
      <video ref={videoRef} width={640} height={480} style={{ display: "none" }} />
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        style={{ borderRadius: "12px", border: "2px solid #444" }}
      />
      <div
        style={{
          position: "absolute",
          bottom: 10,
          left: 10,
          background: "rgba(0,0,0,0.7)",
          padding: "10px",
          borderRadius: "8px",
          color: "#fff",
        }}
      >
        <div>{mode === "STATIC" ? "Gesture" : "Alphabet"}: <b>{output}</b></div>
        <div>Confidence: {confidence}</div>
      </div>
    </div>
  );
}
