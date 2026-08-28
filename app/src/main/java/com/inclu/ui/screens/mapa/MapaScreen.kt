
package com.inclu.ui.screens.mapa

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.inclu.data.model.PlaceType
import com.inclu.data.model.AccessiblePlace

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MapaScreen(navController: NavController) {
    val places = remember {
        listOf(
            AccessiblePlace("LAB_SISTEMAS_01", "Laboratorio de Sistemas", "Segundo piso. Acceso por rampa.", "", PlaceType.INSTITUTION),
            AccessiblePlace("BIBLIOTECA_01", "Biblioteca Central", "A 10 metros.", "", PlaceType.INSTITUTION),
            AccessiblePlace("RAMPA_01", "Rampa principal", "Rampa de acceso.", "", PlaceType.RAMP),
            AccessiblePlace("BAÑO_01", "Baño accesible", "Baño adaptado.", "", PlaceType.ACCESSIBLE_BATHROOM),
            AccessiblePlace("ASCENSOR_01", "Ascensor", "Botones en braille.", "", PlaceType.ELEVATOR),
            AccessiblePlace("PARKING_01", "Estacionamiento accesible", "Zona reservada.", "", PlaceType.ACCESSIBLE_PARKING),
            AccessiblePlace("CENTRO_01", "Centro de atención", "Atención prioritaria.", "", PlaceType.HEALTH_CENTER),
            AccessiblePlace("RUTA_01", "Ruta para personas ciegas", "Sendero táctil.", "", PlaceType.BLIND_ROUTE)
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("🗺️ Mapa de Accesibilidad") },
                navigationIcon = {
                    IconButton(onClick = { navController.popBackStack() }) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Volver")
                    }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp)
                .verticalScroll(rememberScrollState())
        ) {
            Text("Lugares accesibles", fontSize = 20.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(16.dp))
            places.forEach { place ->
                PlaceCard(place)
                Spacer(modifier = Modifier.height(8.dp))
            }
        }
    }
}

@Composable
fun PlaceCard(place: AccessiblePlace) {
    Card(modifier = Modifier.fillMaxWidth(), elevation = CardDefaults.cardElevation(defaultElevation = 2.dp), shape = MaterialTheme.shapes.large) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text("${place.type.icon} ${place.name}", fontSize = 18.sp, fontWeight = FontWeight.Bold)
            Text(place.description, fontSize = 14.sp, color = Color.Gray)
        }
    }
}
