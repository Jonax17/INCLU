"""
INCLU Writer - Interfaz rediseñada con identidad visual InCLU
Basada en el logo oficial: Azul #2864E8, Verde #12B886, #101828
"""
import cv2
import math
import sys
import os
import time
import pickle
import numpy as np
import tensorflow as tf
from collections import deque, Counter
from mediapipe.tasks.python import BaseOptions
from mediapipe.tasks.python.vision import HandLandmarker, HandLandmarkerOptions
from mediapipe.tasks.python.vision.core.image import Image as MPImage, ImageFormat
from text_predictor import TextPredictor

MODEL_DIR = os.path.join(os.path.dirname(__file__), "model_landmarks")

HAND_CONNECTIONS = [
    (0,1),(1,2),(2,3),(3,4),
    (0,5),(5,6),(6,7),(7,8),
    (5,9),(9,10),(10,11),(11,12),
    (9,13),(13,14),(14,15),(15,16),
    (13,17),(17,18),(18,19),(19,20),
    (0,17),
]
COLORS_SKELETON = {
    "wrist": (180,180,180), "thumb": (232, 100, 40),
    "index": (134, 184, 18), "middle": (40, 100, 232),
    "ring": (180, 128, 18), "pinky": (18, 184, 134),
}
FINGER_GROUPS = {
    "wrist": [0], "thumb": [1,2,3,4], "index": [5,6,7,8],
    "middle": [9,10,11,12], "ring": [13,14,15,16], "pinky": [17,18,19,20],
}

BLUE = (232, 100, 40)
GREEN = (134, 184, 18)
DARK = (40, 24, 16)
WHITE = (255, 255, 255)
LIGHT_BG = (250, 247, 245)
LIGHT_GRAY = (235, 240, 245)
MED_GRAY = (180, 185, 195)
DARK_TEXT = (24, 24, 40)
SUBTLE = (140, 145, 160)
ACCENT_LIGHT = (240, 245, 255)
SUCCESS_BG = (232, 250, 240)
SUCCESS_TEXT = (18, 130, 72)
BLUE_HOVER = (210, 85, 30)
SHADOW = (220, 220, 225)


class Button:
    def __init__(self, x, y, w, h, text, icon, color=BLUE, action=None, style="primary"):
        self.x = x
        self.y = y
        self.w = w
        self.h = h
        self.text = text
        self.icon = icon
        self.color = color
        self.action = action
        self.style = style
        self.hover = False
        self.press_anim = 0

    def contains(self, mx, my):
        return self.x <= mx <= self.x + self.w and self.y <= my <= self.y + self.h

    def draw(self, canvas):
        if self.press_anim > 0:
            self.press_anim = max(0, self.press_anim - 0.1)

        if self.style == "primary":
            bg = tuple(max(0, c - 20) for c in self.color) if self.hover else self.color
            text_c = WHITE
            border_c = bg
        elif self.style == "secondary":
            bg = WHITE
            text_c = self.color
            border_c = self.color if self.hover else LIGHT_GRAY
        elif self.style == "success":
            bg = tuple(max(0, c - 15) for c in self.color) if self.hover else self.color
            text_c = WHITE
            border_c = bg
        else:
            bg = LIGHT_GRAY
            text_c = DARK_TEXT
            border_c = LIGHT_GRAY

        draw_shadow(canvas, self.x, self.y, self.w, self.h, 8)
        draw_rounded_rect(canvas, self.x, self.y, self.w, self.h, bg, radius=10)
        draw_rounded_rect(canvas, self.x, self.y, self.w, self.h, border_c, radius=10, thickness=2)

        if self.press_anim > 0:
            overlay = canvas.copy()
            draw_rounded_rect(overlay, self.x, self.y, self.w, self.h, WHITE, radius=10)
            cv2.addWeighted(overlay, self.press_anim * 0.4, canvas, 1 - self.press_anim * 0.4, 0, canvas)

        icon_x = self.x + 14
        icon_y = self.y + self.h // 2 + 6
        cv2.putText(canvas, self.icon, (icon_x, icon_y), cv2.FONT_HERSHEY_SIMPLEX, 0.5, text_c, 2, cv2.LINE_AA)

        (tw, _), _ = cv2.getTextSize(self.text, cv2.FONT_HERSHEY_SIMPLEX, 0.42, 1)
        tx = self.x + 35 + (self.w - 35 - tw) // 2
        ty = self.y + self.h // 2 + 6
        cv2.putText(canvas, self.text, (tx, ty), cv2.FONT_HERSHEY_SIMPLEX, 0.42, text_c, 1, cv2.LINE_AA)


class LetterBuffer:
    def __init__(self):
        self.current_word = []
        self.words = []
        self.prediction_history = deque(maxlen=10)
        self.last_letter = ""
        self.letter_stable_count = 0
        self.STABLE_THRESHOLD = 9
        self.last_add_time = 0
        self.add_cooldown = 1.0
        self.hand_absent_start = None
        self.auto_space_triggered = False
        self.AUTO_SPACE_DELAY = 2.0
        self.hand_appear_time = 0
        self.HAND_APPEAR_COOLDOWN = 1.5
        self.hand_just_appeared = False
        self.confidence_history = deque(maxlen=12)
        self.flash_effect = 0
        self.last_added_letter = ""
        self.last_add_timestamp = 0
        self.last_added_letter_time = 0
        self.SAME_LETTER_COOLDOWN = 2.5
        self.current_prediction = ""
        self.confidence = 0.0
        self.top3 = []
        self.predictor = TextPredictor()
        self.word_suggestions = []
        self.next_word_predictions = []
        self.selected_suggestion = -1

    def update(self, letter, conf, hand_present, top3):
        now = time.time()
        self.current_prediction = letter
        self.confidence = conf
        self.top3 = top3

        if hand_present:
            if self.hand_absent_start is not None:
                self.hand_appear_time = now
                self.hand_just_appeared = True
            self.hand_absent_start = None
            self.auto_space_triggered = False
        else:
            if self.hand_absent_start is None:
                self.hand_absent_start = now
                self.hand_just_appeared = False
            if now - self.hand_absent_start > self.AUTO_SPACE_DELAY and not self.auto_space_triggered and self.current_word:
                self.add_space()
                self.auto_space_triggered = True

        if hand_present and self.hand_just_appeared:
            if now - self.hand_appear_time < self.HAND_APPEAR_COOLDOWN:
                return
            else:
                self.hand_just_appeared = False

        if letter and conf > 0.65:
            self.confidence_history.append(conf)
            all_100 = len(self.confidence_history) >= 6 and all(c >= 0.92 for c in list(self.confidence_history)[-6:])
            self.prediction_history.append(letter)
            if len(self.prediction_history) >= 5:
                stable_letter = Counter(self.prediction_history).most_common(1)[0][0]
                if stable_letter == self.last_letter:
                    self.letter_stable_count += 1
                else:
                    self.last_letter = stable_letter
                    self.letter_stable_count = 1

                if self.letter_stable_count >= self.STABLE_THRESHOLD and now - self.last_add_time > self.add_cooldown and all_100:
                    if stable_letter == self.last_added_letter and now - self.last_added_letter_time < self.SAME_LETTER_COOLDOWN:
                        pass
                    else:
                        self.add_letter(stable_letter)
                        self.prediction_history.clear()
                        self.confidence_history.clear()
                        self.letter_stable_count = 0
                        self.last_letter = ""
                        self.last_add_time = now

    def add_letter(self, letter):
        self.current_word.append(letter)
        self.flash_effect = 1.0
        self.last_added_letter = letter
        self.last_add_timestamp = time.time()
        self.last_added_letter_time = time.time()
        partial = "".join(self.current_word)
        self.word_suggestions = self.predictor.complete_word(partial)

    def add_space(self):
        if self.current_word:
            self.words.append("".join(self.current_word))
            self.current_word = []
            self.word_suggestions = []
            self.update_next_predictions()

    def update_next_predictions(self):
        text = " ".join(self.words)
        self.next_word_predictions = self.predictor.get_context_predictions(text, 5)

    def accept_suggestion(self, index):
        suggestions = self.word_suggestions if self.word_suggestions else self.next_word_predictions
        if 0 <= index < len(suggestions):
            word = suggestions[index]
            if self.current_word:
                self.current_word = list(word)
                self.add_space()
            else:
                self.words.append(word)
                self.update_next_predictions()
            self.word_suggestions = []
            return True
        return False

    def clear(self):
        self.current_word = []
        self.words = []
        self.prediction_history.clear()
        self.confidence_history.clear()
        self.last_letter = ""
        self.letter_stable_count = 0
        self.word_suggestions = []
        self.next_word_predictions = []

    def backspace(self):
        if self.current_word:
            self.current_word.pop()
            partial = "".join(self.current_word)
            self.word_suggestions = self.predictor.complete_word(partial) if partial else []
        elif self.words:
            self.current_word = list(self.words.pop())

    def get_text(self):
        return " ".join(self.words) + ("".join(self.current_word) if self.current_word else "")

    def get_word_preview(self):
        return "".join(self.current_word)

    def get_word_count(self):
        return len(self.words) + (1 if self.current_word else 0)

    def get_char_count(self):
        return len(self.get_text())


def create_landmarker():
    model_path = os.path.join(MODEL_DIR, "hand_landmarker.task")
    options = HandLandmarkerOptions(
        base_options=BaseOptions(model_asset_path=model_path),
        num_hands=1,
        min_hand_detection_confidence=0.3,
        min_hand_presence_confidence=0.3,
        min_tracking_confidence=0.3,
    )
    return HandLandmarker.create_from_options(options)


def load_classifier():
    model = tf.keras.models.load_model(os.path.join(MODEL_DIR, "inclu_landmarks.keras"))
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
        for j in range(i+1, len(finger_tips)):
            lm1, lm2 = hand_landmarks[finger_tips[i]], hand_landmarks[finger_tips[j]]
            features.append(math.sqrt((lm1.x - lm2.x)**2 + (lm1.y - lm2.y)**2))
    return features


def draw_vr_skeleton(frame, hand_landmarks, w, h):
    overlay = frame.copy()
    for start_idx, end_idx in HAND_CONNECTIONS:
        lm1, lm2 = hand_landmarks[start_idx], hand_landmarks[end_idx]
        x1, y1 = int(lm1.x * w), int(lm1.y * h)
        x2, y2 = int(lm2.x * w), int(lm2.y * h)
        color = (160, 160, 165)
        for finger, indices in FINGER_GROUPS.items():
            if start_idx in indices or end_idx in indices:
                color = COLORS_SKELETON[finger]
                break
        cv2.line(overlay, (x1, y1), (x2, y2), color, 2)
    for i, lm in enumerate(hand_landmarks):
        x, y = int(lm.x * w), int(lm.y * h)
        color = (160, 160, 165)
        for finger, indices in FINGER_GROUPS.items():
            if i in indices:
                color = COLORS_SKELETON[finger]
                break
        r = 3 if i not in [4,8,12,16,20] else 5
        cv2.circle(overlay, (x, y), r, color, -1)
    cv2.addWeighted(overlay, 0.5, frame, 0.5, 0, frame)


def draw_shadow(canvas, x, y, w, h, blur=10):
    overlay = canvas.copy()
    for i in range(blur):
        alpha = 0.02 * (blur - i)
        cv2.rectangle(overlay, (x + i, y + i), (x + w - i, y + h - i), SHADOW, -1)
    cv2.addWeighted(overlay, 0.3, canvas, 0.7, 0, canvas)


def draw_rounded_rect(frame, x, y, w, h, color, radius=10, thickness=-1):
    if thickness == -1:
        cv2.rectangle(frame, (x+radius, y), (x+w-radius, y+h), color, -1)
        cv2.rectangle(frame, (x, y+radius), (x+w, y+h-radius), color, -1)
        cv2.circle(frame, (x+radius, y+radius), radius, color, -1)
        cv2.circle(frame, (x+w-radius, y+radius), radius, color, -1)
        cv2.circle(frame, (x+radius, y+h-radius), radius, color, -1)
        cv2.circle(frame, (x+w-radius, y+h-radius), radius, color, -1)
    else:
        cv2.ellipse(frame, (x+radius, y+radius), (radius, radius), 180, 0, 90, color, thickness)
        cv2.ellipse(frame, (x+w-radius, y+radius), (radius, radius), 270, 0, 90, color, thickness)
        cv2.ellipse(frame, (x+radius, y+h-radius), (radius, radius), 90, 0, 90, color, thickness)
        cv2.ellipse(frame, (x+w-radius, y+h-radius), (radius, radius), 0, 0, 90, color, thickness)
        cv2.line(frame, (x+radius, y), (x+w-radius, y), color, thickness)
        cv2.line(frame, (x+radius, y+h), (x+w-radius, y+h), color, thickness)
        cv2.line(frame, (x, y+radius), (x, y+h-radius), color, thickness)
        cv2.line(frame, (x+w, y+radius), (x+w, y+h-radius), color, thickness)


def draw_text(frame, text, pos, scale, color, thickness=1):
    cv2.putText(frame, text, pos, cv2.FONT_HERSHEY_SIMPLEX, scale, color, thickness, cv2.LINE_AA)


def draw_logo(canvas, x, y, scale=1.0):
    blue_s = (232, 100, 40)
    green_s = (134, 184, 18)
    dark_s = (24, 24, 40)
    s = scale
    cv2.ellipse(canvas, (int(x + 12*s), int(y + 30*s)), (int(18*s), int(28*s)), 0, 0, 360, blue_s, -1)
    cv2.circle(canvas, (int(x + 48*s), int(y + 8*s)), int(8*s), green_s, -1)
    cv2.ellipse(canvas, (int(x + 48*s), int(y + 30*s)), (int(14*s), int(24*s)), 0, 0, 360, green_s, -1)
    cv2.putText(canvas, "INCLU", (int(x + 80*s), int(y + 38*s)), cv2.FONT_HERSHEY_SIMPLEX, 1.2*s, dark_s, int(3*s), cv2.LINE_AA)
    cv2.circle(canvas, (int(x + 170*s), int(y + 36*s)), int(5*s), green_s, -1)


def draw_separator(canvas, x, y, w):
    cv2.line(canvas, (x, y), (x + w, y), LIGHT_GRAY, 1)


def main():
    landmarker = create_landmarker()
    model, scaler, le = load_classifier()

    device = int(sys.argv[1]) if len(sys.argv) > 1 else 0
    cap = cv2.VideoCapture(device)
    if not cap.isOpened():
        print(f"Error: camara {device}.")
        return

    buffer = LetterBuffer()
    history = deque(maxlen=8)
    frame_count = 0
    start_time = time.time()

    WW, WH = 1400, 850
    SIDEBAR_W = 260
    CAM_W, CAM_H = 520, 390
    CAM_X = SIDEBAR_W + 30
    CAM_Y = 90
    TEXT_X = CAM_X + CAM_W + 30
    TEXT_W = WW - TEXT_X - 30
    BTN_Y = WH - 90

    buttons = [
        Button(SIDEBAR_W + 30, BTN_Y, 120, 42, "Limpiar", "X", BLUE, "clear", "primary"),
        Button(SIDEBAR_W + 160, BTN_Y, 120, 42, "Borrar", "<", BLUE, "backspace", "secondary"),
        Button(SIDEBAR_W + 290, BTN_Y, 120, 42, "Espacio", "_", GREEN, "space", "success"),
        Button(SIDEBAR_W + 420, BTN_Y, 120, 42, "Guardar", "S", GREEN, "save", "success"),
    ]

    def on_mouse(event, x, y, flags, param):
        for btn in buttons:
            btn.hover = btn.contains(x, y)
        if event == cv2.EVENT_LBUTTONDOWN:
            for btn in buttons:
                if btn.contains(x, y):
                    btn.press_anim = 1.0
                    if btn.action == "clear":
                        buffer.clear()
                    elif btn.action == "backspace":
                        buffer.backspace()
                    elif btn.action == "space":
                        buffer.add_space()
                    elif btn.action == "save":
                        text = buffer.get_text()
                        if text.strip():
                            with open("incluir_texto.txt", "w", encoding="utf-8") as f:
                                f.write(text)

    cv2.namedWindow("INCLU Writer", cv2.WINDOW_AUTOSIZE)
    cv2.setMouseCallback("INCLU Writer", on_mouse)

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        frame = cv2.flip(frame, 1)
        h, w = frame.shape[:2]
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        mp_img = MPImage(image_format=ImageFormat.SRGB, data=np.ascontiguousarray(rgb))
        result = landmarker.detect(mp_img)
        has_hand = len(result.hand_landmarks) > 0

        prediction_text = ""
        confidence = 0.0
        top3 = []

        if has_hand:
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

        smoothed = ""
        if len(history) > 2:
            smoothed = Counter(history).most_common(1)[0][0]

        buffer.update(smoothed, confidence, has_hand, top3)

        canvas = np.full((WH, WW, 3), 250, dtype=np.uint8)

        draw_rounded_rect(canvas, 0, 0, SIDEBAR_W, WH, DARK, radius=0)

        draw_logo(canvas, 30, 25, scale=0.7)

        sidebar_items = [
            ("Camara", BLUE, True),
            ("Historial", MED_GRAY, False),
            ("Configuracion", MED_GRAY, False),
            ("Ayuda", MED_GRAY, False),
        ]
        for i, (item_text, item_color, active) in enumerate(sidebar_items):
            iy = 90 + i * 50
            if active:
                draw_rounded_rect(canvas, 15, iy, SIDEBAR_W - 30, 40, (35, 30, 55), radius=8)
                draw_text(canvas, item_text, (30, iy + 26), 0.45, WHITE, 1)
            else:
                draw_text(canvas, item_text, (30, iy + 26), 0.45, (140, 135, 160), 1)

        draw_rounded_rect(canvas, CAM_X - 3, CAM_Y - 3, CAM_W + 6, CAM_H + 6, WHITE, radius=12)
        draw_rounded_rect(canvas, CAM_X - 3, CAM_Y - 3, CAM_W + 6, CAM_H + 6, LIGHT_GRAY, radius=12, thickness=1)
        cam_resized = cv2.resize(frame, (CAM_W, CAM_H))
        canvas[CAM_Y:CAM_Y+CAM_H, CAM_X:CAM_X+CAM_W] = cam_resized

        hand_y = CAM_Y + CAM_H + 12
        if has_hand:
            cv2.circle(canvas, (CAM_X + 6, hand_y + 5), 4, GREEN, -1)
            draw_text(canvas, "Mano detectada", (CAM_X + 16, hand_y + 9), 0.38, SUCCESS_TEXT, 1)
        else:
            cv2.circle(canvas, (CAM_X + 6, hand_y + 5), 4, MED_GRAY, -1)
            draw_text(canvas, "Esperando mano...", (CAM_X + 16, hand_y + 9), 0.38, SUBTLE, 1)

        draw_rounded_rect(canvas, TEXT_X - 5, 65, TEXT_W + 10, BTN_Y - 85, WHITE, radius=12)
        draw_rounded_rect(canvas, TEXT_X - 5, 65, TEXT_W + 10, BTN_Y - 85, LIGHT_GRAY, radius=12, thickness=1)

        draw_text(canvas, "ESCRITURA", (TEXT_X + 15, 95), 0.5, DARK_TEXT, 2)
        draw_separator(canvas, TEXT_X + 15, 108, TEXT_W - 20)

        if not has_hand:
            status_text = "Esperando mano"
            status_color = SUBTLE
        elif smoothed:
            status_text = smoothed
            status_color = BLUE
        else:
            status_text = "Analizando..."
            status_color = SUBTLE

        draw_rounded_rect(canvas, TEXT_X + 15, 118, 70, 35, ACCENT_LIGHT if has_hand else LIGHT_GRAY, radius=8)
        draw_text(canvas, status_text, (TEXT_X + 25, 142), 0.8, status_color, 2)

        bar_y = 165
        bar_w = int(TEXT_W * 0.4)
        draw_rounded_rect(canvas, TEXT_X + 15, bar_y, bar_w, 14, LIGHT_GRAY, radius=4)
        conf_w = max(0, int(bar_w * min(confidence, 1.0)))
        if conf_w > 0:
            cc = GREEN if confidence > 0.9 else BLUE if confidence > 0.6 else (200, 100, 100)
            draw_rounded_rect(canvas, TEXT_X + 15, bar_y, conf_w, 14, cc, radius=4)
        draw_text(canvas, f"{confidence:.0%}", (TEXT_X + bar_w + 12, bar_y + 11), 0.35, SUBTLE, 1)

        top3_y = 195
        for i, (cls, prob) in enumerate(top3):
            y = top3_y + i * 22
            if i == 0:
                draw_rounded_rect(canvas, TEXT_X + 15, y - 14, 35, 20, BLUE, radius=5)
                draw_text(canvas, cls, (TEXT_X + 22, y), 0.4, WHITE, 2)
                draw_text(canvas, f"{prob:.0%}", (TEXT_X + 58, y), 0.35, SUBTLE, 1)
            else:
                draw_text(canvas, f"{cls} {prob:.0%}", (TEXT_X + 20, y), 0.35, SUBTLE, 1)

        draw_separator(canvas, TEXT_X + 15, top3_y + 65, TEXT_W - 20)

        text_area_y = top3_y + 80
        text_area_h = BTN_Y - 85 - text_area_y

        full_text = buffer.get_text()
        current_word = buffer.get_word_preview()

        lines = []
        if full_text:
            for word in full_text.split():
                if not lines:
                    lines.append(word)
                else:
                    test = lines[-1] + " " + word
                    (tw, _), _ = cv2.getTextSize(test, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)
                    if tw > TEXT_W - 50:
                        lines.append(word)
                    else:
                        lines[-1] = test

        max_lines = text_area_h // 36
        visible = lines[-max_lines:] if len(lines) > max_lines else lines

        for i, line in enumerate(visible):
            y = text_area_y + 30 + i * 36
            is_last = (i == len(visible) - 1) and not current_word
            c = DARK_TEXT if is_last else (80, 78, 95)
            if is_last:
                draw_rounded_rect(canvas, TEXT_X + 12, y - 24, TEXT_W - 24, 32, ACCENT_LIGHT, radius=6)
            draw_text(canvas, line, (TEXT_X + 20, y), 0.6, c, 2)

        if current_word:
            y = text_area_y + 30 + len(visible) * 36
            if y < BTN_Y - 100:
                prefix = visible[-1] + " " if visible else ""
                (pw, _), _ = cv2.getTextSize(prefix, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)
                wx = TEXT_X + 20 + pw
                draw_rounded_rect(canvas, wx - 4, y - 24, TEXT_W - (wx - TEXT_X) - 10, 32, ACCENT_LIGHT, radius=6)
                draw_text(canvas, current_word, (wx, y), 0.6, BLUE, 2)
                if int(time.time() * 3) % 2 == 0:
                    (cw, _), _ = cv2.getTextSize(current_word, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2)
                    cv2.line(canvas, (wx + cw + 4, y - 16), (wx + cw + 4, y + 4), BLUE, 2)

        suggestions = buffer.word_suggestions if buffer.word_suggestions else buffer.next_word_predictions
        sug_y = BTN_Y - 55
        if suggestions:
            draw_rounded_rect(canvas, SIDEBAR_W + 20, sug_y, WW - SIDEBAR_W - 50, 40, WHITE, radius=8)
            draw_rounded_rect(canvas, SIDEBAR_W + 20, sug_y, WW - SIDEBAR_W - 50, 40, LIGHT_GRAY, radius=8, thickness=1)
            draw_text(canvas, "Sugerencias:", (SIDEBAR_W + 30, sug_y + 15), 0.32, SUBTLE, 1)
            sx = SIDEBAR_W + 140
            for i, sug in enumerate(suggestions[:5]):
                key_text = f"[{i+1}]"
                is_partial = bool(buffer.word_suggestions)
                sug_color = BLUE if is_partial else GREEN
                draw_text(canvas, key_text, (sx, sug_y + 15), 0.3, SUBTLE, 1)
                (sw, _), _ = cv2.getTextSize(key_text, cv2.FONT_HERSHEY_SIMPLEX, 0.3, 1)
                draw_text(canvas, sug, (sx + sw + 4, sug_y + 15), 0.4, sug_color, 1)
                (sw2, _), _ = cv2.getTextSize(sug, cv2.FONT_HERSHEY_SIMPLEX, 0.4, 1)
                sx += sw + sw2 + 22

        for btn in buttons:
            btn.draw(canvas)

        elapsed = time.time() - start_time
        wpm = (buffer.get_word_count() / (elapsed / 60)) if elapsed > 60 else 0
        fps = frame_count / elapsed if elapsed > 0 else 0

        draw_rounded_rect(canvas, SIDEBAR_W + 20, WH - 35, 400, 28, LIGHT_GRAY, radius=6)
        stats = f"  Palabras: {buffer.get_word_count()}   Caracteres: {buffer.get_char_count()}   WPM: {wpm:.1f}   FPS: {fps:.0f}"
        draw_text(canvas, stats, (SIDEBAR_W + 30, WH - 15), 0.35, SUBTLE, 1)

        if buffer.flash_effect > 0:
            overlay = canvas.copy()
            draw_rounded_rect(overlay, TEXT_X - 5, 65, TEXT_W + 10, BTN_Y - 85, GREEN, radius=12)
            cv2.addWeighted(overlay, buffer.flash_effect * 0.1, canvas, 1 - buffer.flash_effect * 0.1, 0, canvas)
            buffer.flash_effect = max(0, buffer.flash_effect - 0.05)

        if buffer.last_added_letter and time.time() - buffer.last_add_timestamp < 0.6:
            alpha = 1.0 - (time.time() - buffer.last_add_timestamp) / 0.6
            overlay = canvas.copy()
            lx = TEXT_X + TEXT_W // 2 - 35
            ly = text_area_y + text_area_h // 2 - 35
            draw_rounded_rect(overlay, lx, ly, 70, 70, GREEN, radius=35)
            cv2.addWeighted(overlay, alpha * 0.5, canvas, 1 - alpha * 0.5, 0, canvas)
            draw_text(canvas, buffer.last_added_letter, (lx + 22, ly + 48), 1.0, WHITE, 3)

        cv2.imshow("INCLU Writer", canvas)
        frame_count += 1

        key = cv2.waitKey(30) & 0xFF
        if key == 27:
            break
        elif key == ord("c"):
            buffer.clear()
        elif key == 127 or key == 8:
            buffer.backspace()
        elif key == 32:
            buffer.add_space()
        elif key in (ord("1"), ord("2"), ord("3"), ord("4"), ord("5")):
            idx = key - ord("1")
            buffer.accept_suggestion(idx)
        elif key == ord("s"):
            text = buffer.get_text()
            if text.strip():
                with open("incluir_texto.txt", "w", encoding="utf-8") as f:
                    f.write(text)

    cap.release()
    cv2.destroyAllWindows()


if __name__ == "__main__":
    main()
