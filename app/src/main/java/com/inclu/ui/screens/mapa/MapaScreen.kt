package com.inclu.ui.screens.mapa

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
import com.inclu.data.model.AccessiblePlace
import com.inclu.data.model.PlaceType
import com.inclu.ui.components.*

@Composable
fun MapaScreen(navController: NavController) {
    val context = LocalContext.current
    val fused = remember { LocationServices.getFusedLocationProviderClient(context) }
    var granted by remember { mutableStateOf(false) }
    var myLoc by remember { mutableStateOf<Location?>(null) }
    val launcher = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) { granted = it }

    val places = remember {
        listOf(
            AccessiblePlace("LAB_SISTEMAS_01", "Laboratorio de Sistemas", "Segundo piso. Acceso por rampa.", "", PlaceType.INSTITUTION, latitude = 4.6097, longitude = -74.0817),
            AccessiblePlace("BIBLIOTECA_01", "Biblioteca Central", "Entrada adaptada y ascensor.", "", PlaceType.INSTITUTION, latitude = 4.6099, longitude = -74.0820),
            AccessiblePlace("BANO_P1_03", "Bano accesible P1", "Senalizacion tactica.", "", PlaceType.ACCESSIBLE_BATHROOM, latitude = 4.6095, longitude = -74.0815),
            AccessiblePlace("ASCENSOR_A", "Ascensor bloque A", "Botones en braille.", "", PlaceType.ELEVATOR, latitude = 4.6098, longitude = -74.0819),
            AccessiblePlace("ENTRADA_PRINCIPAL", "Entrada principal", "Rampa y pasamanos.", "", PlaceType.INSTITUTION, latitude = 4.6096, longitude = -74.0818)
        )
    }

    fun metersTo(p: AccessiblePlace): Float {
        val loc = myLoc ?: return Float.MAX_VALUE
        val res = floatArrayOf(0f)
        Location.distanceBetween(loc.latitude, loc.longitude, p.latitude, p.longitude, res)
        return res[0]
    }

    fun formatDistance(p: AccessiblePlace): String {
        val d = metersTo(p)
        if (d == Float.MAX_VALUE) return "Ubicacion desconocida"
        return if (d < 1000) "${d.toInt()} m" else "${"%.1f".format(d / 1000)} km"
    }

    LaunchedEffect(Unit) { launcher.launch(Manifest.permission.ACCESS_FINE_LOCATION) }
    LaunchedEffect(granted) {
        if (granted) {
            try {
                fused.lastLocation.addOnSuccessListener { myLoc = it }
            } catch (_: Exception) { }
        }
    }

    val ordered = remember(myLoc) {
        if (myLoc == null) places else places.sortedBy { metersTo(it) }
    }

    IncluScaffold(title = "Mapa de Accesibilidad", onBack = { navController.popBackStack() }) { padding ->
        ScreenColumn(padding) {
            if (!granted) {
                InfoCard(title = "Permiso de ubicacion", body = "INCLU usa tu ubicacion para ordenar lugares por cercania.")
                PrimaryButton("Conceder permiso", onClick = { launcher.launch(Manifest.permission.ACCESS_FINE_LOCATION) })
            } else {
                Text(
                    "Lugares accesibles cercanos a ti.",
                    style = MaterialTheme.typography.bodyLarge,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                ordered.forEach { PlaceItem(it, distance = formatDistance(it)) }
            }
        }
    }
}
