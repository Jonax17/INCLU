package com.inclu.ui.screens.laboratorio_haptic

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.navigation.NavController
import com.inclu.data.model.HapticPatternType
import com.inclu.ui.components.*
import com.inclu.ui.viewmodels.HapticViewModel

@Composable
fun LaboratorioHapticoScreen(navController: NavController, hapticViewModel: HapticViewModel) {
    IncluScaffold(title = "Laboratorio Háptico", onBack = { navController.popBackStack() }) { padding ->
        ScreenColumn(padding) {
            Text(
                "INCLU HAPTIC · Lenguaje de vibraciones.",
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            HapticTile("Izquierda", "Una vibración corta", MaterialTheme.colorScheme.primary, { hapticViewModel.playPattern(HapticPatternType.LEFT) })
            HapticTile("Derecha", "Dos vibraciones cortas", MaterialTheme.colorScheme.secondary, { hapticViewModel.playPattern(HapticPatternType.RIGHT) })
            HapticTile("Peligro", "Tres vibraciones", MaterialTheme.colorScheme.error, { hapticViewModel.playPattern(HapticPatternType.DANGER) })
            HapticTile("Detener", "Vibración larga", MaterialTheme.colorScheme.tertiary, { hapticViewModel.playPattern(HapticPatternType.STOP) })
            HapticTile("Destino", "Dos vibraciones largas", MaterialTheme.colorScheme.primary, { hapticViewModel.playPattern(HapticPatternType.DESTINATION) })
            HapticTile("Ayuda", "Patrón de ayuda", MaterialTheme.colorScheme.error, { hapticViewModel.playPattern(HapticPatternType.HELP) })
        }
    }
}
