# INCLU - Reconocimiento de Lenguaje de Señas Nicaragüense

Sistema de inteligencia artificial para el reconocimiento del alfabeto manual del Lenguaje de Señas Nicaragüense (LSN).

## Requisitos

- Python 3.13
- Webcam conectada

## Instalación

```bash
cd C:\Users\nanef\INCLU
.venv\Scripts\activate
pip install tensorflow opencv-python numpy matplotlib pillow
```

## Uso

### Paso 1: Capturar datos

```bash
python capture.py
```

- Abre la cámara y muestra las letras del alfabeto (A-Ñ)
- Presiona **ESPACIO** para iniciar la captura de cada letra
- Presiona **N** para saltar una letra
- Presiona **ESC** para salir
- Se capturan 150 imágenes por letra (recorte automático del centro)

### Paso 2: Entrenar el modelo

```bash
python train.py
```

- Entrena la CNN con las imágenes capturadas
- Guarda el modelo en `model/inclu_model.keras`
- Guarda las clases en `model/classes.json`
- Genera gráficas de entrenamiento en `model/training_history.png`

### Paso 3: Reconocimiento en tiempo real

```bash
python predict.py
```

- Abre la cámara y predice la letra en tiempo real
- Muestra la letra predicha y su confianza
- Muestra las 3 letras más probables
- Suaviza predicciones para mayor estabilidad
- Presiona **ESC** para salir

## Estructura del proyecto

```
INCLU/
├── .venv/                  # Entorno virtual
├── data_handsigns/         # Imágenes capturadas (una carpeta por letra)
│   ├── A/
│   ├── B/
│   └── .../
├── model/                  # Modelo entrenado
│   ├── inclu_model.keras
│   ├── classes.json
│   └── training_history.png
├── capture.py              # Script de captura de datos
├── train.py                # Script de entrenamiento
├── predict.py              # Reconocimiento en tiempo real
└── README.md
```
