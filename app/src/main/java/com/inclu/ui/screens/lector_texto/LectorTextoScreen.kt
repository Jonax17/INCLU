package com.inclu.ui.screens.lector_texto

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.inclu.speech.TTSManager
import com.inclu.ui.components.*

@Composable
fun LectorTextoScreen(navController: NavController) {
    var texto by remember { mutableStateOf("") }
    var isSpeaking by remember { mutableStateOf(false) }
    val context = LocalContext.current
    val tts = remember { TTSManager(context) }

    IncluScaffold(title = "Lector de texto", onBack = { navController.popBackStack() }) { padding ->
        ScreenColumn(padding) {
            InfoCard(
                title = "Texto reconocido",
                body = texto.ifEmpty { "Presiona \"Escanear\" para capturar texto con la cámara." }
            )
            PrimaryButton(text = "Escanear", onClick = { /* abrir cámara */ })
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                TonalButton(
                    text = "Leer",
                    onClick = { tts.speak(texto); isSpeaking = true },
                    modifier = Modifier.weight(1f),
                    enabled = texto.isNotEmpty()
                )
                TonalButton(
                    text = "Detener",
                    onClick = { tts.stop(); isSpeaking = false },
                    modifier = Modifier.weight(1f)
                )
            }
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                TonalButton("Pausar", onClick = { }, modifier = Modifier.weight(1f))
                TonalButton(
                    text = "Borrar",
                    onClick = { texto = ""; isSpeaking = false },
                    modifier = Modifier.weight(1f)
                )
            }
        }
    }
}
