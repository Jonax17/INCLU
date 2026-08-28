
package com.inclu.ui.screens.laboratorio_haptic

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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.inclu.data.model.HapticPatternType
import com.inclu.ui.viewmodels.HapticViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun LaboratorioHapticoScreen(navController: NavController, hapticViewModel: HapticViewModel) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Laboratorio Háptico") },
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
            Text("INCLU HAPTIC", fontSize = 24.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(8.dp))
            Text("Lenguaje de vibraciones", fontSize = 14.sp, color = Color.Gray)
            Spacer(modifier = Modifier.height(16.dp))
            HapticButton("⬅️ IZQUIERDA", "Una vibración corta", hapticViewModel, HapticPatternType.LEFT)
            Spacer(modifier = Modifier.height(8.dp))
            HapticButton("➡️ DERECHA", "Dos vibraciones cortas", hapticViewModel, HapticPatternType.RIGHT)
            Spacer(modifier = Modifier.height(8.dp))
            HapticButton("⚠️ PELIGRO", "Tres vibraciones cortas", hapticViewModel, HapticPatternType.DANGER)
            Spacer(modifier = Modifier.height(8.dp))
            HapticButton("🛑 DETENER", "Vibración larga", hapticViewModel, HapticPatternType.STOP)
            Spacer(modifier = Modifier.height(8.dp))
            HapticButton("🏁 DESTINO", "Dos vibraciones largas", hapticViewModel, HapticPatternType.DESTINATION)
            Spacer(modifier = Modifier.height(8.dp))
            HapticButton("🆘 AYUDA", "Patrón de ayuda", hapticViewModel, HapticPatternType.HELP)
        }
    }
}

@Composable
fun HapticButton(label: String, description: String, hapticViewModel: HapticViewModel, type: HapticPatternType) {
    Card(
        onClick = { hapticViewModel.playPattern(type) },
        modifier = Modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
        shape = MaterialTheme.shapes.large
    ) {
        Row(modifier = Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
            Text(label, fontSize = 20.sp, fontWeight = FontWeight.Bold, modifier = Modifier.weight(1f))
            Text(description, fontSize = 14.sp, color = Color.Gray)
        }
    }
}
