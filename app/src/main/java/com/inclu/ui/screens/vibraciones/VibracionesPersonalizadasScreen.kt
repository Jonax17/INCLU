package com.inclu.ui.screens.vibraciones

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import com.inclu.data.model.CustomHaptic
import com.inclu.data.model.HapticSegment
import com.inclu.ui.components.*
import com.inclu.ui.viewmodels.CustomHapticViewModel
import com.inclu.utils.vibrate

@Composable
fun VibracionesPersonalizadasScreen(
    navController: NavController,
    viewModel: CustomHapticViewModel = viewModel()
) {
    val patterns by viewModel.patterns.collectAsState()
    val context = LocalContext.current
    var name by remember { mutableStateOf("") }
    var editing by remember { mutableStateOf(false) }
    var segments by remember { mutableStateOf(listOf<HapticSegment>()) }
    var amp by remember { mutableStateOf(255) }
    var recording by remember { mutableStateOf(false) }
    var lastTap by remember { mutableStateOf(0L) }

    fun preview() {
        if (segments.isNotEmpty()) vibrate(context, segments)
    }

    IncluScaffold(title = "Vibraciones personalizadas", onBack = { navController.popBackStack() }) { padding ->
        ScreenColumn(padding) {
            if (!editing) {
                InfoCard(title = "Tus vibraciones", body = "Crea patrones unicos y guardalos para usarlos cuando quieras.")
                PrimaryButton("Crear nueva vibracion", onClick = {
                    name = ""
                    segments = listOf(HapticSegment(200, 255))
                    amp = 255
                    recording = false
                    editing = true
                })
                if (patterns.isEmpty()) {
                    InfoCard(title = "Sin vibraciones", body = "Aun no has creado vibraciones personalizadas.")
                }
                patterns.forEach { item ->
                    CustomHapticCard(
                        item = item,
                        onPlay = { vibrate(context, item.segments) },
                        onDelete = { viewModel.delete(item) }
                    )
                }
            } else {
                Text("Editor de vibracion", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
                OutlinedTextField(
                    value = name,
                    onValueChange = { name = it },
                    label = { Text("Nombre") },
                    modifier = Modifier.fillMaxWidth(),
                    singleLine = true
                )
                SectionTitle("Intensidad de los pulsos")
                Slider(value = amp.toFloat(), onValueChange = { amp = it.toInt() }, valueRange = 1f..255f, steps = 50)
                Text("Intensidad: $amp", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)

                SectionTitle("Segmentos (pulso = vibra, pausa = silencio)")
                segments.forEachIndexed { i, s ->
                    Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.fillMaxWidth()) {
                        Text(if (s.amplitude == 0) "Pausa" else "Pulso", modifier = Modifier.width(64.dp))
                        Slider(
                            value = s.duration.toFloat(),
                            onValueChange = { nv ->
                                segments = segments.toMutableList().also { it[i] = s.copy(duration = nv.toLong()) }
                            },
                            valueRange = 50f..800f,
                            steps = 15,
                            modifier = Modifier.weight(1f)
                        )
                        IconButton(onClick = {
                            segments = segments.toMutableList().also { it.removeAt(i) }
                        }) { Icon(Icons.Default.Delete, contentDescription = null) }
                    }
                }
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    TonalButton("+ Pulso", onClick = { segments = segments + HapticSegment(200, amp) })
                    TonalButton("+ Pausa", onClick = { segments = segments + HapticSegment(150, 0) })
                }

                if (recording) {
                    Button(onClick = {
                        val now = System.currentTimeMillis()
                        val gap = (now - lastTap).coerceIn(50, 1200)
                        segments = segments + HapticSegment(gap, 0) + HapticSegment(200, amp)
                        vibrate(context, listOf(HapticSegment(200, amp)))
                        lastTap = now
                    }, modifier = Modifier.fillMaxWidth(), shape = MaterialTheme.shapes.large) {
                        Text("TOCA AL RITMO")
                    }
                    TonalButton("Terminar grabacion", onClick = { recording = false })
                } else {
                    TonalButton("Modo ritmo (grabar tocando)", onClick = {
                        recording = true
                        segments = emptyList()
                        lastTap = System.currentTimeMillis()
                    })
                }

                Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    PrimaryButton("Vista previa", onClick = { preview() }, modifier = Modifier.weight(1f))
                    PrimaryButton(
                        "Guardar",
                        onClick = {
                            if (name.isNotBlank() && segments.isNotEmpty()) {
                                viewModel.save(name, segments)
                                editing = false
                            }
                        },
                        modifier = Modifier.weight(1f),
                        enabled = name.isNotBlank() && segments.isNotEmpty()
                    )
                }
                TonalButton("Cancelar", onClick = { editing = false })
            }
        }
    }
}

@Composable
fun CustomHapticCard(item: CustomHaptic, onPlay: () -> Unit, onDelete: () -> Unit) {
    ElevatedCard(modifier = Modifier.fillMaxWidth(), shape = MaterialTheme.shapes.large) {
        Column(Modifier.padding(16.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                IconContainer(icon = Icons.Default.NotificationsActive, tint = MaterialTheme.colorScheme.primary)
                Spacer(Modifier.width(12.dp))
                Column(Modifier.weight(1f)) {
                    Text(item.name, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                    Text("${item.segments.size} segmentos", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
                }
                IconButton(onClick = onDelete) { Icon(Icons.Default.Delete, contentDescription = null, tint = MaterialTheme.colorScheme.error) }
            }
            Spacer(Modifier.height(12.dp))
            Button(onClick = onPlay, modifier = Modifier.fillMaxWidth(), shape = MaterialTheme.shapes.large) { Text("Reproducir") }
        }
    }
}
