package com.inclu.ui.screens.dashboard

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.navigation.NavController
import com.inclu.ui.components.*
import com.inclu.ui.navigation.ScreenRoute
import com.inclu.ui.viewmodels.DashboardViewModel
import com.inclu.ui.viewmodels.SettingsViewModel

@Composable
fun DashboardScreen(
    navController: NavController,
    dashboardViewModel: DashboardViewModel,
    settingsViewModel: SettingsViewModel
) {
    val profile by dashboardViewModel.currentProfile.collectAsState()
    val placesCount by dashboardViewModel.placesCount.collectAsState()

    IncluScaffold(title = "INCLU") { padding ->
        ScreenColumn(padding) {
            InfoCard(
                title = "Tecnología que incluye",
                body = "Tu centro de accesibilidad. Elige el módulo según lo que necesites."
            )
            InfoCard(
                title = "Modo actual: $profile",
                body = "$placesCount lugares accesibles cerca de ti.",
                containerColor = MaterialTheme.colorScheme.tertiaryContainer,
                contentColor = MaterialTheme.colorScheme.onTertiaryContainer
            )

            SectionTitle("Accesos principales")
            FeatureTile(
                icon = Icons.Default.Visibility,
                title = "Ver",
                description = "Herramientas para personas ciegas y con baja visión",
                onClick = { navController.navigate(ScreenRoute.Ver.route) }
            )
            FeatureTile(
                icon = Icons.Default.GraphicEq,
                title = "Escuchar",
                description = "Herramientas para personas sordas",
                onClick = { navController.navigate(ScreenRoute.Escuchar.route) }
            )
            FeatureTile(
                icon = Icons.Default.Vibration,
                title = "Sentir",
                description = "Lenguaje háptico y vibraciones",
                onClick = { navController.navigate(ScreenRoute.Sentir.route) }
            )
            FeatureTile(
                icon = Icons.Default.Explore,
                title = "Orientarme",
                description = "Mapa y navegación accesible",
                onClick = { navController.navigate(ScreenRoute.Orientarme.route) }
            )
            FeatureTile(
                icon = Icons.Default.Emergency,
                title = "Emergencia",
                description = "Ayuda rápida y alerta SOS",
                onClick = { navController.navigate(ScreenRoute.Emergencia.route) }
            )
            FeatureTile(
                icon = Icons.Default.Accessibility,
                title = "Accesibilidad",
                description = "Configuración personalizada",
                onClick = { navController.navigate(ScreenRoute.Accesibilidad.route) }
            )

            SectionTitle("Dispositivos y más")
            FeatureTile(
                icon = Icons.Default.Bluetooth,
                title = "Mis dispositivos",
                description = "Pulsera, bastón y guante INCLU",
                onClick = { navController.navigate(ScreenRoute.Dispositivos.route) }
            )
            FeatureTile(
                icon = Icons.Default.PlayCircle,
                title = "INCLU Demo",
                description = "Presentación rápida de funciones",
                onClick = { navController.navigate(ScreenRoute.Demo.route) }
            )
        }
    }
}
