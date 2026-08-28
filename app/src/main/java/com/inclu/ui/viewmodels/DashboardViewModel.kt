package com.inclu.ui.viewmodels

import android.app.Application
import android.content.ContentValues
import android.net.Uri
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.inclu.data.model.AccessibilityProfile
import com.inclu.data.model.UserProfile
import com.inclu.data.repository.SettingsRepository
import com.inclu.data.repository.PlacesRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.launch

class DashboardViewModel(application: Application) : AndroidViewModel(application) {
    private val profileRepo = SettingsRepository(application)
    private val placesRepo = PlacesRepository(application)

    private val _currentProfile = MutableStateFlow("General")
    val currentProfile: StateFlow<String> = _currentProfile

    private val _placesCount = MutableStateFlow(0)
    val placesCount: StateFlow<Int> = _placesCount

    init {
        loadData()
    }

    private fun loadData() {
        viewModelScope.launch {
            val profile = profileRepo.getProfile()
            _currentProfile.value = profile.profiles.firstOrNull() ?: "General"
            _placesCount.value = placesRepo.getAllPlaces().first().size
        }
    }

    fun setProfile(profiles: Set<AccessibilityProfile>) {
        viewModelScope.launch {
            val current = profileRepo.getProfile()
            profileRepo.saveProfile(current.copy(profiles = profiles.map { it.name }.toSet()))
            _currentProfile.value = profiles.firstOrNull()?.label ?: "General"
        }
    }
}