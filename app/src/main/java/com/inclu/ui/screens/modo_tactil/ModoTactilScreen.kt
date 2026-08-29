package com.inclu.ui.screens.modo_tactil

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.navigation.NavController
import com.inclu.data.model.HAPTIC_ALERTS
import com.inclu.data.model.HAPTIC_DIRECTIONS
import com.inclu.data.model.hapticPatternForType
import com.inclu.ui.components.*
import com.inclu.ui.navigation.ScreenRoute
import com.inclu.ui.viewmodels.HapticViewModel

private val TILE_COLORS = mapOf(
    "LEFT" to Color(0xFF2196F3),
    "RIGHT" to Color(0xFF4CAF50),
    "FORWARD" to Color(0xFF03A9F4),
    "BACK" to Color(0xFF009688),
    "UP" to Color(0xFF8BC34A),
    "DOWN" to Color(0xFF795548),
    "DANGER" to Color(0xFFD32F2F),
    "STOP" to Color(0xFF9E9E9E),
    "OBSTACLE" to Color(0xFFFF9800),
    "FALL" to Color(0xFFE91E63),
    "HELP" to Color(0xFF9C27B0)
)

@Composable
fun ModoTactilScreen(navController: NavController, hapticViewModel: HapticViewModel) {
    IncluScaffold(title = "Modo Táctil", onBack = { navController.popBackStack() }) { padding ->
        ScreenColumn(padding) {
            Text(
                "Interacción táctil: toca para enviar un patrón háptico.",
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            (HAPTIC_DIRECTIONS + HAPTIC_ALERTS).forEach { type ->
                val pattern = hapticPatternForType(type)
                HapticTile(
                    label = type.label.uppercase(),
                    description = pattern.description,
                    color = TILE_COLORS[type.name] ?: MaterialTheme.colorScheme.primary,
                    onClick = { hapticViewModel.playHaptic(pattern) }
                )
            }
            HapticTile(
                label = "PERSONALIZADAS",
                description = "Tus vibraciones guardadas",
                color = MaterialTheme.colorScheme.tertiary,
                onClick = { navController.navigate(ScreenRoute.Vibraciones.route) }
            )
        }
    }
}
