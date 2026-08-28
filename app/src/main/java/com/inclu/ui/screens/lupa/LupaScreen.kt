package com.inclu.ui.screens.lupa

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
import com.inclu.ui.components.*

@Composable
fun LupaScreen(navController: NavController) {
    var zoom by remember { mutableStateOf(0f) }
    var granted by remember { mutableStateOf(false) }
    val launcher = rememberLauncherForActivityResult(ActivityResultContracts.RequestPermission()) { granted = it }

    LaunchedEffect(Unit) { launcher.launch(Manifest.permission.CAMERA) }

    IncluScaffold(title = "Lupa inteligente", onBack = { navController.popBackStack() }) { padding ->
        ScreenColumn(padding) {
            if (!granted) {
                InfoCard(title = "Permiso de cámara", body = "INCLU usa la cámara como lupa para aumentar lo que ves.")
                PrimaryButton("Conceder permiso", onClick = { launcher.launch(Manifest.permission.CAMERA) })
            } else {
                val camera = CameraPreview(
                    modifier = Modifier.fillMaxWidth().height(320.dp).clip(MaterialTheme.shapes.large),
                    enableAnalysis = false
                )
                LaunchedEffect(zoom, camera) { camera?.cameraControl?.setLinearZoom(zoom) }
                InfoCard(
                    title = "Lupa",
                    body = "Acercamiento: ${(zoom * 100).toInt()}%"
                )
                Slider(value = zoom, onValueChange = { zoom = it }, valueRange = 0f..1f)
                Text(
                    "Desliza para acercar la cámara en tiempo real.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}
