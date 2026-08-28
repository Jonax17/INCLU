
package com.inclu.ui.screens.dispositivos

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
fun DispositivosScreen(navController: NavController) {
    val devices = remember {
        listOf(
            DeviceItem("INCLU Band", "Pulsera háptica", "Desconectado", 0, "band_001"),
            DeviceItem("INCLU Cane", "Bastón inteligente", "Desconectado", 0, "cane_001"),
            DeviceItem("INCLU Glove", "Guante háptico", "Desconectado", 0, "glove_001")
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Mis dispositivos") },
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
            Text("Bluetooth Low Energy", fontSize = 20.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(16.dp))
            devices.forEach { device ->
                DeviceCard(device)
                Spacer(modifier = Modifier.height(8.dp))
            }
        }
    }
}

data class DeviceItem(val name: String, val type: String, val status: String, val battery: Int, val id: String)

@Composable
fun DeviceCard(device: DeviceItem) {
    Card(modifier = Modifier.fillMaxWidth(), elevation = CardDefaults.cardElevation(defaultElevation = 4.dp), shape = MaterialTheme.shapes.large) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(device.name, fontSize = 18.sp, fontWeight = FontWeight.Bold)
            Text(device.type, fontSize = 14.sp, color = Color.Gray)
            Spacer(modifier = Modifier.height(8.dp))
            Row {
                Text("Estado: ${device.status}", fontSize = 14.sp)
                Text("Batería: ${device.battery}%", fontSize = 14.sp, modifier = Modifier.padding(start = 16.dp))
            }
            Spacer(modifier = Modifier.height(8.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Button(onClick = { /* connect */ }) { Text("Conectar") }
                Button(onClick = { /* disconnect */ }) { Text("Desconectar") }
            }
        }
    }
}
