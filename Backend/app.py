from flask import Flask, request, jsonify
from flask_cors import CORS

# Static gesture predictor
from static_sign.predictor import predict_static_gesture

# Alphabet predictor
from alphabet_sign.predictor import predict_alphabet

app = Flask(__name__)
CORS(app)

# -----------------------------
# Home Route (Health Check)
# -----------------------------
@app.route("/")
def home():
    return "SpeakBySign Backend Running (Static + Alphabet)"

# -----------------------------
# Static Gesture API
# -----------------------------
@app.route("/api/static", methods=["POST"])
def static_sign():
    try:
        data = request.get_json()
        landmarks = data.get("landmarks")

        result = predict_static_gesture(landmarks)
        return jsonify(result)

    except Exception as e:
        print("STATIC API ERROR:", e)
        return jsonify({"error": str(e)}), 500

# -----------------------------
# Alphabet Detection API
# -----------------------------
@app.route("/api/alphabet", methods=["POST"])
def alphabet_sign():
    try:
        data = request.get_json()
        image_base64 = data.get("image")

        result = predict_alphabet(image_base64)
        return jsonify(result)

    except Exception as e:
        print("ALPHABET API ERROR:", e)
        return jsonify({"error": str(e)}), 500

# -----------------------------
# Run Server
# -----------------------------
if __name__ == "__main__":
    app.run(debug=True)
