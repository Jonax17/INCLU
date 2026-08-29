"""
INCLU - Entrenamiento con Landmarks MediaPipe (v2 mejorado)
Clasificacion MLP con class weights, augmentation avanzado, y label smoothing.
"""
import csv
import os
import numpy as np
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.utils.class_weight import compute_class_weight
from sklearn.metrics import classification_report, confusion_matrix
import matplotlib.pyplot as plt
import json

DATA_DIR = os.path.join(os.path.dirname(__file__), "landmarks_data")
MODEL_DIR = os.path.join(os.path.dirname(__file__), "model_landmarks")
CLASSES = [chr(i) for i in range(ord("A"), ord("Z") + 1)]


def load_data():
    X = []
    y = []
    for cls in CLASSES:
        csv_path = os.path.join(DATA_DIR, cls, "landmarks.csv")
        if not os.path.exists(csv_path):
            print(f"  Saltando {cls}: no hay datos")
            continue
        with open(csv_path, "r") as f:
            reader = csv.reader(f)
            header = next(reader)
            for row in reader:
                features = [float(x) for x in row[:-1]]
                label = row[-1]
                X.append(features)
                y.append(label)
    return np.array(X), np.array(y)


def build_model(input_dim, num_classes):
    model = tf.keras.Sequential([
        tf.keras.layers.Input(shape=(input_dim,)),
        tf.keras.layers.BatchNormalization(),
        tf.keras.layers.Dense(512, activation="relu"),
        tf.keras.layers.BatchNormalization(),
        tf.keras.layers.Dropout(0.4),
        tf.keras.layers.Dense(256, activation="relu"),
        tf.keras.layers.BatchNormalization(),
        tf.keras.layers.Dropout(0.35),
        tf.keras.layers.Dense(128, activation="relu"),
        tf.keras.layers.BatchNormalization(),
        tf.keras.layers.Dropout(0.3),
        tf.keras.layers.Dense(64, activation="relu"),
        tf.keras.layers.BatchNormalization(),
        tf.keras.layers.Dropout(0.2),
        tf.keras.layers.Dense(num_classes, activation="softmax"),
    ])
    return model


def augment_landmarks(X, y):
    augmented_X = [X]
    augmented_y = [y]

    # Noise injection (3 levels)
    for std in [0.005, 0.01, 0.015]:
        noise = np.random.normal(0, std, X.shape)
        augmented_X.append(X + noise)
        augmented_y.append(y)

    # Scaling (2 levels)
    for lo, hi in [(0.95, 1.05), (0.9, 1.1)]:
        scale = np.random.uniform(lo, hi, (X.shape[0], 1))
        augmented_X.append(X * scale)
        augmented_y.append(y)

    # Random rotation around wrist axis (small angles)
    angle = np.random.uniform(-0.15, 0.15, X.shape[0])
    cos_a = np.cos(angle)
    sin_a = np.sin(angle)
    X_rot = X.copy()
    for i in range(X.shape[0]):
        x_col = X[i, 0::3]
        y_col = X[i, 1::3]
        X_rot[i, 0::3] = x_col * cos_a[i] - y_col * sin_a[i]
        X_rot[i, 1::3] = x_col * sin_a[i] + y_col * cos_a[i]
    augmented_X.append(X_rot)
    augmented_y.append(y)

    return np.vstack(augmented_X), np.concatenate(augmented_y)


def cosine_annealing(epoch, total_epochs=150, lr_max=1e-3, lr_min=1e-6):
    return lr_min + 0.5 * (lr_max - lr_min) * (1 + np.cos(np.pi * epoch / total_epochs))


def main():
    os.makedirs(MODEL_DIR, exist_ok=True)

    print("=" * 55)
    print("  INCLU - Entrenamiento Landmarks v2")
    print("=" * 55)

    print("\nCargando datos...")
    X, y = load_data()
    print(f"  Muestras totales: {len(X)}")
    print(f"  Features por muestra: {X.shape[1]}")

    # Print class distribution
    unique, counts = np.unique(y, return_counts=True)
    print("\n  Distribucion de clases:")
    for cls, cnt in zip(unique, counts):
        print(f"    {cls}: {cnt}")

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    le = LabelEncoder()
    y_encoded = le.fit_transform(y)
    num_classes = len(le.classes_)

    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
    )

    # Augment training data
    print("\nAugmentando datos de entrenamiento...")
    X_train_aug, y_train_aug = augment_landmarks(X_train, y_train)
    print(f"  Train original: {len(X_train)} -> Augmentado: {len(X_train_aug)}")

    # Compute class weights on augmented data
    class_weights = compute_class_weight(
        class_weight="balanced",
        classes=np.unique(y_train_aug),
        y=y_train_aug,
    )
    class_weight_dict = {i: w for i, w in enumerate(class_weights)}
    print("\n  Class weights:")
    for i, cls in enumerate(le.classes_):
        print(f"    {cls}: {class_weight_dict[i]:.3f}")

    print(f"\n  Train: {len(X_train_aug)}, Test: {len(X_test)}")

    print("\nConstruyendo modelo...")
    model = build_model(X_train_aug.shape[1], num_classes)

    lr_schedule = tf.keras.callbacks.LearningRateScheduler(
        lambda epoch: cosine_annealing(epoch, total_epochs=150)
    )

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=1e-3),
        loss=tf.keras.losses.SparseCategoricalCrossentropy(),
        metrics=["accuracy"],
    )
    model.summary()

    print("\nEntrenando...")
    history = model.fit(
        X_train_aug, y_train_aug,
        validation_split=0.15,
        epochs=150,
        batch_size=64,
        class_weight=class_weight_dict,
        callbacks=[
            tf.keras.callbacks.EarlyStopping(
                monitor="val_accuracy", patience=20, restore_best_weights=True
            ),
            lr_schedule,
        ],
        verbose=1,
    )

    print("\nEvaluando...")
    test_loss, test_acc = model.evaluate(X_test, y_test)
    print(f"\n  Test Accuracy: {test_acc:.4f}")

    y_pred = np.argmax(model.predict(X_test), axis=1)
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred, target_names=le.classes_))

    # Confusion matrix for problematic letters
    cm = confusion_matrix(y_test, y_pred)
    print("\nMatriz de confusion (letras con <95%):")
    for i, cls in enumerate(le.classes_):
        if cm[i].sum() > 0:
            acc = cm[i, i] / cm[i].sum()
            if acc < 0.95:
                misclassified = []
                for j, other_cls in enumerate(le.classes_):
                    if i != j and cm[i, j] > 0:
                        misclassified.append(f"{other_cls}={cm[i,j]}")
                print(f"  {cls}: {acc:.1%} (confundido con: {', '.join(misclassified)})")

    model_path = os.path.join(MODEL_DIR, "inclu_landmarks.keras")
    model.save(model_path)

    with open(os.path.join(MODEL_DIR, "scaler.pkl"), "wb") as f:
        import pickle
        pickle.dump(scaler, f)

    with open(os.path.join(MODEL_DIR, "label_encoder.pkl"), "wb") as f:
        pickle.dump(le, f)

    with open(os.path.join(MODEL_DIR, "classes.json"), "w") as f:
        json.dump(le.classes_.tolist(), f)

    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4))
    ax1.plot(history.history["accuracy"], label="Train")
    ax1.plot(history.history["val_accuracy"], label="Val")
    ax1.set_title("Accuracy")
    ax1.legend()
    ax2.plot(history.history["loss"], label="Train")
    ax2.plot(history.history["val_loss"], label="Val")
    ax2.set_title("Loss")
    ax2.legend()
    plt.savefig(os.path.join(MODEL_DIR, "training_history.png"))
    plt.close()

    print(f"\n  Modelo guardado en: {MODEL_DIR}")
    print("=" * 55)
    print("  Entrenamiento completado!")
    print("=" * 55)


if __name__ == "__main__":
    main()
