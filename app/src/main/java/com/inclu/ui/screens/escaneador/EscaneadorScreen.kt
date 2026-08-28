package com.inclu.ui.screens.escaneador

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.NavController
import com.inclu.ui.components.*

@Composable
fun EscaneadorScreen(navController: NavController) {
    var texto by remember { mutableStateOf("") }

    IncluScaffold(title = "Escáner de documentos", onBack = { navController.popBackStack() }) { padding ->
        ScreenColumn(padding) {
            InfoCard(
                title = "Captura de documento",
                body = texto.ifEmpty { "Toca \"Capturar documento\" para escanear y leerlo en voz alta." }
            )
            PrimaryButton(text = "Capturar documento", onClick = { })
            TonalButton(text = "Leer con voz", onClick = { }, enabled = texto.isNotEmpty())
        }
    }
}
