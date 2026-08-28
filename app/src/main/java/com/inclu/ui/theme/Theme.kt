package com.inclu.ui.theme

import android.app.Activity
import android.os.Build
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalView

private val DarkColorScheme = darkColorScheme(
    primary = Color(0xFF90CAF9),
    onPrimary = Color(0xFF1A237E),
    primaryContainer = Color(0xFF1A237E),
    onPrimaryContainer = Color(0xFF90CAF9),
    secondary = Color(0xFFB0BEC5),
    onSecondary = Color(0xFF263238),
    background = Color(0xFF1C1B1F),
    onBackground = Color(0xFFE6E1E5),
    surface = Color(0xFF1C1B1F),
    onSurface = Color(0xFFE6E1E5),
    error = Color(0xFFEF5350),
    onError = Color(0xFFFDEDEC),
    tertiary = Color(0xFFE8EAF6)
)

private val LightColorScheme = lightColorScheme(
    primary = Color(0xFF1A237E),
    onPrimary = Color.White,
    primaryContainer = Color(0xFFC5CAE9),
    onPrimaryContainer = Color(0xFF001D39),
    secondary = Color(0xFF546E7A),
    onSecondary = Color(0xFFF5F5F5),
    background = Color(0xFFFFFFFF),
    onBackground = Color(0xFF1A1A1A),
    surface = Color(0xFFFFFFFF),
    onSurface = Color(0xFF1A1A1A),
    error = Color(0xFFD32F2F),
    onError = Color.White,
    tertiary = Color(0xFFE8EAF6)
)

@Composable
fun INCLUTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme
    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}