package com.inclu.speech

import android.content.Context
import android.os.Build
import android.speech.tts.TextToSpeech
import android.speech.tts.UtteranceProgressListener
import java.util.Locale

class TTSManager(context: Context) {
    private var tts: TextToSpeech? = null
    private var initialized = false
    private val appContext = context.applicationContext

    fun initialize() {
        try {
            tts = TextToSpeech(appContext) { status ->
                if (status == TextToSpeech.SUCCESS) {
                    val result = tts?.setLanguage(Locale.getDefault())
                    if (result == TextToSpeech.LANG_MISSING_DATA || result == TextToSpeech.LANG_NOT_SUPPORTED) {
                        initialized = false
                    } else {
                        initialized = true
                        tts?.setSpeechRate(0.9f)
                        tts?.setPitch(1.0f)
                        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                            tts?.setOnUtteranceProgressListener(object : UtteranceProgressListener() {
                                override fun onStart(utteranceId: String?) {}
                                override fun onDone(utteranceId: String?) {
                                    synchronized(this) {
                                        initialized = false
                                    }
                                }
                                override fun onError(utteranceId: String?) {}
                            })
                        }
                    }
                }
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    fun speak(text: String) {
        if (initialized) {
            try {
                val params = android.os.Bundle()
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                    tts?.speak(text, TextToSpeech.QUEUE_FLUSH, params, "inclus_speak")
                } else {
                    tts?.speak(text, TextToSpeech.QUEUE_FLUSH, null)
                }
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }

    fun stop() {
        try {
            tts?.stop()
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    fun isInitialized(): Boolean = initialized

    fun shutdown() {
        tts?.shutdown()
    }
}