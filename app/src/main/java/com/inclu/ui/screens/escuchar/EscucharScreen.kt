package com.inclu.ui.screens.escuchar

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
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.runtime.livedata.observeAsState
import androidx.navigation.NavController
import com.inclu.speech.SpeechRecognizerManager
import com.inclu.ui.viewmodels.SpeechViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EscucharScreen(navController: NavController, speechViewModel: SpeechViewModel) {
    val context = LocalContext.current
    val recognizer = remember { SpeechRecognizerManager(context) }

    val recognized by recognizer.recognizedText.observeAsState("")
    val isListening by recognizer.isListening.observeAsState(false)
    val error by recognizer.error.observeAsState(null)

    DisposableEffect(recognizer) {
        onDispose { recognizer.stopListening() }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("🎧 Escuchar") },
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
                .verticalScroll(rememberScrollState()),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color(0xFFE3F2FD))
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Texto reconocido:", fontSize = 14.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = recognized.ifEmpty { "Presiona Escuchar y habla..." },
                        fontSize = 18.sp
                    )
                }
            }
            if (error != null) {
                Spacer(modifier = Modifier.height(8.dp))
                Text(error ?: "", color = Color(0xFFD32F2F), fontSize = 14.sp)
            }
            Spacer(modifier = Modifier.height(24.dp))
            Button(
                onClick = { if (isListening) recognizer.stopListening() else recognizer.startListening() },
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (isListening) Color(0xFFD32F2F) else Color(0xFF1A237E)
                )
            ) {
                Icon(if (isListening) Icons.Default.Stop else Icons.Default.Mic, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text(if (isListening) "Detener" else "Escuchar")
            }
            Spacer(modifier = Modifier.height(8.dp))
            Row(horizontalArrangement = Arrangement.SpaceEvenly) {
                Button(
                    onClick = { speechViewModel.speak(recognized) },
                    enabled = recognized.isNotEmpty()
                ) {
                    Icon(Icons.Default.VolumeUp, contentDescription = "Repetir")
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Repetir")
                }
                Button(
                    onClick = { recognizer.stopListening() },
                    enabled = isListening
                ) {
                    Icon(Icons.Default.Stop, contentDescription = "Detener")
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Detener")
                }
            }
        }
    }
}
