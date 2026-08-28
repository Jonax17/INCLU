package com.inclu.ui.screens.sentir

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.navigation.NavController
import com.inclu.data.model.HapticPatternType
import com.inclu.ui.components.*
import com.inclu.ui.viewmodels.HapticViewModel

@Composable
fun SentirScreen(navController: NavController, hapticViewModel: HapticViewModel) {
    IncluScaffold(title = "Sentir", onBack = { navController.popBackStack() }) { padding ->
        ScreenColumn(padding) {
            Text(
                "Laboratorio háptico: un lenguaje de vibraciones con significado.",
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            HapticTile(
                label = "Izquierda",
                description = "Una vibración corta",
                color = MaterialTheme.colorScheme.primary,
                onClick = { hapticViewModel.playPattern(HapticPatternType.LEFT) }
            )
            HapticTile(
                label = "Derecha",
                description = "Dos vibraciones cortas",
                color = MaterialTheme.colorScheme.secondary,
                onClick = { hapticViewModel.playPattern(HapticPatternType.RIGHT) }
            )
            HapticTile(
                label = "Peligro",
                description = "Tres vibraciones",
                color = MaterialTheme.colorScheme.error,
                onClick = { hapticViewModel.playPattern(HapticPatternType.DANGER) }
            )
            HapticTile(
                label = "Detener",
                description = "Vibración larga",
                color = MaterialTheme.colorScheme.tertiary,
                onClick = { hapticViewModel.playPattern(HapticPatternType.STOP) }
            )
            HapticTile(
                label = "Destino",
                description = "Dos vibraciones largas",
                color = MaterialTheme.colorScheme.primary,
                onClick = { hapticViewModel.playPattern(HapticPatternType.DESTINATION) }
            )
            HapticTile(
                label = "Ayuda",
                description = "Patrón de ayuda",
                color = MaterialTheme.colorScheme.error,
                onClick = { hapticViewModel.playPattern(HapticPatternType.HELP) }
            )
        }
    }
}
