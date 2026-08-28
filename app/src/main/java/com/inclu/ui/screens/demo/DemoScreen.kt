
package com.inclu.ui.screens.demo

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DemoScreen(navController: NavController) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("INCLU DEMO") },
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
            Text("Modo demostración", fontSize = 24.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(8.dp))
            Text("Presentación rápida de funciones", fontSize = 14.sp, color = Color.Gray)
            Spacer(modifier = Modifier.height(24.dp))
            DemoCard("Demo 1", "Cámara → texto → voz", "lector_texto", navController)
            DemoCard("Demo 2", "Evento → alerta → vibración", "sentir", navController)
            DemoCard("Demo 3", "QR/NFC → información accesible", "orientarme", navController)
            DemoCard("Demo 4", "Botón → patrón háptico", "laboratorio_haptic", navController)
            DemoCard("Demo 5", "Bluetooth → dispositivo externo", "dispositivos", navController)
        }
    }
}

@Composable
fun DemoCard(title: String, description: String, route: String, navController: NavController) {
    Card(
        onClick = { navController.navigate(route) },
        modifier = Modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
        shape = MaterialTheme.shapes.large
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(title, fontSize = 20.sp, fontWeight = FontWeight.Bold)
            Text(description, fontSize = 14.sp, color = Color.Gray)
        }
    }
    Spacer(modifier = Modifier.height(8.dp))
}
