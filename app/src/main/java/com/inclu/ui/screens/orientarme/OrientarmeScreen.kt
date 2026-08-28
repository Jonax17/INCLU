package com.inclu.ui.screens.orientarme

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.navigation.NavController
import com.inclu.ui.components.*

@Composable
fun OrientarmeScreen(navController: NavController) {
    IncluScaffold(title = "Orientarme", onBack = { navController.popBackStack() }) { padding ->
        ScreenColumn(padding) {
            Text(
                "Encuentra lugares accesibles y muévete con confianza.",
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            FeatureTile(
                icon = Icons.Default.Map,
                title = "Mapa de Accesibilidad",
                description = "Lugares accesibles cercanos",
                onClick = { navController.navigate("mapa") }
            )
            FeatureTile(
                icon = Icons.Default.QrCode2,
                title = "Navegación Interior",
                description = "Escanea códigos QR o NFC",
                onClick = { }
            )
            FeatureTile(
                icon = Icons.Default.GpsFixed,
                title = "Navegación Exterior",
                description = "GPS para rutas exteriores",
                onClick = { }
            )
        }
    }
}
