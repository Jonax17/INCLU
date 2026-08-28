package com.inclu.ui.screens.modo_tactil

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.navigation.NavController
import com.inclu.data.model.HapticPatternType
import com.inclu.ui.components.*
import com.inclu.ui.viewmodels.HapticViewModel

@Composable
fun ModoTactilScreen(navController: NavController, hapticViewModel: HapticViewModel) {
    IncluScaffold(title = "Modo Táctil", onBack = { navController.popBackStack() }) { padding ->
        ScreenColumn(padding) {
            Text(
                "Interacción táctil: toca para enviar un patrón háptico.",
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            HapticTile("IZQUIERDA", "Patrón háptico izquierda", Color(0xFF2196F3), { hapticViewModel.playPattern(HapticPatternType.LEFT) })
            HapticTile("DERECHA", "Patrón háptico derecha", Color(0xFF4CAF50), { hapticViewModel.playPattern(HapticPatternType.RIGHT) })
            HapticTile("PELIGRO", "Patrón háptico peligro", Color(0xFFD32F2F), { hapticViewModel.playPattern(HapticPatternType.DANGER) })
            HapticTile("DETENER", "Patrón háptico detener", Color(0xFF9E9E9E), { hapticViewModel.playPattern(HapticPatternType.STOP) })
            HapticTile("AYUDA", "Patrón háptico ayuda", Color(0xFF9C27B0), { hapticViewModel.playPattern(HapticPatternType.HELP) })
        }
    }
}
