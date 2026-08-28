package com.inclu.ui.screens.emergencia

import android.content.Context
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import androidx.compose.ui.platform.LocalContext
import com.inclu.utils.vibrateSimple

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EmergenciaScreen(navController: NavController) {
    var showAlert by remember { mutableStateOf(false) }
    var locationText by remember { mutableStateOf("Obteniendo ubicación...") }
    val context = LocalContext.current

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("🆘 Emergencia") },
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
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            if (showAlert) {
                Card(
                    colors = CardDefaults.cardColors(containerColor = Color(0xFFFFCDD2)),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                        Text("🚨 ALERTA ACTIVADA", fontSize = 28.sp, fontWeight = FontWeight.Bold, color = Color.Red)
                        Text(locationText, fontSize = 16.sp, textAlign = TextAlign.Center)
                    }
                }
            }
            Spacer(modifier = Modifier.height(24.dp))
            Button(
                onClick = {
                    showAlert = true
                    locationText = "Ubicación: Lat 0.0, Lng 0.0"
                    vibrateSimple(context, 1000L)
                },
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(containerColor = Color.Red)
            ) {
                Icon(Icons.Default.Sos, contentDescription = "Emergencia")
                Spacer(modifier = Modifier.width(12.dp))
                Text("NECESITO AYUDA", fontSize = 24.sp, fontWeight = FontWeight.Bold)
            }
            Spacer(modifier = Modifier.height(16.dp))
            Text("Tu contacto de emergencia se muestra aquí", fontSize = 14.sp, color = Color.Gray)
        }
    }
}