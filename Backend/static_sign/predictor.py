import pickle
import numpy as np

data = pickle.load(open("static_sign/model.p", "rb"))

# Extract model
if isinstance(data, dict):
    model = data["model"]
else:
    model = data

# 🔥 EXACT SAME LABELS AS OLD DESKTOP APP
LABELS = {
    0: "Hello",
    1: "I Love You",
    2: "No",
    3: "Good",
    4: "Bad",
    5: "Okay",
    6: "You",
    7: "Me",
    8: "Thank You",
    9: "Help"
}

def predict_static_gesture(landmarks):
    if landmarks is None:
        return {"gesture": "—", "confidence": 0}

    X = np.array(landmarks, dtype=float).reshape(1, -1)

    if X.shape[1] != model.n_features_in_:
        return {"gesture": "—", "confidence": 0}

    pred = int(model.predict(X)[0])

    confidence = (
        float(max(model.predict_proba(X)[0]))
        if hasattr(model, "predict_proba")
        else 1.0
    )

    return {
        "gesture": LABELS[pred],
        "confidence": round(confidence, 2)
    }
