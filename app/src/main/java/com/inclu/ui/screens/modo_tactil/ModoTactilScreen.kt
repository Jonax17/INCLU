
package com.inclu.ui.screens.modo_tactil

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.inclu.data.model.HapticPatternType
import com.inclu.ui.viewmodels.HapticViewModel
import androidx.compose.ui.platform.LocalContext

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ModoTactilScreen(navController: NavController, hapticViewModel: HapticViewModel) {
    val context = LocalContext.current

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Modo Táctil") },
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
                .padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text("Interacción táctil", fontSize = 16.sp, color = Color.Gray)
            Spacer(modifier = Modifier.height(24.dp))
            BigHapticButton("IZQUIERDA", hapticViewModel, HapticPatternType.LEFT, Color(0xFF2196F3))
            Spacer(modifier = Modifier.height(16.dp))
            BigHapticButton("DERECHA", hapticViewModel, HapticPatternType.RIGHT, Color(0xFF4CAF50))
            Spacer(modifier = Modifier.height(16.dp))
            BigHapticButton("PELIGRO", hapticViewModel, HapticPatternType.DANGER, Color(0xFFD32F2F))
            Spacer(modifier = Modifier.height(16.dp))
            BigHapticButton("DETENER", hapticViewModel, HapticPatternType.STOP, Color(0xFF9E9E9E))
            Spacer(modifier = Modifier.height(16.dp))
            BigHapticButton("AYUDA", hapticViewModel, HapticPatternType.HELP, Color(0xFF9C27B0))
        }
    }
}

@Composable
fun BigHapticButton(label: String, hapticViewModel: HapticViewModel, type: HapticPatternType, color: Color) {
    Button(
        onClick = { hapticViewModel.playPattern(type) },
        modifier = Modifier
            .fillMaxWidth()
            .height(80.dp),
        colors = ButtonDefaults.buttonColors(containerColor = color),
        shape = MaterialTheme.shapes.large
    ) {
        Text(label, fontSize = 24.sp, fontWeight = FontWeight.Bold, color = Color.White)
    }
}
