package com.inclu.ui.viewmodels

import android.app.Application
import android.content.ContentValues
import android.os.Build
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.inclu.data.model.HapticPattern
import com.inclu.data.model.HapticPatternType
import com.inclu.utils.hapticPatternForType
import com.inclu.utils.vibrate
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class HapticViewModel(application: Application) : AndroidViewModel(application) {
    private val _currentPattern = MutableStateFlow<HapticPattern?>(null)
    val currentPattern: StateFlow<HapticPattern?> = _currentPattern

    private val _lastAction = MutableStateFlow("")
    val lastAction: StateFlow<String> = _lastAction

    private val context = application

    fun playPattern(type: HapticPatternType) {
        val pattern = hapticPatternForType(type)
        _currentPattern.value = pattern
        vibrate(context, pattern.pattern)
        _lastAction.value = pattern.name
    }

    fun stop() {
        _currentPattern.value = null
        _lastAction.value = ""
    }
}