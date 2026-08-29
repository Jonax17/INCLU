package com.inclu.speech

import android.content.Context
import android.os.Build
import android.speech.tts.TextToSpeech
import java.util.Locale

class TTSManager(context: Context) {
    private var tts: TextToSpeech? = null
    private var ready = false
    private val appContext = context.applicationContext

    fun initialize() {
        if (tts != null) return
        try {
            tts = TextToSpeech(appContext) { status ->
                if (status == TextToSpeech.SUCCESS) {
                    val preferred = listOf(Locale.getDefault(), Locale("es", "ES"), Locale.US)
                    for (loc in preferred) {
                        val res = tts?.setLanguage(loc) ?: TextToSpeech.LANG_NOT_SUPPORTED
                        if (res != TextToSpeech.LANG_MISSING_DATA && res != TextToSpeech.LANG_NOT_SUPPORTED) {
                            ready = true
                            break
                        }
                    }
                    tts?.setSpeechRate(0.9f)
                    tts?.setPitch(1.0f)
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    fun speak(text: String) {
        if (text.isBlank()) return
        if (!ready) {
            initialize()
            return
        }
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null, "inclu_speak")
            } else {
                @Suppress("DEPRECATION")
                tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null)
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    fun stop() {
        try {
            tts?.stop()
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    fun isReady(): Boolean = ready

    fun shutdown() {
        try {
            tts?.stop()
            tts?.shutdown()
        } catch (e: Exception) {
            e.printStackTrace()
        }
        tts = null
        ready = false
    }
}
