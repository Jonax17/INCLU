package com.inclu.ui.screens.accesibilidad

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.inclu.data.model.UserProfile
import com.inclu.ui.components.*
import com.inclu.ui.viewmodels.SettingsViewModel

@Composable
fun AccesibilidadScreen(settingsViewModel: SettingsViewModel) {
    val profile by settingsViewModel.profile.collectAsState()
    var draft by remember(profile) { mutableStateOf(profile) }

    LaunchedEffect(profile) { draft = profile }

    fun save(updated: UserProfile) {
        draft = updated
        settingsViewModel.saveProfile(updated)
    }

    IncluScaffold(title = "Accesibilidad") { padding ->
        ScreenColumn(padding) {
            InfoCard(
                title = "Mi accesibilidad",
                body = "Estos ajustes se aplican en toda la app al instante."
            )

            SectionTitle("Tamaño de texto")
            Slider(
                value = draft.fontSizeMultiplier,
                onValueChange = { save(draft.copy(fontSizeMultiplier = it)) },
                valueRange = 1f..2f,
                steps = 10
            )
            Text(
                "Multiplicador: ${"%.1f".format(draft.fontSizeMultiplier)}x",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            SectionTitle("Visual")
            SettingToggle("Alto contraste", checked = draft.highContrast, onCheckedChange = { save(draft.copy(highContrast = it)) })
            SettingToggle("Invertir colores", checked = draft.invertColors, onCheckedChange = { save(draft.copy(invertColors = it)) })
            SettingToggle("Botones grandes", checked = draft.largeButtons, onCheckedChange = { save(draft.copy(largeButtons = it)) })

            SectionTitle("Audio")
            SettingToggle("Voz habilitada", checked = draft.voiceEnabled, onCheckedChange = { save(draft.copy(voiceEnabled = it)) })

            SectionTitle("Haptica")
            Text("Intensidad: ${"%.2f".format(draft.hapticIntensity)}", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
            Slider(value = draft.hapticIntensity, onValueChange = { save(draft.copy(hapticIntensity = it)) }, valueRange = 0f..1f)
            Text("Duracion: ${draft.hapticDuration} ms", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
            Slider(
                value = draft.hapticDuration.toFloat(),
                onValueChange = { save(draft.copy(hapticDuration = it.toLong())) },
                valueRange = 50f..500f,
                steps = 9
            )

            SectionTitle("Contacto de emergencia")
            OutlinedTextField(
                value = draft.emergencyContact,
                onValueChange = { save(draft.copy(emergencyContact = it)) },
                label = { Text("Telefono") },
                placeholder = { Text("Ej. +521234567890") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true
            )
        }
    }
}
