package com.inclu.ui.screens.dashboard

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.inclu.ui.navigation.ScreenRoute
import com.inclu.ui.viewmodels.DashboardViewModel
import com.inclu.ui.viewmodels.SettingsViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DashboardScreen(
    navController: NavController,
    dashboardViewModel: DashboardViewModel,
    settingsViewModel: SettingsViewModel
) {
    val profile by dashboardViewModel.currentProfile.collectAsState()
    val placesCount by dashboardViewModel.placesCount.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text("INCLU", fontWeight = FontWeight.Bold, fontSize = 24.sp)
                        Text("Tecnología que incluye.", fontSize = 12.sp)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color.White,
                    titleContentColor = Color.Black
                )
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
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color(0xFFE8EAF6))
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Modo: $profile", fontSize = 16.sp, fontWeight = FontWeight.Medium)
                    Text("$placesCount lugares accesibles", fontSize = 14.sp, color = Color.Gray)
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            Text("Accesos principales", fontSize = 20.sp, fontWeight = FontWeight.Bold)

            Spacer(modifier = Modifier.height(16.dp))

            val items = listOf(
                ScreenItem("👁️ Ver", ScreenRoute.Ver, "Herramientas para personas ciegas y con baja visión"),
                ScreenItem("👂 Escuchar", ScreenRoute.Escuchar, "Herramientas para personas sordas"),
                ScreenItem("📳 Sentir", ScreenRoute.Sentir, "Herramientas hápticas y vibraciones"),
                ScreenItem("🗺️ Orientarme", ScreenRoute.Orientarme, "Navegación y lugares accesibles"),
                ScreenItem("🆘 Emergencia", ScreenRoute.Emergencia, "Ayuda rápida"),
                ScreenItem("⚙️ Accesibilidad", ScreenRoute.Accesibilidad, "Configuración personalizada")
            )

            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                items.forEach { item ->
                    AccessibilityCard(
                        title = item.title,
                        description = item.description,
                        onClick = { navController.navigate(item.route.route) }
                    )
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            Button(
                onClick = { navController.navigate(ScreenRoute.Demo.route) },
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("INCLU DEMO")
            }

            Spacer(modifier = Modifier.height(8.dp))
            Button(
                onClick = { navController.navigate(ScreenRoute.Dispositivos.route) },
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Mis dispositivos")
            }
        }
    }
}

data class ScreenItem(
    val title: String,
    val route: ScreenRoute,
    val description: String
)

@Composable
fun AccessibilityCard(
    title: String,
    description: String,
    onClick: () -> Unit
) {
    Card(
        onClick = onClick,
        modifier = Modifier.fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
        shape = MaterialTheme.shapes.large
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(title, fontSize = 24.sp, modifier = Modifier.padding(end = 16.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(title, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                Text(description, fontSize = 14.sp, color = Color.Gray)
            }
        }
    }
}