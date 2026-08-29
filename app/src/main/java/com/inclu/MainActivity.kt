package com.inclu

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.unit.Density
import androidx.lifecycle.viewmodel.compose.viewModel
import com.inclu.ui.components.LocalLargeButtons
import com.inclu.ui.navigation.INCLUNavigation
import com.inclu.ui.theme.INCLUTheme
import com.inclu.ui.viewmodels.SettingsViewModel

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            val settingsViewModel: SettingsViewModel = viewModel()
            val profile by settingsViewModel.profile.collectAsState()
            val baseDensity = LocalDensity.current

            val scaledDensity = Density(
                baseDensity.density,
                baseDensity.fontScale * profile.fontSizeMultiplier
            )

            CompositionLocalProvider(
                LocalDensity provides scaledDensity,
                LocalLargeButtons provides profile.largeButtons
            ) {
                INCLUTheme(
                    highContrast = profile.highContrast,
                    invert = profile.invertColors
                ) {
                    Surface(
                        modifier = Modifier.fillMaxSize(),
                        color = MaterialTheme.colorScheme.background
                    ) {
                        INCLUNavigation()
                    }
                }
            }
        }
    }
}
