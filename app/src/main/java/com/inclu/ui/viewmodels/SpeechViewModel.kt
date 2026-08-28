package com.inclu.ui.viewmodels

import android.app.Application
import android.content.ContentValues
import android.os.Build
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.inclu.speech.TTSManager
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class SpeechViewModel(application: Application) : AndroidViewModel(application) {
    private val ttsManager = TTSManager(application)

    private val _isSpeaking = MutableStateFlow(false)
    val isSpeaking: StateFlow<Boolean> = _isSpeaking

    private val _spokenText = MutableStateFlow("")
    val spokenText: StateFlow<String> = _spokenText

    private val _ttsInitialized = MutableStateFlow(false)
    val ttsInitialized: StateFlow<Boolean> = _ttsInitialized

    init {
        viewModelScope.launch {
            ttsManager.initialize()
            _ttsInitialized.value = true
        }
    }

    fun speak(text: String) {
        if (ttsInitialized.value) {
            ttsManager.speak(text)
            _spokenText.value = text
            _isSpeaking.value = true
        }
    }

    fun stopSpeaking() {
        ttsManager.stop()
        _isSpeaking.value = false
    }

    fun setText(text: String) {
        _spokenText.value = text
    }

    fun clearText() {
        _spokenText.value = ""
    }
}