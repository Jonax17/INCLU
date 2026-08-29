package com.inclu.ui.navigation

import androidx.compose.runtime.Composable
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.inclu.ui.screens.dashboard.DashboardScreen
import com.inclu.ui.screens.ver.VerScreen
import com.inclu.ui.screens.escuchar.EscucharScreen
import com.inclu.ui.screens.sentir.SentirScreen
import com.inclu.ui.screens.emergencia.EmergenciaScreen
import com.inclu.ui.screens.escaneador.EscaneadorScreen
import com.inclu.ui.screens.laboratorio_haptic.LaboratorioHapticoScreen
import com.inclu.ui.screens.lector_texto.LectorTextoScreen
import com.inclu.ui.screens.lupa.LupaScreen
import com.inclu.ui.screens.mapa.MapaScreen
import com.inclu.ui.screens.modo_tactil.ModoTactilScreen
import com.inclu.ui.screens.orientarme.OrientarmeScreen
import com.inclu.ui.screens.dispositivos.DispositivosScreen
import com.inclu.ui.screens.accesibilidad.AccesibilidadScreen
import com.inclu.ui.screens.codigo_qr.CodigoQrScreen
import com.inclu.ui.screens.demo.DemoScreen
import com.inclu.ui.viewmodels.DashboardViewModel
import com.inclu.ui.viewmodels.SettingsViewModel
import com.inclu.ui.viewmodels.HapticViewModel
import com.inclu.ui.viewmodels.SpeechViewModel

sealed class ScreenRoute(val route: String) {
    object Dashboard : ScreenRoute("dashboard")
    object Ver : ScreenRoute("ver")
    object Escuchar : ScreenRoute("escuchar")
    object Sentir : ScreenRoute("sentir")
    object Orientarme : ScreenRoute("orientarme")
    object Emergencia : ScreenRoute("emergencia")
    object Accesibilidad : ScreenRoute("accesibilidad")
    object LectorTexto : ScreenRoute("lector_texto")
    object Lupa : ScreenRoute("lupa")
    object Escaneador : ScreenRoute("escaneador")
    object LaboratorioHaptico : ScreenRoute("laboratorio_haptic")
    object ModoTactil : ScreenRoute("modo_tactil")
    object Mapa : ScreenRoute("mapa")
    object Dispositivos : ScreenRoute("dispositivos")
    object CodigoQr : ScreenRoute("codigo_qr")
    object Demo : ScreenRoute("demo")
}

@Composable
fun INCLUNavigation(
    dashboardViewModel: DashboardViewModel = androidx.lifecycle.viewmodel.compose.viewModel(),
    settingsViewModel: SettingsViewModel = androidx.lifecycle.viewmodel.compose.viewModel(),
    hapticViewModel: HapticViewModel = androidx.lifecycle.viewmodel.compose.viewModel(),
    speechViewModel: SpeechViewModel = androidx.lifecycle.viewmodel.compose.viewModel()
) {
    val navController = rememberNavController()

    NavHost(navController = navController, startDestination = ScreenRoute.Dashboard.route) {
        composable(ScreenRoute.Dashboard.route) {
            DashboardScreen(
                navController = navController,
                dashboardViewModel = dashboardViewModel,
                settingsViewModel = settingsViewModel
            )
        }
        composable(ScreenRoute.Ver.route) {
            VerScreen(navController = navController)
        }
        composable(ScreenRoute.Escuchar.route) {
            EscucharScreen(navController = navController, speechViewModel = speechViewModel)
        }
        composable(ScreenRoute.Sentir.route) {
            SentirScreen(
                navController = navController,
                hapticViewModel = hapticViewModel
            )
        }
        composable(ScreenRoute.Orientarme.route) {
            OrientarmeScreen(navController = navController)
        }
        composable(ScreenRoute.Emergencia.route) {
            EmergenciaScreen(navController = navController, settingsViewModel = settingsViewModel)
        }
        composable(ScreenRoute.Accesibilidad.route) {
            AccesibilidadScreen(settingsViewModel = settingsViewModel)
        }
        composable(ScreenRoute.LectorTexto.route) {
            LectorTextoScreen(navController = navController)
        }
        composable(ScreenRoute.Lupa.route) {
            LupaScreen(navController = navController)
        }
        composable(ScreenRoute.Escaneador.route) {
            EscaneadorScreen(navController = navController)
        }
        composable(ScreenRoute.LaboratorioHaptico.route) {
            LaboratorioHapticoScreen(navController = navController, hapticViewModel = hapticViewModel)
        }
        composable(ScreenRoute.ModoTactil.route) {
            ModoTactilScreen(navController = navController, hapticViewModel = hapticViewModel)
        }
        composable(ScreenRoute.Mapa.route) {
            MapaScreen(navController = navController)
        }
        composable(ScreenRoute.Dispositivos.route) {
            DispositivosScreen(navController = navController)
        }
        composable(ScreenRoute.CodigoQr.route) {
            CodigoQrScreen(navController = navController)
        }
        composable(ScreenRoute.Demo.route) {
            DemoScreen(navController = navController)
        }
    }
}