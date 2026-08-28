package com.inclu.ui.screens.demo

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.navigation.NavController
import com.inclu.ui.components.*

@Composable
fun DemoScreen(navController: NavController) {
    IncluScaffold(title = "INCLU Demo", onBack = { navController.popBackStack() }) { padding ->
        ScreenColumn(padding) {
            Text(
                "Presentación rápida de funciones.",
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            FeatureTile(Icons.Default.MenuBook, "Demo 1", "Cámara → texto → voz", onClick = { navController.navigate("lector_texto") })
            FeatureTile(Icons.Default.GraphicEq, "Demo 2", "Evento → alerta → vibración", onClick = { navController.navigate("sentir") })
            FeatureTile(Icons.Default.QrCode2, "Demo 3", "QR/NFC → información accesible", onClick = { navController.navigate("orientarme") })
            FeatureTile(Icons.Default.Vibration, "Demo 4", "Botón → patrón háptico", onClick = { navController.navigate("laboratorio_haptic") })
            FeatureTile(Icons.Default.Bluetooth, "Demo 5", "Bluetooth → dispositivo externo", onClick = { navController.navigate("dispositivos") })
        }
    }
}
