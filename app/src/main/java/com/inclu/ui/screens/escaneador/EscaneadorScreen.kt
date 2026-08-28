package com.inclu.ui.screens.escaneador

import android.Manifest
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.inclu.camera.CameraPreview
import com.inclu.speech.TTSManager
import com.inclu.ui.components.*
import com.inclu.vision.TextRecognitionHelper

@Composable
fun EscaneadorScreen(navController: NavController) {
    var texto by remember { mutableStateOf("") }
    val context = LocalContext.current
    val tts = remember { TTSManager(context) }
    val capture = remember { mutableStateOf(false) }
    var granted by remember { mutableStateOf(false) }
    val launcher = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) { granted = it }

    LaunchedEffect(Unit) {
        launcher.launch(Manifest.permission.CAMERA)
        tts.initialize()
    }
    DisposableEffect(Unit) { onDispose { tts.shutdown() } }

    IncluScaffold(title = "Escáner de documentos", onBack = { navController.popBackStack() }) { padding ->
        ScreenColumn(padding) {
            if (!granted) {
                InfoCard(title = "Permiso de cámara", body = "INCLU usa la cámara para escanear documentos.")
                PrimaryButton("Conceder permiso", onClick = { launcher.launch(Manifest.permission.CAMERA) })
            } else {
                CameraPreview(
                    modifier = Modifier.fillMaxWidth().height(320.dp).clip(MaterialTheme.shapes.large),
                    enableAnalysis = true,
                    onAnalyze = { input, proxy ->
                        if (capture.value) {
                            capture.value = false
                            TextRecognitionHelper.recognize(input, proxy) { result ->
                                texto = result
                                if (result.isNotEmpty()) tts.speak(result)
                            }
                        } else proxy.close()
                    }
                )
                InfoCard(
                    title = "Documento capturado",
                    body = texto.ifEmpty { "Pulsa \"Capturar documento\" para escanear." }
                )
                PrimaryButton("Capturar documento", onClick = { capture.value = true })
                TonalButton("Leer con voz", onClick = { tts.speak(texto) }, enabled = texto.isNotEmpty())
            }
        }
    }
}
