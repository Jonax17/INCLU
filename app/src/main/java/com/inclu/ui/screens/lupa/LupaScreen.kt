package com.inclu.ui.screens.lupa

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import com.inclu.ui.components.*

@Composable
fun LupaScreen(navController: NavController) {
    var zoom by remember { mutableStateOf(1f) }
    var inverted by remember { mutableStateOf(false) }

    IncluScaffold(title = "Lupa inteligente", onBack = { navController.popBackStack() }) { padding ->
        ScreenColumn(padding) {
            InfoCard(
                title = "Vista ampliada",
                body = "Zoom: ${"%.1f".format(zoom)}x  ·  ${if (inverted) "Colores invertidos" else "Colores normales"}"
            )
            ElevatedCard(modifier = Modifier.fillMaxWidth(), shape = MaterialTheme.shapes.large) {
                Column(Modifier.padding(16.dp)) {
                    Text("Zoom", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                    Slider(value = zoom, onValueChange = { zoom = it }, valueRange = 1f..3f)
                }
            }
            SettingToggle("Invertir colores", checked = inverted, onCheckedChange = { inverted = it })
            SettingToggle("Texto grande", checked = false, onCheckedChange = { })
            SettingToggle("Alto contraste", checked = false, onCheckedChange = { })
        }
    }
}
