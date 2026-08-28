package com.inclu.ui.screens.emergencia

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.inclu.ui.components.*
import com.inclu.utils.vibrateSimple

@Composable
fun EmergenciaScreen(navController: NavController) {
    var showAlert by remember { mutableStateOf(false) }
    val context = LocalContext.current

    IncluScaffold(title = "Emergencia", onBack = { navController.popBackStack() }) { padding ->
        ScreenColumn(padding) {
            if (showAlert) {
                InfoCard(
                    title = "ALERTA ACTIVADA",
                    body = "Se ha enviado tu ubicación a tu contacto de emergencia.",
                    containerColor = MaterialTheme.colorScheme.errorContainer,
                    contentColor = MaterialTheme.colorScheme.onErrorContainer
                )
            } else {
                InfoCard(
                    title = "¿Necesitas ayuda?",
                    body = "Activa la alerta para avisar a tu contacto de emergencia y compartir tu ubicación."
                )
            }
            Button(
                onClick = {
                    showAlert = !showAlert
                    if (showAlert) vibrateSimple(context, 1000L)
                },
                modifier = Modifier.fillMaxWidth(),
                shape = MaterialTheme.shapes.large,
                colors = ButtonDefaults.buttonColors(containerColor = MaterialTheme.colorScheme.error)
            ) {
                Icon(Icons.Default.Sos, contentDescription = null)
                Spacer(Modifier.width(12.dp))
                Text(
                    if (showAlert) "CANCELAR ALERTA" else "NECESITO AYUDA",
                    style = MaterialTheme.typography.labelLarge
                )
            }
            Text(
                "Tu contacto de emergencia se mostrará aquí.",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}
