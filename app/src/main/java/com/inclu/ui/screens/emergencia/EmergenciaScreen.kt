package com.inclu.ui.screens.emergencia

import android.Manifest
import android.location.Location
import android.telephony.SmsManager
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.google.android.gms.location.LocationServices
import com.inclu.ui.components.*
import com.inclu.ui.navigation.ScreenRoute
import com.inclu.ui.viewmodels.SettingsViewModel
import com.inclu.utils.vibrateSimple

@Composable
fun EmergenciaScreen(navController: NavController, settingsViewModel: SettingsViewModel) {
    val profile by settingsViewModel.profile.collectAsState()
    val contact = profile.emergencyContact
    var showAlert by remember { mutableStateOf(false) }
    var status by remember { mutableStateOf("") }
    val context = LocalContext.current
    val fused = remember { LocationServices.getFusedLocationProviderClient(context) }

    fun sendSos() {
        if (contact.isBlank()) {
            status = "Configura un contacto de emergencia en Accesibilidad."
            return
        }
        try {
            fused.lastLocation.addOnSuccessListener { loc: Location? ->
                val coords = loc?.let { "https://maps.google.com/?q=${it.latitude},${it.longitude}" }
                    ?: "ubicacion no disponible"
                val msg = "INCLU SOS: Necesito ayuda. $coords"
                SmsManager.getDefault().sendTextMessage(contact, null, msg, null, null)
                status = "Mensaje de ayuda enviado a $contact."
            }.addOnFailureListener {
                status = "No se pudo obtener la ubicacion."
            }
        } catch (e: Exception) {
            status = "No se pudo enviar el SMS. Verifica el permiso de envio."
        }
    }

    val permLauncher = rememberLauncherForActivityResult(ActivityResultContracts.RequestMultiplePermissions()) { result ->
        val ok = result[Manifest.permission.SEND_SMS] == true &&
            result[Manifest.permission.ACCESS_FINE_LOCATION] == true
        if (ok) sendSos() else status = "Permisos requeridos para enviar la alerta."
    }

    IncluScaffold(title = "Emergencia", onBack = { navController.popBackStack() }) { padding ->
        ScreenColumn(padding) {
            if (showAlert) {
                InfoCard(
                    title = "ALERTA ACTIVADA",
                    body = status.ifEmpty { "Se ha enviado tu ubicacion a tu contacto de emergencia." },
                    containerColor = MaterialTheme.colorScheme.errorContainer,
                    contentColor = MaterialTheme.colorScheme.onErrorContainer
                )
            } else {
                InfoCard(
                    title = "¿Necesitas ayuda?",
                    body = "Activa la alerta para avisar a tu contacto de emergencia y compartir tu ubicacion."
                )
            }
            Button(
                onClick = {
                    showAlert = !showAlert
                    if (showAlert) {
                        vibrateSimple(context, 1000L)
                        permLauncher.launch(
                            arrayOf(
                                Manifest.permission.ACCESS_FINE_LOCATION,
                                Manifest.permission.SEND_SMS
                            )
                        )
                    }
                },
                modifier = Modifier.fillMaxWidth()
                    .defaultMinSize(minHeight = if (LocalLargeButtons.current) 60.dp else 50.dp),
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
            if (contact.isBlank()) {
                InfoCard(title = "Contacto no configurado", body = "Agrega un telefono de emergencia en Accesibilidad.")
                TonalButton("Ir a Accesibilidad", onClick = { navController.navigate(ScreenRoute.Accesibilidad.route) })
            }
            Text(
                "Tu contacto: ${if (contact.isBlank()) "no configurado" else contact}",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            if (status.isNotEmpty() && !showAlert) {
                Text(
                    status,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.primary
                )
            }
        }
    }
}
