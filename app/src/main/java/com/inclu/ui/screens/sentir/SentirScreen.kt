
package com.inclu.ui.screens.sentir

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
fun SentirScreen(navController: NavController, hapticViewModel: HapticViewModel) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("📳 Sentir") },
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
            Text("Laboratorio Háptico", fontSize = 24.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(16.dp))
            HapticPatternCard("I Z Q U I E R D A", "Una vibración corta → Izquierda", hapticViewModel, HapticPatternType.LEFT)
            HapticPatternCard("D E R E C H A", "Dos vibraciones cortas → Derecha", hapticViewModel, HapticPatternType.RIGHT)
            HapticPatternCard("P E L I G R O", "Tres vibraciones → Peligro", hapticViewModel, HapticPatternType.DANGER)
            HapticPatternCard("D E T E N E R", "Vibración larga → Detenerse", hapticViewModel, HapticPatternType.STOP)
            HapticPatternCard("D E S T I N O", "Dos vibraciones largas → Destino cercano", hapticViewModel, HapticPatternType.DESTINATION)
            HapticPatternCard("A Y U D A", "Patrón de ayuda", hapticViewModel, HapticPatternType.HELP)
        }
    }
}

@Composable
fun HapticPatternCard(name: String, description: String, hapticViewModel: HapticViewModel, type: HapticPatternType) {
    Card(
        onClick = { hapticViewModel.playPattern(type) },
        modifier = Modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
        shape = MaterialTheme.shapes.large
    ) {
        Row(modifier = Modifier.padding(16.dp), verticalAlignment = Alignment.CenterVertically) {
            Text(name, fontSize = 20.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(end = 16.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(description, fontSize = 14.sp, color = Color.Gray)
            }
        }
    }
}
