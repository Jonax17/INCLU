"""
INCLU - Prediccion en Tiempo Real con Landmarks VR
Reconocimiento de senas LSN con esqueleto 3D superpuesto.
"""
import cv2
import math
import sys
import os
import pickle
import numpy as np
import tensorflow as tf
from collections import deque, Counter
from mediapipe.tasks.python import BaseOptions
from mediapipe.tasks.python.vision import HandLandmarker, HandLandmarkerOptions
from mediapipe.tasks.python.vision.core.image import Image as MPImage, ImageFormat

MODEL_DIR = os.path.join(os.path.dirname(__file__), "model_landmarks")

HAND_CONNECTIONS = [
    (0,1),(1,2),(2,3),(3,4),
    (0,5),(5,6),(6,7),(7,8),
    (5,9),(9,10),(10,11),(11,12),
    (9,13),(13,14),(14,15),(15,16),
    (13,17),(17,18),(18,19),(19,20),
    (0,17),
]

COLORS = {
    "wrist": (200, 200, 200),
    "thumb": (0, 100, 255),
    "index": (0, 200, 100),
    "middle": (255, 100, 0),
    "ring": (255, 0, 200),
    "pinky": (0, 255, 200),
}
FINGER_GROUPS = {
    "wrist": [0],
    "thumb": [1, 2, 3, 4],
    "index": [5, 6, 7, 8],
    "middle": [9, 10, 11, 12],
    "ring": [13, 14, 15, 16],
    "pinky": [17, 18, 19, 20],
}


def create_landmarker():
    model_path = os.path.join(MODEL_DIR, "hand_landmarker.task")
    if not os.path.exists(model_path):
        print(f"Error: No se encontro {model_path}")
        sys.exit(1)
    options = HandLandmarkerOptions(
        base_options=BaseOptions(model_asset_path=model_path),
        num_hands=1,
        min_hand_detection_confidence=0.5,
        min_tracking_confidence=0.5,
    )
    return HandLandmarker.create_from_options(options)


def load_classifier():
    model_path = os.path.join(MODEL_DIR, "inclu_landmarks.keras")
    if not os.path.exists(model_path):
        print(f"Error: No se encontro el modelo en {model_path}")
        print("Primero ejecuta: python train_landmarks.py")
        sys.exit(1)
    model = tf.keras.models.load_model(model_path)
    with open(os.path.join(MODEL_DIR, "scaler.pkl"), "rb") as f:
        scaler = pickle.load(f)
    with open(os.path.join(MODEL_DIR, "label_encoder.pkl"), "rb") as f:
        le = pickle.load(f)
    return model, scaler, le


def extract_features(hand_landmarks):
    wrist = hand_landmarks[0]
    features = []
    for lm in hand_landmarks:
        features.extend([lm.x - wrist.x, lm.y - wrist.y, lm.z - wrist.z])

    finger_tips = [4, 8, 12, 16, 20]
    finger_mcps = [2, 5, 9, 13, 17]
    for tip, mcp in zip(finger_tips, finger_mcps):
        dx = hand_landmarks[tip].x - hand_landmarks[mcp].x
        dy = hand_landmarks[tip].y - hand_landmarks[mcp].y
        features.append(math.atan2(dy, dx))

    for i in range(len(finger_tips)):
        for j in range(i + 1, len(finger_tips)):
            lm1, lm2 = hand_landmarks[finger_tips[i]], hand_landmarks[finger_tips[j]]
            features.append(math.sqrt((lm1.x - lm2.x)**2 + (lm1.y - lm2.y)**2))

    return features


def draw_vr_skeleton(frame, hand_landmarks, w, h):
    for start_idx, end_idx in HAND_CONNECTIONS:
        lm1, lm2 = hand_landmarks[start_idx], hand_landmarks[end_idx]
        x1, y1 = int(lm1.x * w), int(lm1.y * h)
        x2, y2 = int(lm2.x * w), int(lm2.y * h)
        color = (150, 150, 150)
        for finger, indices in FINGER_GROUPS.items():
            if start_idx in indices or end_idx in indices:
                color = COLORS[finger]
                break
        cv2.line(frame, (x1, y1), (x2, y2), color, 3)

    for i, lm in enumerate(hand_landmarks):
        x, y = int(lm.x * w), int(lm.y * h)
        color = (150, 150, 150)
        for finger, indices in FINGER_GROUPS.items():
            if i in indices:
                color = COLORS[finger]
                break
        cv2.circle(frame, (x, y), 8, color, -1)
        cv2.circle(frame, (x, y), 12, color, 2)
        if i in [4, 8, 12, 16, 20]:
            cv2.circle(frame, (x, y), 10, (255, 255, 255), -1)
            cv2.circle(frame, (x, y), 10, color, 2)


def main():
    landmarker = create_landmarker()
    model, scaler, le = load_classifier()

    device = int(sys.argv[1]) if len(sys.argv) > 1 else 0
    cap = cv2.VideoCapture(device)
    if not cap.isOpened():
        print(f"Error: No se pudo abrir la camara {device}.")
        return

    print("=" * 50)
    print("  INCLU - Reconocimiento Landmarks VR")
    print("=" * 50)
    print(f"  Clases: {len(le.classes_)}")
    print("  Presiona ESC para salir")
    print()

    history = deque(maxlen=5)

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        frame = cv2.flip(frame, 1)
        h, w = frame.shape[:2]
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        mp_img = MPImage(image_format=ImageFormat.SRGB, data=np.ascontiguousarray(rgb))
        result = landmarker.detect(mp_img)

        prediction_text = "Sin mano"
        confidence = 0.0
        top3 = []

        if result.hand_landmarks:
            draw_vr_skeleton(frame, result.hand_landmarks[0], w, h)
            features = extract_features(result.hand_landmarks[0])
            X = np.array(features).reshape(1, -1)
            X_scaled = scaler.transform(X)
            preds = model.predict(X_scaled, verbose=0)[0]

            pred_idx = np.argmax(preds)
            confidence = float(preds[pred_idx])
            prediction_text = le.classes_[pred_idx]
            history.append(prediction_text)

            top3_idx = np.argsort(preds)[-3:][::-1]
            top3 = [(le.classes_[i], float(preds[i])) for i in top3_idx]

        if len(history) > 2:
            prediction_text = Counter(history).most_common(1)[0][0]

        color = (0, 255, 0) if confidence > 0.7 else (0, 255, 255) if confidence > 0.4 else (0, 0, 255)
        cv2.rectangle(frame, (0, 0), (300, 160), (40, 40, 40), -1)
        cv2.putText(frame, f"Letra: {prediction_text}", (10, 40),
                    cv2.FONT_HERSHEY_SIMPLEX, 1.2, color, 3)
        cv2.putText(frame, f"Confianza: {confidence:.1%}", (10, 75),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.7, (200, 200, 200), 2)
        for i, (cls, prob) in enumerate(top3):
            bar_color = (0, 255, 0) if i == 0 else (150, 150, 150)
            cv2.putText(frame, f"{cls}: {prob:.1%}", (10, 110 + i * 25),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, bar_color, 2)
        cv2.putText(frame, "ESC = salir", (10, h - 15),
                    cv2.FONT_HERSHEY_SIMPLEX, 0.5, (150, 150, 150), 1)
        cv2.imshow("INCLU - Landmarks VR", frame)

        if cv2.waitKey(30) & 0xFF == 27:
            break

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
