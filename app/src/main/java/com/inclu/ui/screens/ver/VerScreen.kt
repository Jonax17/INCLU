package com.inclu.ui.screens.ver

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.navigation.NavController
import com.inclu.ui.components.*

@Composable
fun VerScreen(navController: NavController) {
    IncluScaffold(title = "Ver", onBack = { navController.popBackStack() }) { padding ->
        ScreenColumn(padding) {
            Text(
                "Herramientas para personas ciegas y con baja visión.",
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            FeatureTile(
                icon = Icons.Default.MenuBook,
                title = "Lector de texto",
                description = "Lee texto con cámara y voz",
                onClick = { navController.navigate("lector_texto") }
            )
            FeatureTile(
                icon = Icons.Default.ZoomIn,
                title = "Lupa inteligente",
                description = "Amplía y mejora la visualización",
                onClick = { navController.navigate("lupa") }
            )
            FeatureTile(
                icon = Icons.Default.DocumentScanner,
                title = "Escáner de documentos",
                description = "Captura y lee documentos",
                onClick = { navController.navigate("escaneador") }
            )
        }
    }
}
