
package com.inclu.ui.screens.lupa

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

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LupaScreen(navController: NavController) {
    var zoom by remember { mutableStateOf(1f) }
    var inverted by remember { mutableStateOf(false) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("🔍 Lupa inteligente") },
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
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color(0xFFFFF9C4))
            ) {
                Column(modifier = Modifier.padding(32.dp), horizontalAlignment = androidx.compose.ui.Alignment.CenterHorizontally) {
                    Text("Vista ampliada", fontSize = 48.sp, fontWeight = FontWeight.Bold)
                    Text("Zoom: ${"%.1f".format(zoom)}x", fontSize = 18.sp)
                    Text(if (inverted) "Colores invertidos" else "Colores normales", fontSize = 14.sp, color = Color.Gray)
                }
            }
            Spacer(modifier = Modifier.height(24.dp))
            Text("Controles", fontSize = 20.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(16.dp))
            SliderControl("Zoom", zoom, 1f..3f) { zoom = it }
            Spacer(modifier = Modifier.height(16.dp))
            ToggleControl("Invertir colores", inverted) { inverted = it }
            Spacer(modifier = Modifier.height(16.dp))
            ToggleControl("Texto grande", false) { }
            Spacer(modifier = Modifier.height(16.dp))
            ToggleControl("Alto contraste", false) { }
        }
    }
}

@Composable
fun SliderControl(label: String, value: Float, range: ClosedFloatingPointRange<Float>, onValueChange: (Float) -> Unit) {
    Card(modifier = Modifier.fillMaxWidth(), elevation = CardDefaults.cardElevation(defaultElevation = 2.dp), shape = MaterialTheme.shapes.large) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(label, fontSize = 18.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(8.dp))
            Slider(value = value, onValueChange = { onValueChange(it) }, valueRange = range)
            Text("${"%.1f".format(value)}x", fontSize = 14.sp, color = Color.Gray)
        }
    }
}

@Composable
fun ToggleControl(label: String, checked: Boolean, onCheckedChange: (Boolean) -> Unit) {
    Card(modifier = Modifier.fillMaxWidth(), elevation = CardDefaults.cardElevation(defaultElevation = 2.dp), shape = MaterialTheme.shapes.large) {
        Row(modifier = Modifier.padding(16.dp), verticalAlignment = androidx.compose.ui.Alignment.CenterVertically) {
            Text(label, fontSize = 18.sp, fontWeight = FontWeight.Bold, modifier = Modifier.weight(1f))
            Switch(checked = checked, onCheckedChange = onCheckedChange)
        }
    }
}
