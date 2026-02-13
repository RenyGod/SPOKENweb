import cv2
import numpy as np
import base64
from tensorflow.keras.models import load_model

# 🔥 Load ONLY the CNN model
model = load_model("alphabet_sign/keras_model.h5")

# 🔥 Load ONLY A–Z labels
with open("alphabet_sign/labels.txt", "r") as f:
    labels = [line.strip() for line in f.readlines()]

IMG_SIZE = 224

def predict_alphabet(base64_image):
    try:
        if base64_image is None:
            return {"alphabet": "—", "confidence": 0}

        # Decode image
        img_bytes = base64.b64decode(base64_image)
        np_arr = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

        if img is None:
            return {"alphabet": "—", "confidence": 0}

        # Preprocess (must match training)
        img = cv2.resize(img, (IMG_SIZE, IMG_SIZE))
        img = img.astype("float32") / 255.0
        img = np.expand_dims(img, axis=0)

        preds = model.predict(img, verbose=0)[0]
        idx = int(np.argmax(preds))

        return {
            "alphabet": labels[idx],
            "confidence": float(round(preds[idx], 2))
        }

    except Exception as e:
        print("ALPHABET ERROR:", e)
        return {"alphabet": "—", "confidence": 0}
