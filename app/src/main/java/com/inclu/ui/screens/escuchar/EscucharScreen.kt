package com.inclu.ui.screens.escuchar

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.compose.runtime.livedata.observeAsState
import androidx.navigation.NavController
import com.inclu.speech.SpeechRecognizerManager
import com.inclu.ui.components.*
import com.inclu.ui.viewmodels.SpeechViewModel

@Composable
fun EscucharScreen(navController: NavController, speechViewModel: SpeechViewModel) {
    val context = LocalContext.current
    val recognizer = remember { SpeechRecognizerManager(context) }

    val recognized by recognizer.recognizedText.observeAsState("")
    val isListening by recognizer.isListening.observeAsState(false)
    val error by recognizer.error.observeAsState(null)

    var lang by remember { mutableStateOf("es-ES") }
    val langOptions = listOf("es-ES" to "Español", "en-US" to "English")

    DisposableEffect(recognizer) {
        onDispose { recognizer.stopListening() }
    }

    IncluScaffold(title = "Escuchar", onBack = { navController.popBackStack() }) { padding ->
        ScreenColumn(padding) {
            Text(
                "Convierte voz en texto en tiempo real.",
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                langOptions.forEach { (code, label) ->
                    FilterChip(
                        selected = lang == code,
                        onClick = {
                            lang = code
                            recognizer.setLanguage(code)
                        },
                        label = { Text(label) }
                    )
                }
            }
            InfoCard(
                title = "Texto reconocido",
                body = recognized.ifEmpty { "Presiona \"Escuchar\" y habla para convertir tu voz en texto." }
            )
            if (error != null) {
                InfoCard(
                    title = "Aviso",
                    body = error ?: "",
                    containerColor = MaterialTheme.colorScheme.errorContainer,
                    contentColor = MaterialTheme.colorScheme.onErrorContainer
                )
            }
            PrimaryButton(
                text = if (isListening) "Detener" else "Escuchar",
                onClick = {
                    if (isListening) recognizer.stopListening() else {
                        recognizer.setLanguage(lang)
                        recognizer.startListening()
                    }
                }
            )
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                TonalButton(
                    text = "Repetir con voz",
                    onClick = { speechViewModel.speak(recognized) },
                    modifier = Modifier.weight(1f),
                    enabled = recognized.isNotEmpty()
                )
                TonalButton(
                    text = "Detener voz",
                    onClick = { speechViewModel.stopSpeaking() },
                    modifier = Modifier.weight(1f)
                )
            }
            TonalButton(
                text = "Limpiar",
                onClick = { recognizer.clearText() },
                enabled = recognized.isNotEmpty()
            )
        }
    }
}
