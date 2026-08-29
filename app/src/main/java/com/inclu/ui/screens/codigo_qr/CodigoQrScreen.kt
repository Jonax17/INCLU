package com.inclu.ui.screens.codigo_qr

import android.Manifest
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.inclu.camera.BarcodeScannerPreview
import com.inclu.speech.TTSManager
import com.inclu.ui.components.*

@Composable
fun CodigoQrScreen(navController: NavController) {
    var scanned by remember { mutableStateOf<String?>(null) }
    val context = LocalContext.current
    val tts = remember { TTSManager(context) }
    var granted by remember { mutableStateOf(false) }
    val launcher = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) { granted = it }

    LaunchedEffect(Unit) {
        launcher.launch(Manifest.permission.CAMERA)
        tts.initialize()
    }
    DisposableEffect(Unit) { onDispose { tts.shutdown() } }

    fun infoFor(code: String): String {
        return when (code) {
            "INCLU-AULA-101" -> "Aula 101: entrada sin desnivel y asiento reservado al fondo."
            "INCLU-BANO-2" -> "Bano accesible: pasamanos a ambos lados y senalizacion en braille."
            else -> "Punto de interes: $code"
        }
    }

    IncluScaffold(title = "Navegacion Interior", onBack = { navController.popBackStack() }) { padding ->
        ScreenColumn(padding) {
            if (!granted) {
                InfoCard(title = "Permiso de camara", body = "INCLU usa la camara para leer codigos QR/NFC de ubicaciones.")
                PrimaryButton("Conceder permiso", onClick = { launcher.launch(Manifest.permission.CAMERA) })
            } else if (scanned == null) {
                BarcodeScannerPreview(
                    onScanned = { scanned = it },
                    modifier = Modifier.fillMaxWidth().height(320.dp).clip(MaterialTheme.shapes.large)
                )
                InfoCard(title = "Escanea un codigo", body = "Apunta al QR de la ubicacion para obtener informacion accesible.")
            } else {
                val info = infoFor(scanned!!)
                InfoCard(title = "Informacion del punto", body = "$info\n\nCodigo: $scanned")
                PrimaryButton("Leer en voz alta", onClick = { tts.speak(info) })
                TonalButton("Escanear otro", onClick = { scanned = null })
            }
        }
    }
}
