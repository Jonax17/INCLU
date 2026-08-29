"""
INCLU - Captura de Landmarks con MediaPipe Hands (Tasks API)
Extrae 21 puntos de la mano por frame y los guarda como CSV.
"""
import cv2
import csv
import math
import os
import sys
import numpy as np
from mediapipe.tasks.python import BaseOptions
from mediapipe.tasks.python.vision import HandLandmarker, HandLandmarkerOptions
from mediapipe.tasks.python.vision.core.image import Image as MPImage, ImageFormat

DATA_DIR = os.path.join(os.path.dirname(__file__), "landmarks_data")
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model_landmarks", "hand_landmarker.task")
IMAGES_PER_CLASS = 300
CLASSES = [chr(i) for i in range(ord("A"), ord("Z") + 1)]

# Letters with movement: capture 3 phases (start, middle, end)
MOTION_LETTERS = {"J": 3, "S": 3, "X": 3, "Z": 3}
PHASE_LABELS = ["inicio", "medio", "fin"]

# Hand connections for drawing (21 landmarks)
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
    options = HandLandmarkerOptions(
        base_options=BaseOptions(model_asset_path=MODEL_PATH),
        num_hands=1,
        min_hand_detection_confidence=0.3,
        min_hand_presence_confidence=0.3,
        min_tracking_confidence=0.3,
    )
    return HandLandmarker.create_from_options(options)


def ensure_dirs():
    os.makedirs(DATA_DIR, exist_ok=True)
    for cls in CLASSES:
        os.makedirs(os.path.join(DATA_DIR, cls), exist_ok=True)


def count_existing(cls):
    csv_file = os.path.join(DATA_DIR, cls, "landmarks.csv")
    if not os.path.exists(csv_file):
        return 0
    with open(csv_file, "r") as f:
        return sum(1 for _ in csv.reader(f)) - 1


def draw_vr_skeleton(frame, hand_landmarks, w, h):
    for start_idx, end_idx in HAND_CONNECTIONS:
        lm1 = hand_landmarks[start_idx]
        lm2 = hand_landmarks[end_idx]
        x1, y1 = int(lm1.x * w), int(lm1.y * h)
        x2, y2 = int(lm2.x * w), int(lm2.y * h)
        color = (150, 150, 150)
        for finger, indices in FINGER_GROUPS.items():
            if start_idx in indices or end_idx in indices:
                color = COLORS[finger]
                break
        cv2.line(frame, (x1, y1), (x2, y2), color, 2)

    for i, lm in enumerate(hand_landmarks):
        x, y = int(lm.x * w), int(lm.y * h)
        color = (150, 150, 150)
        for finger, indices in FINGER_GROUPS.items():
            if i in indices:
                color = COLORS[finger]
                break
        r = 5 if i not in [4, 8, 12, 16, 20] else 7
        cv2.circle(frame, (x, y), r, color, -1)
        cv2.circle(frame, (x, y), r + 2, color, 1)


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


def main():
    ensure_dirs()
    landmarker = create_landmarker()

    device = int(sys.argv[1]) if len(sys.argv) > 1 else 0
    cap = cv2.VideoCapture(device)
    if not cap.isOpened():
        print(f"Error: No se pudo abrir la camara {device}.")
        return

    print("=" * 50)
    print("  INCLU - Captura de Landmarks")
    print("=" * 50)
    print(f"Clases: {len(CLASSES)} (A-Z)")
    print(f"Meta: {IMAGES_PER_CLASS} muestras por clase")
    print(f"Features: 63 coords + 5 angulos + 10 distancias = 78")
    print()
    print("NOTA: J, S, X usan movimiento.")
    print("  Se capturan 3 fases: inicio, medio, fin")
    print()
    print("Controles:")
    print("  ESPACIO  - Iniciar captura")
    print("  N        - Siguiente letra")
    print("  ESC      - Salir")
    print()

    for cls_idx, cls_name in enumerate(CLASSES):
        existing = count_existing(cls_name)
        remaining = IMAGES_PER_CLASS - existing
        if remaining <= 0:
            print(f"[{cls_idx+1}/{len(CLASSES)}] {cls_name}: COMPLETA ({existing})")
            continue

        print(f"\n[{cls_idx+1}/{len(CLASSES)}] Letra: {cls_name} ({existing}/{IMAGES_PER_CLASS})")
        csv_path = os.path.join(DATA_DIR, cls_name, "landmarks.csv")
        write_header = not os.path.exists(csv_path) or existing == 0

        while True:
            ret, frame = cap.read()
            if not ret:
                break
            frame = cv2.flip(frame, 1)
            frame = cv2.resize(frame, (480, 360))
            h, w = frame.shape[:2]
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            mp_img = MPImage(image_format=ImageFormat.SRGB, data=np.ascontiguousarray(rgb))
            result = landmarker.detect(mp_img)

            has_hand = len(result.hand_landmarks) > 0
            if has_hand:
                draw_vr_skeleton(frame, result.hand_landmarks[0], w, h)

            color = (0, 255, 0) if has_hand else (0, 0, 255)
            cv2.putText(frame, f"Mano: {'SI' if has_hand else 'NO'}", (10, 25),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.5, color, 1)
            cv2.putText(frame, f"Letra: {cls_name} ({existing}/{IMAGES_PER_CLASS})", (10, 50),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 255, 0), 1)
            cv2.putText(frame, "ESPACIO=capturar  N=sig  ESC=salir", (10, h - 10),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.35, (200, 200, 200), 1)
            cv2.imshow("INCLU", frame)

            key = cv2.waitKey(30) & 0xFF
            if key == 27:
                cap.release()
                cv2.destroyAllWindows()
                return
            elif key == ord("n"):
                break
            elif key == 32:
                if not has_hand:
                    print("  No se detecto mano.")
                    continue

                is_motion = cls_name in MOTION_LETTERS
                phases = MOTION_LETTERS.get(cls_name, 1)
                per_phase = remaining // phases if is_motion else remaining

                for phase_idx in range(phases):
                    phase_label = PHASE_LABELS[phase_idx] if is_motion else ""
                    phase_msg = f" ({phase_label})" if is_motion else ""

                    print(f"  Preparando... mantenga '{cls_name}'{phase_msg}")
                    for cd in range(3, 0, -1):
                        ret, frame = cap.read()
                        if not ret: break
                        frame = cv2.flip(frame, 1)
                        frame = cv2.resize(frame, (480, 360))
                        txt = f"Captura {phase_msg} en {cd}..."
                        cv2.putText(frame, txt, (10, 25),
                                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
                        cv2.imshow("INCLU", frame)
                        cv2.waitKey(1000)

                    captured = 0
                    while captured < per_phase:
                        ret, frame = cap.read()
                        if not ret: break
                        frame = cv2.flip(frame, 1)
                        frame = cv2.resize(frame, (480, 360))
                        h, w = frame.shape[:2]
                        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                        mp_img = MPImage(image_format=ImageFormat.SRGB, data=np.ascontiguousarray(rgb))
                        result = landmarker.detect(mp_img)

                        if result.hand_landmarks:
                            draw_vr_skeleton(frame, result.hand_landmarks[0], w, h)
                            features = extract_features(result.hand_landmarks[0])
                            with open(csv_path, "a", newline="") as f:
                                writer = csv.writer(f)
                                if write_header:
                                    header = []
                                    for i in range(21):
                                        header.extend([f"x{i}", f"y{i}", f"z{i}"])
                                    header.extend([f"angle{i}" for i in range(5)])
                                    header.extend([f"dist{i}{j}" for i in range(5) for j in range(i+1, 5)])
                                    header.append("label")
                                    writer.writerow(header)
                                    write_header = False
                                writer.writerow(features + [cls_name])
                            captured += 1
                            print(f"  Fase {phase_idx+1}: {captured}/{per_phase}", end="\r")

                        cv2.putText(frame, f"Fase {phase_idx+1}/{phases} ({phase_label})", (10, 25),
                                    cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
                        cv2.imshow("INCLU", frame)
                        cv2.waitKey(30)
                        if cv2.waitKey(1) & 0xFF == 27:
                            break

                existing = count_existing(cls_name)
                print(f"\n  Total: {existing}/{IMAGES_PER_CLASS}")
                break

    cap.release()
    cv2.destroyAllWindows()
    print("\n" + "=" * 50)
    print("  Captura completada!")
    print("=" * 50)


if __name__ == "__main__":
    main()
