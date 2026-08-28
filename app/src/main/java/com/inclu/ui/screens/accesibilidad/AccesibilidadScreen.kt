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
import com.inclu.ui.components.*
import com.inclu.ui.viewmodels.SettingsViewModel

@Composable
fun AccesibilidadScreen(settingsViewModel: SettingsViewModel) {
    val profile by settingsViewModel.profile.collectAsState()

    IncluScaffold(title = "Accesibilidad") { padding ->
        ScreenColumn(padding) {
            InfoCard(
                title = "Mi accesibilidad",
                body = "Ajusta tu experiencia según tus necesidades (modo actual: ${profile.profiles.firstOrNull() ?: "General"})."
            )
            AccessSection("Visión", listOf("Tamaño de texto", "Contraste", "Lector de pantalla", "Inversión de colores"))
            AccessSection("Audición", listOf("Vibración", "Flash", "Alertas visuales"))
            AccessSection("Háptica", listOf("Intensidad", "Duración", "Patrones"))
            AccessSection("Motor", listOf("Botones grandes", "Control por voz", "Tiempo de interacción"))
        }
    }
}

@Composable
fun AccessSection(title: String, options: List<String>) {
    ElevatedCard(modifier = Modifier.fillMaxWidth(), shape = MaterialTheme.shapes.large) {
        Column(Modifier.padding(16.dp)) {
            Text(title, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            Spacer(Modifier.height(8.dp))
            options.forEach { option ->
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.padding(vertical = 2.dp)
                ) {
                    Icon(
                        Icons.Default.Circle,
                        contentDescription = null,
                        modifier = Modifier.size(8.dp),
                        tint = MaterialTheme.colorScheme.primary
                    )
                    Spacer(Modifier.width(8.dp))
                    Text(
                        option,
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }
    }
}
