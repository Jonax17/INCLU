package com.inclu.ui.screens.orientarme

import android.Manifest
import android.location.Location
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.platform.LocalContext
import androidx.navigation.NavController
import com.google.android.gms.location.LocationServices
import com.inclu.ui.components.*
import com.inclu.ui.navigation.ScreenRoute

@Composable
fun OrientarmeScreen(navController: NavController) {
    val context = LocalContext.current
    val fused = remember { LocationServices.getFusedLocationProviderClient(context) }
    var granted by remember { mutableStateOf(false) }
    var coords by remember { mutableStateOf("Obteniendo...") }
    val launcher = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) { granted = it }

    LaunchedEffect(Unit) { launcher.launch(Manifest.permission.ACCESS_FINE_LOCATION) }
    LaunchedEffect(granted) {
        if (granted) {
            try {
                fused.lastLocation.addOnSuccessListener { loc: Location? ->
                    coords = loc?.let { "Lat ${"%.5f".format(it.latitude)}, Lon ${"%.5f".format(it.longitude)}" }
                        ?: "Ubicacion no disponible"
                }
            } catch (_: Exception) {
                coords = "Ubicacion no disponible"
            }
        } else {
            coords = "Permiso denegado"
        }
    }

    IncluScaffold(title = "Orientarme", onBack = { navController.popBackStack() }) { padding ->
        ScreenColumn(padding) {
            Text(
                "Encuentra lugares accesibles y muévete con confianza.",
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            InfoCard(title = "Tu ubicacion", body = coords)
            FeatureTile(
                Icons.Default.Map,
                "Mapa de Accesibilidad",
                "Lugares accesibles cercanos",
                onClick = { navController.navigate(ScreenRoute.Mapa.route) }
            )
            FeatureTile(
                Icons.Default.QrCode2,
                "Navegacion Interior (QR/NFC)",
                "Escanea codigos para informacion accesible",
                onClick = { navController.navigate(ScreenRoute.CodigoQr.route) }
            )
            FeatureTile(
                Icons.Default.GpsFixed,
                "Navegacion Exterior (GPS)",
                "Rutas exteriores con tu ubicacion",
                onClick = { navController.navigate(ScreenRoute.Mapa.route) }
            )
        }
    }
}
