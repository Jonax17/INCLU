# INCLU — Tecnología que incluye

> **Ecosistema completo de inclusión y accesibilidad.** Aplicación Android nativa + PWA web + Asistente IA accesible para personas con discapacidad visual, auditiva, sordociega y motora.

---

## 🌍 Ecosistema INCLU

INCLU es más que una aplicación: es un **ecosistema integrado** para la inclusión digital.

| Proyecto | Descripción | Tecnología | Estado |
|----------|-------------|-----------|--------|
| **[INCLU (Principal)](https://github.com/Jonax17/INCLU)** | App Android + PWA web con 6 módulos accesibles | Kotlin, Android, React, Vite | ✅ Funcional |
| **[INCLU Landing](https://github.com/Jonax17/inclu-landing)** | Página web de presentación y marketing | React, Next.js | 🔄 En desarrollo |

---

## 📱 ¿Qué es INCLU?

**INCLU** es una aplicación Android pensada para que personas con distintos tipos de discapacidad puedan interactuar con su entorno mediante herramientas accesibles reunidas en un único panel. Combina:

- 📷 **Cámara** — Lectura de texto e imagen
- 🎙️ **Voz** — Reconocimiento y síntesis de audio
- 📳 **Vibración** — Lenguaje háptico para comunicación
- 🔵 **Bluetooth Low Energy** — Conexión con wearables
- 🏷️ **NFC** — Navegación interior con etiquetas
- 🗺️ **GPS** — Mapas de lugares accesibles

Todo funciona **en el dispositivo, sin servidores externos**: los datos quedan almacenados localmente (Room + preferencias).

---

## ✨ Características principales

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

## 🏗️ Estructura del Proyecto

```
INCLU/
├── app/                          # Aplicación Android (Kotlin + Jetpack Compose)
│   ├── src/main/java/com/inclu/
│   │   ├── data/                 # Room DB, Repositorios
│   │   ├── ui/                   # Pantallas, Temas, Navegación
│   │   ├── speech/               # TTSManager, SpeechRecognizer
│   │   ├── bluetooth/            # BleManager, BLE Scanning
│   │   ├── haptic/               # HapticManager (vibraciones)
│   │   ├── location/             # LocationManager (Play Services)
│   │   ├── nfc/                  # NfcManager
│   │   └── utils/                # Helpers
│   └── build.gradle.kts
│
├── web/                          # PWA Web + Landing (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Landing.jsx       # Página de inicio
│   │   │   └── AppDemo.jsx       # Demo interactiva
│   │   ├── screens/              # 6 módulos (Ver, Escuchar, Sentir, etc.)
│   │   └── App.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── groq-accessible-ai/           # Asistente IA accesible (alternativa web)
│   ├── index.html
│   ├── styles.css
│   └── script.js
│
└── README.md                      # Este archivo
```

---

## 🏛️ Arquitectura

### Patrón: MVVM (Model-View-ViewModel)

```
┌─────────────────────────────────────┐
│  UI Layer (Jetpack Compose + M3)    │
├─────────────────────────────────────┤
│  ViewModel (State Management)       │
├─────────────────────────────────────┤
│  Repository Pattern (Data Access)   │
├─────────────────────────────────────┤
│  Local Storage (Room + Preferences) │
└─────────────────────────────────────┘
```

### Stack Tecnológico

| Área | Tecnología |
|------|-----------|
| **Lenguaje** | Kotlin 1.9.22 |
| **UI (Mobile)** | Jetpack Compose (BOM 2024.02.00), Material 3, Navigation Compose |
| **UI (Web)** | React 19, Vite 5, VitePWA |
| **Persistencia** | Room 2.6.1, SharedPreferences, localStorage |
| **Cámara / ML** | CameraX 1.3.1, ML Kit (OCR) |
| **Voz** | TextToSpeech, SpeechRecognizer, Whisper API |
| **Háptica** | Vibrator, VibrationEffect |
| **Conectividad** | Bluetooth LE, NFC, Web APIs |
| **Ubicación** | Play Services Location, GPS |
| **Build** | Android Gradle Plugin 8.5.2, Gradle 8.9 |
| **IA** | Groq API (Chat, Whisper STT, Orpheus TTS) |

---

## 🚀 Guía de Desarrollo

### Requisitos

- **Android Studio:** Hedgehog o superior
- **Gradle:** 8.9+
- **Java:** 17
- **compileSdk / targetSdk:** 35 | **minSdk:** 26
- **Node.js:** 18+ (para la parte web)

### Compilar la App Android

```bash
# Clonar repositorio
git clone https://github.com/Jonax17/INCLU.git
cd INCLU

# Build de depuración
./gradlew assembleDebug
# APK en: app/build/outputs/apk/debug/app-debug.apk

# Build de release (requiere keystore)
./gradlew assembleRelease
```

O simplemente abre el proyecto en **Android Studio** y pulsa **Run**.

### Instalar el APK

```bash
# Desde Releases
adb install app-debug.apk

# O transfiere manualmente al teléfono
# y abre (requiere "Instalar desde orígenes desconocidos")
```

### Desarrollar la PWA Web

```bash
cd web

# Instalar dependencias
npm install

# Servidor de desarrollo (http://localhost:5173)
npm run dev

# Build de producción (genera dist/)
npm run build

# Preview del build
npm run preview
```

**Archivos principales para editar:**
- `src/components/Landing.jsx` — Página de presentación
- `src/components/AppDemo.jsx` — Simulación interactiva
- `src/screens/` — Cada uno de los 6 módulos

---

## 🔐 Permisos Utilizados

| Permiso | Motivo |
|---------|--------|
| Cámara | Lector de texto, Lupa, Escáner de documentos |
| Micrófono / Audio | Reconocimiento y síntesis de voz |
| Ubicación (GPS + BLE) | Navegación exterior e interior |
| Bluetooth | Conexión con wearables (banda, bastón, guante) |
| NFC | Lectura de etiquetas para navegación |
| Vibración | Lenguaje háptico |
| Notificaciones | Alertas y recordatorios |
| Internet | APIs en línea (cuando esté disponible) |

---

## 📊 Estado del Proyecto

| Componente | Estado | Detalles |
|-----------|--------|---------|
| **Compilación** | ✅ Funcional | Compila sin errores en Android Studio |
| **App Android** | ✅ Operativa | Interfaz, almacenamiento local, voz |
| **PWA Web** | ✅ Operativa | Demo interactiva, offline-ready |
| **Cámara + ML Kit** | 🔄 Andamiaje | Listo, se conectará a hardware real |
| **BLE + NFC** | 🔄 Andamiaje | Preparado para dispositivos compatibles |
| **TTS + STT** | ✅ Operativo | Ya funciona con dispositivos |
| **BD Local** | ✅ Operativa | Room + SharedPreferences listos |
| **Asistente IA** | ✅ Operativo | Groq API integrada |

---

## 🌐 PWA y Web (`web/`)

INCLU no solo es una app Android; también incluye una **Progressive Web App** que funciona en navegadores y **offline**.

### Características Web

- ✅ Responsive (móvil, tablet, desktop)
- ✅ Funciona sin conexión (service worker)
- ✅ Installable como app en el home screen
- ✅ Demo interactiva de los 6 módulos
- ✅ 100% accesible (navegación por teclado)

### AI Assistant (`groq-accessible-ai/`)

Dentro del proyecto encontrarás también un **asistente de IA dedicado** con:

- 🤖 Chat con OpenAI (Groq)
- 🎤 Reconocimiento de voz (Whisper)
- 🔊 Síntesis de voz (Orpheus)
- 🖼️ Descripción de imágenes
- 🌍 Multiidioma (ES, EN, PT)
- 🔒 Offline con respuestas predefinidas
- 📚 Historial persistente
- ♿ Accesibilidad WCAG 2.1 AA

---

## 💡 Cómo Contribuir

1. **Fork** este repositorio
2. **Crea una rama** para tu feature: `git checkout -b feature/tu-mejora`
3. **Commita cambios:** `git commit -m "Agrega tu mejora"`
4. **Push** a tu fork: `git push origin feature/tu-mejora`
5. **Abre un Pull Request**

### Áreas de Contribución

- ✨ Mejoras de accesibilidad
- 🐛 Reportar y arreglar bugs
- 📖 Documentación y tutoriales
- 🎨 Diseño y UX
- 🔧 Optimizaciones de rendimiento
- 🌐 Internacionalización (más idiomas)

---

## 📜 Licencia

Este proyecto se distribuye bajo la licencia indicada en el archivo `LICENSE` (MIT License).

---

## 👋 Créditos

Desarrollado con ❤️ para la inclusión digital.

**Jonax17** — Developer & Creator

---

## 📞 Contacto & Soporte

- 🐛 **Issues:** Reporta bugs en [GitHub Issues](https://github.com/Jonax17/INCLU/issues)
- 💬 **Discussions:** Abre un debate en [GitHub Discussions](https://github.com/Jonax17/INCLU/discussions)
- 🌍 **Web:** Próximamente en [INCLU Landing](https://github.com/Jonax17/inclu-landing)

---

**Última actualización:** 29 de agosto de 2026 ✨
