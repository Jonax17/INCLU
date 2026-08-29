package com.inclu.ui.viewmodels

import android.app.Application
import androidx.lifecycle.AndroidViewModel
import androidx.lifecycle.viewModelScope
import com.inclu.data.model.CustomHaptic
import com.inclu.data.model.HapticSegment
import com.inclu.data.repository.HapticRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

class CustomHapticViewModel(application: Application) : AndroidViewModel(application) {
    private val repo = HapticRepository(application)

    val patterns: StateFlow<List<CustomHaptic>> = repo.getAll()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    fun save(name: String, segments: List<HapticSegment>) = viewModelScope.launch {
        repo.insert(CustomHaptic(name = name, segments = segments))
    }

    fun delete(item: CustomHaptic) = viewModelScope.launch {
        repo.delete(item)
    }
}
