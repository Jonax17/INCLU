package com.inclu.ui.screens.accesibilidad

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.runtime.collectAsState
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.inclu.ui.viewmodels.SettingsViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AccesibilidadScreen(settingsViewModel: SettingsViewModel) {
    val profile by settingsViewModel.profile.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(title = { Text("⚙️ Accesibilidad") })
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp)
                .verticalScroll(rememberScrollState())
        ) {
            Text("Mi accesibilidad", fontSize = 24.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(16.dp))
            ProfileSection("Visión", listOf("Tamaño de texto", "Contraste", "Lector de pantalla", "Inversión de colores"))
            ProfileSection("Audición", listOf("Vibración", "Flash", "Alertas visuales"))
            ProfileSection("Háptica", listOf("Intensidad", "Duración", "Patrones"))
            ProfileSection("Motor", listOf("Botones grandes", "Control por voz", "Tiempo de interacción"))
        }
    }
}

@Composable
fun ProfileSection(title: String, options: List<String>) {
    Card(modifier = Modifier.fillMaxWidth(), elevation = CardDefaults.cardElevation(defaultElevation = 2.dp), shape = MaterialTheme.shapes.large) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(title, fontSize = 18.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(8.dp))
            options.forEach { option ->
                Text("• $option", fontSize = 14.sp)
            }
        }
    }
    Spacer(modifier = Modifier.height(8.dp))
}