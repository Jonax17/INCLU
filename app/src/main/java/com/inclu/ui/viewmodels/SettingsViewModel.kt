package com.inclu.ui.viewmodels

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.inclu.data.model.UserProfile
import com.inclu.data.repository.SettingsRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch

class SettingsViewModel(application: Application) : AndroidViewModel(application) {
    private val settingsRepo = SettingsRepository(application)

    private val _profile = MutableStateFlow(UserProfile())
    val profile: StateFlow<UserProfile> = _profile

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error

    init {
        loadProfile()
    }

    private fun loadProfile() {
        viewModelScope.launch {
            try {
                _profile.value = settingsRepo.getProfile()
            } catch (e: Exception) {
                _error.value = "Error al cargar configuración"
            }
        }
    }

    fun saveProfile(profile: UserProfile) {
        viewModelScope.launch {
            try {
                settingsRepo.saveProfile(profile)
                _profile.value = profile
                _error.value = null
            } catch (e: Exception) {
                _error.value = "Error al guardar configuración"
            }
        }
    }
}