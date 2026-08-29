package com.inclu.speech

import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Bundle
import android.speech.RecognitionListener
import android.speech.RecognizerIntent
import android.speech.SpeechRecognizer
import android.speech.SpeechRecognizer.ERROR_NO_MATCH
import android.speech.SpeechRecognizer.ERROR_SPEECH_TIMEOUT
import androidx.lifecycle.LiveData
import androidx.lifecycle.MutableLiveData
import java.util.Locale

class SpeechRecognizerManager(private val context: Context) {
    private val _recognizedText = MutableLiveData("")
    val recognizedText: LiveData<String> = _recognizedText
    private val _isListening = MutableLiveData(false)
    val isListening: LiveData<Boolean> = _isListening
    private val _error = MutableLiveData<String?>(null)
    val error: LiveData<String?> = _error

    private var speechRecognizer: SpeechRecognizer? = null
    private var language: String = "es-ES"

    fun setLanguage(locale: String) {
        language = locale
    }

    fun clearText() {
        _recognizedText.postValue("")
    }

    fun startListening() {
        try {
            if (!SpeechRecognizer.isRecognitionAvailable(context)) {
                _error.postValue("Reconocimiento de voz no disponible")
                return
            }
            stopListening()
            speechRecognizer = SpeechRecognizer.createSpeechRecognizer(context)
            speechRecognizer?.setRecognitionListener(object : RecognitionListener {
                override fun onReadyForSpeech(params: Bundle?) {
                    _isListening.postValue(true)
                    _error.postValue(null)
                }

                override fun onBeginningOfSpeech() {}
                override fun onRmsChanged(rmsdB: Float) {}
                override fun onBufferReceived(buffer: ByteArray?) {}

                override fun onEndOfSpeech() {
                    _isListening.postValue(false)
                }

                override fun onError(errorCode: Int) {
                    _isListening.postValue(false)
                    when (errorCode) {
                        ERROR_NO_MATCH -> _error.postValue("No se detecto voz")
                        ERROR_SPEECH_TIMEOUT -> _error.postValue("Tiempo de espera agotado")
                        else -> _error.postValue("Error de reconocimiento: $errorCode")
                    }
                }

                override fun onResults(results: Bundle?) {
                    val matches = results?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                    if (!matches.isNullOrEmpty()) {
                        _recognizedText.postValue(matches[0])
                    }
                    _isListening.postValue(false)
                }

                override fun onPartialResults(partialResults: Bundle?) {
                    val matches = partialResults?.getStringArrayList(SpeechRecognizer.RESULTS_RECOGNITION)
                    if (!matches.isNullOrEmpty()) {
                        _recognizedText.postValue(matches[0])
                    }
                }

                override fun onEvent(eventType: Int, params: Bundle?) {}
            })
            val intent = Intent(RecognizerIntent.ACTION_RECOGNIZE_SPEECH).apply {
                putExtra(RecognizerIntent.EXTRA_LANGUAGE_MODEL, RecognizerIntent.LANGUAGE_MODEL_FREE_FORM)
                putExtra(RecognizerIntent.EXTRA_LANGUAGE, language)
                putExtra(RecognizerIntent.EXTRA_PARTIAL_RESULTS, true)
                putExtra(RecognizerIntent.EXTRA_MAX_RESULTS, 1)
            }
            speechRecognizer?.startListening(intent)
        } catch (e: Exception) {
            _error.postValue("Error al iniciar reconocimiento")
            e.printStackTrace()
        }
    }

    fun stopListening() {
        try {
            speechRecognizer?.stopListening()
            speechRecognizer?.destroy()
        } catch (e: Exception) {
            e.printStackTrace()
        }
        speechRecognizer = null
        _isListening.postValue(false)
    }
}
