package com.inclu.ui.screens.dispositivos

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.inclu.ui.components.*

data class DeviceItem(val name: String, val type: String, val status: String, val battery: Int, val id: String)

@Composable
fun DispositivosScreen(navController: NavController) {
    val devices = remember {
        listOf(
            DeviceItem("INCLU Band", "Pulsera háptica", "Desconectado", 0, "band_001"),
            DeviceItem("INCLU Cane", "Bastón inteligente", "Desconectado", 0, "cane_001"),
            DeviceItem("INCLU Glove", "Guante háptico", "Desconectado", 0, "glove_001")
        )
    }

    IncluScaffold(title = "Mis dispositivos", onBack = { navController.popBackStack() }) { padding ->
        ScreenColumn(padding) {
            Text(
                "Dispositivos Bluetooth Low Energy compatibles.",
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            devices.forEach { DeviceCard(it) }
        }
    }
}

@Composable
fun DeviceCard(device: DeviceItem) {
    ElevatedCard(modifier = Modifier.fillMaxWidth(), shape = MaterialTheme.shapes.large) {
        Column(Modifier.padding(16.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                IconContainer(icon = Icons.Default.Bluetooth, tint = MaterialTheme.colorScheme.primary)
                Spacer(Modifier.width(12.dp))
                Column(Modifier.weight(1f)) {
                    Text(device.name, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                    Text(device.type, style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
                AssistChip(onClick = { }, label = { Text(device.status) })
            }
            Spacer(Modifier.height(12.dp))
            Text(
                "Batería: ${device.battery}%",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Spacer(Modifier.height(12.dp))
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                Button(onClick = { }, modifier = Modifier.weight(1f), shape = MaterialTheme.shapes.large) { Text("Conectar") }
                OutlinedButton(onClick = { }, modifier = Modifier.weight(1f), shape = MaterialTheme.shapes.large) { Text("Desconectar") }
            }
        }
    }
}
