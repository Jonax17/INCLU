
package com.inclu.ui.screens.lector_texto

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
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.inclu.speech.TTSManager

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LectorTextoScreen(navController: NavController) {
    var texto by remember { mutableStateOf("") }
    var isSpeaking by remember { mutableStateOf(false) }
    val context = LocalContext.current
    val tts = remember { TTSManager(context) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("📖 Lector de texto") },
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
                colors = CardDefaults.cardColors(containerColor = Color(0xFFE8F5E9))
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Texto reconocido:", fontSize = 14.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(texto.ifEmpty { "Presiona Escanear para capturar texto" }, fontSize = 18.sp)
                }
            }
            Spacer(modifier = Modifier.height(24.dp))
            Button(
                onClick = { /* open camera */ },
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1A237E))
            ) {
                Icon(Icons.Default.Camera, contentDescription = "Escanear")
                Spacer(modifier = Modifier.width(8.dp))
                Text("Escanear")
            }
            Spacer(modifier = Modifier.height(8.dp))
            Row(horizontalArrangement = Arrangement.SpaceEvenly) {
                Button(onClick = { /* pause */ }) {
                    Icon(Icons.Default.Pause, contentDescription = "Pausar")
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Pausar")
                }
                Button(onClick = { /* repeat */ }) {
                    Icon(Icons.Default.Replay, contentDescription = "Repetir")
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Repetir")
                }
            }
            Spacer(modifier = Modifier.height(16.dp))
            Row(horizontalArrangement = Arrangement.SpaceEvenly) {
                Button(
                    onClick = { tts.speak(texto); isSpeaking = true },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1A237E))
                ) {
                    Icon(Icons.Default.VolumeUp, contentDescription = "Leer")
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Leer")
                }
                Button(onClick = { /* stop */ }) {
                    Icon(Icons.Default.Stop, contentDescription = "Detener")
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Detener")
                }
                Button(onClick = { texto = ""; isSpeaking = false }) {
                    Icon(Icons.Default.Delete, contentDescription = "Borrar")
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Borrar")
                }
            }
        }
    }
}
