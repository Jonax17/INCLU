package com.inclu.ui.screens.dispositivos

import android.Manifest
import android.bluetooth.*
import android.bluetooth.le.ScanCallback
import android.bluetooth.le.ScanResult
import android.bluetooth.le.ScanSettings
import android.content.Context
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
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
import androidx.navigation.NavController
import com.inclu.ui.components.*

data class BleDeviceInfo(val address: String, val name: String, val connected: Boolean)

@Composable
fun DispositivosScreen(navController: NavController) {
    val context = LocalContext.current
    var granted by remember { mutableStateOf(false) }
    val permLauncher = rememberLauncherForActivityResult(ActivityResultContracts.RequestMultiplePermissions()) { res ->
        granted = res[Manifest.permission.BLUETOOTH_SCAN] == true || res[Manifest.permission.BLUETOOTH_CONNECT] == true
    }
    var devices by remember { mutableStateOf(listOf<BleDeviceInfo>()) }
    var scanning by remember { mutableStateOf(false) }
    val gattMap = remember { mutableStateMapOf<String, BluetoothGatt>() }

    val scanner = remember {
        (context.getSystemService(Context.BLUETOOTH_SERVICE) as? BluetoothManager)
            ?.adapter?.bluetoothLeScanner
    }

    val scanCallback = remember {
        object : ScanCallback() {
            override fun onScanResult(callbackType: Int, result: ScanResult?) {
                val dev = result?.device ?: return
                val name = dev.name ?: "Dispositivo INCLU"
                val addr = dev.address
                devices = (devices.filter { it.address != addr } + BleDeviceInfo(addr, name, false))
                    .distinctBy { it.address }
            }
        }
    }

    fun startScan() {
        if (scanner == null) return
        scanning = true
        try {
            scanner.startScan(
                null,
                ScanSettings.Builder().setScanMode(ScanSettings.SCAN_MODE_LOW_LATENCY).build(),
                scanCallback
            )
        } catch (_: Exception) { scanning = false }
    }

    fun stopScan() {
        scanning = false
        try { scanner?.stopScan(scanCallback) } catch (_: Exception) { }
    }

    fun connect(device: BleDeviceInfo) {
        val manager = context.getSystemService(Context.BLUETOOTH_SERVICE) as? BluetoothManager ?: return
        val dev = manager.adapter?.getRemoteDevice(device.address) ?: return
        val gatt = dev.connectGatt(context, false, object : BluetoothGattCallback() {
            override fun onConnectionStateChange(gatt: BluetoothGatt?, status: Int, newState: Int) {
                val connectedNow = newState == BluetoothProfile.STATE_CONNECTED
                devices = devices.map {
                    if (it.address == device.address) it.copy(connected = connectedNow) else it
                }
                if (!connectedNow) {
                    gatt?.close()
                    gattMap.remove(device.address)
                }
            }
        })
        if (gatt != null) gattMap[device.address] = gatt
    }

    LaunchedEffect(Unit) {
        permLauncher.launch(
            arrayOf(Manifest.permission.BLUETOOTH_SCAN, Manifest.permission.BLUETOOTH_CONNECT)
        )
    }
    DisposableEffect(Unit) {
        onDispose {
            stopScan()
            gattMap.values.forEach { it.close() }
        }
    }

    IncluScaffold(title = "Mis dispositivos", onBack = { navController.popBackStack() }) { padding ->
        ScreenColumn(padding) {
            if (!granted) {
                InfoCard(title = "Permiso Bluetooth", body = "INCLU busca tus pulseras, baston y guante INCLU cercanos.")
                PrimaryButton("Conceder permiso", onClick = {
                    permLauncher.launch(
                        arrayOf(Manifest.permission.BLUETOOTH_SCAN, Manifest.permission.BLUETOOTH_CONNECT)
                    )
                })
            } else {
                Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    PrimaryButton(
                        text = if (scanning) "Detener" else "Buscar dispositivos",
                        onClick = { if (scanning) stopScan() else startScan() },
                        modifier = Modifier.weight(1f)
                    )
                    if (scanning) CircularProgressIndicator(modifier = Modifier.align(Alignment.CenterVertically))
                }
                Text(
                    "Dispositivos INCLU cercanos:",
                    style = MaterialTheme.typography.bodyLarge,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                if (devices.isEmpty()) {
                    InfoCard(title = "Sin dispositivos", body = "Pulsa Buscar y acerca tu pulsera, baston o guante INCLU.")
                }
                devices.forEach { DeviceCard(it, onConnect = { connect(it) }) }
            }
        }
    }
}

@Composable
fun DeviceCard(device: BleDeviceInfo, onConnect: () -> Unit) {
    ElevatedCard(modifier = Modifier.fillMaxWidth(), shape = MaterialTheme.shapes.large) {
        Column(Modifier.padding(16.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                IconContainer(icon = Icons.Default.Bluetooth, tint = MaterialTheme.colorScheme.primary)
                Spacer(Modifier.width(12.dp))
                Column(Modifier.weight(1f)) {
                    Text(device.name, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.SemiBold)
                    Text(
                        if (device.connected) "Conectado" else device.address,
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                AssistChip(
                    onClick = { },
                    label = { Text(if (device.connected) "OK" else "---") }
                )
            }
            Spacer(Modifier.height(12.dp))
            Button(
                onClick = onConnect,
                modifier = Modifier.fillMaxWidth(),
                shape = MaterialTheme.shapes.large,
                enabled = !device.connected
            ) {
                Text(if (device.connected) "Conectado" else "Conectar")
            }
        }
    }
}
