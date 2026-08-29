package com.inclu.ui.screens.laboratorio_haptic

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.navigation.NavController
import com.inclu.data.model.HAPTIC_ALERTS
import com.inclu.data.model.HAPTIC_COMMUNICATION
import com.inclu.data.model.HAPTIC_DIRECTIONS
import com.inclu.data.model.HAPTIC_NAVIGATION
import com.inclu.data.model.hapticPatternForType
import com.inclu.ui.components.*
import com.inclu.ui.navigation.ScreenRoute
import com.inclu.ui.viewmodels.HapticViewModel

private fun groups(types: List<com.inclu.data.model.HapticPatternType>) = types.map { hapticPatternForType(it) }

@Composable
fun LaboratorioHapticoScreen(navController: NavController, hapticViewModel: HapticViewModel) {
    IncluScaffold(title = "Laboratorio Háptico", onBack = { navController.popBackStack() }) { padding ->
        ScreenColumn(padding) {
            Text(
                "INCLU HAPTIC · Lenguaje de vibraciones.",
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            HapticGroup("Direcciones", groups(HAPTIC_DIRECTIONS), onPlay = { hapticViewModel.playHaptic(it) })
            HapticGroup("Alertas", groups(HAPTIC_ALERTS), onPlay = { hapticViewModel.playHaptic(it) })
            HapticGroup("Navegación", groups(HAPTIC_NAVIGATION), onPlay = { hapticViewModel.playHaptic(it) })
            HapticGroup("Comunicación", groups(HAPTIC_COMMUNICATION), onPlay = { hapticViewModel.playHaptic(it) })
            HapticTile(
                label = "Vibraciones personalizadas",
                description = "Crea y guarda tus propios patrones",
                color = MaterialTheme.colorScheme.tertiary,
                onClick = { navController.navigate(ScreenRoute.Vibraciones.route) }
            )
        }
    }
}
