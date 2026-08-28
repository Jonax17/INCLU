# INCLU — Tecnología que incluye

> Aplicación Android de inclusión y accesibilidad para personas con discapacidad visual, auditiva, sordociega y motora.

---

## ¿Qué es INCLU?

**INCLU** es una aplicación Android pensada para que personas con distintos tipos de
discapacidad puedan interactuar con su entorno mediante herramientas accesibles
reunidas en un único panel. Combina cámara, voz, vibración (un **lenguaje háptico**),
Bluetooth Low Energy, NFC y navegación para ofrecer una experiencia verdaderamente
inclusiva.

Todo funciona **en el dispositivo, sin servidores externos**: los datos quedan
almacenados localmente (Room + preferencias).

---

## Características principales

| Módulo | Dirigido a | Qué hace |
|--------|-----------|----------|
| **Ver** | Personas ciegas / baja visión | Lector de texto (cámara + voz), Lupa inteligente y Escáner de documentos. |
| **Escuchar** | Personas sordas | Reconocimiento de voz a texto y lectura por voz (TTS). |
| **Sentir** | Comunicación háptica | Lenguaje de vibraciones con significado: Izquierda, Derecha, Peligro, Detener, Destino y Ayuda. Incluye *Laboratorio Háptico* y *Modo Táctil*. |
| **Orientarme** | Movilidad | Mapa de lugares accesibles, navegación interior (QR/NFC) y exterior (GPS). |
| **Emergencia** | Todos | Alerta SOS con vibración y ubicación. |
| **Accesibilidad** | Personalización | Ajustes de visión, audición, háptica y motora. |
| **Dispositivos** | Wearables | Conexión con INCLU Band, INCLU Cane e INCLU Glove vía BLE. |
| **Demo** | Difusión | Presentación rápida de todas las funciones. |

---

## Arquitectura

- **Patrón:** MVVM (Model-View-ViewModel).
- **UI:** Jetpack Compose + Material 3, con Navigation Compose.
- **Datos:** Room (`UserProfile`, `AccessiblePlace`, `BleDevice`) accedidos mediante
  repositorios y un `DatabaseProvider` singleton. Preferencias con
  `SharedPreferences`/`DataStore`.
- **Local-first:** sin backend; toda la lógica y el almacenamiento son locales.

```
app/src/main/java/com/inclu/
├── data/      model · db (Room) · repository
├── ui/        screens · theme · navigation · viewmodels
├── speech/    TTSManager · SpeechRecognizerManager
├── bluetooth/ BleManager · BleScanService
├── haptic/    HapticManager
├── location/  LocationManager (Play Services)
├── nfc/       NfcManager
└── utils/     Helpers (vibración, dialer, maps…)
```

---

## Tecnologías

| Área | Tecnología |
|------|-----------|
| Lenguaje | Kotlin 1.9.22 |
| UI | Jetpack Compose (BOM 2024.02.00) · Material 3 · Navigation Compose |
| Persistencia | Room 2.6.1 · Gson |
| Cámara / ML | CameraX 1.3.1 · ML Kit (reconocimiento de texto) |
| Voz | `TextToSpeech` · `SpeechRecognizer` |
| Háptica | `Vibrator` / `VibrationEffect` |
| Conectividad | Bluetooth LE · NFC |
| Ubicación | Play Services Location |
| Build | Android Gradle Plugin 8.5.2 · Gradle 8.9 |

---

## Requisitos para compilar

- **compileSdk / targetSdk:** 35 · **minSdk:** 26
- **Java:** 17
- **Android SDK** con plataforma 35 y build-tools instalados
- Android Studio Hedgehog (o superior) o Gradle 8.9

### Cómo compilar

```bash
git clone https://github.com/Jonax17/INCLU.git
cd INCLU
./gradlew assembleDebug
# El APK queda en app/build/outputs/apk/debug/app-debug.apk
```

O bien ábrelo en Android Studio y pulsa **Run**.

---

## Cómo instalar la APK

Descarga **`app-debug.apk`** desde la sección **Releases** de este repositorio y:

```bash
adb install app-debug.apk
```

O transfiere el archivo al teléfono y ábrelo (activa *"Instalar desde orígenes
desconocidos"*).

> ⚠️ El APK publicado es una **build de depuración** (no firmada para producción).
> Para una versión de lanzamiento, genera un keystore y usa `assembleRelease`.

---

## Permisos utilizados

Cámara · Micrófono/Audio · Ubicación (GPS y BLE) · Bluetooth · NFC · Vibración ·
Notificaciones · Internet.

---

## Estado del proyecto

La aplicación **compila y es funcional**. Algunas integraciones (CameraX/ML Kit,
BLE y NFC) están preparadas como andamiaje y se conectarán a hardware real en
dispositivos compatibles. El lenguaje háptico, la voz (TTS), el reconocimiento de
voz y la base de datos local ya están operativos.

---

## Licencia

Este proyecto se distribuye bajo la licencia indicada en el archivo `LICENSE`.
