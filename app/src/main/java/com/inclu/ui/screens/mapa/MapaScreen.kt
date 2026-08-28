package com.inclu.ui.screens.mapa

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.navigation.NavController
import com.inclu.data.model.AccessiblePlace
import com.inclu.data.model.PlaceType
import com.inclu.ui.components.*

@Composable
fun MapaScreen(navController: NavController) {
    val places = remember {
        listOf(
            AccessiblePlace("LAB_SISTEMAS_01", "Laboratorio de Sistemas", "Segundo piso. Acceso por rampa.", "", PlaceType.INSTITUTION),
            AccessiblePlace("BIBLIOTECA_01", "Biblioteca Central", "Entrada adaptada y ascensor.", "", PlaceType.INSTITUTION),
            AccessiblePlace("BANO_P1_03", "Baño accesible P1", "Señalización táctil.", "", PlaceType.ACCESSIBLE_BATHROOM),
            AccessiblePlace("ASCENSOR_A", "Ascensor bloque A", "Botones en braille.", "", PlaceType.INSTITUTION),
            AccessiblePlace("ENTRADA_PRINCIPAL", "Entrada principal", "Rampa y pasamanos.", "", PlaceType.INSTITUTION)
        )
    }

    IncluScaffold(title = "Mapa de Accesibilidad", onBack = { navController.popBackStack() }) { padding ->
        ScreenColumn(padding) {
            Text(
                "Lugares accesibles cerca de ti.",
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            places.forEach { PlaceItem(it) }
        }
    }
}
