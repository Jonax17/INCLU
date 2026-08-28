package com.inclu.utils

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Vibrator
import android.os.VibrationEffect
import android.provider.Settings
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import com.inclu.data.model.HapticPattern
import com.inclu.data.model.HapticPatternType

object Constants {
    const val APP_NAME = "INCLU"
    const val VERSION = "1.0"
    const val PERMISSION_REQUEST_CODE = 1001
    const val CAMERA_REQUEST_CODE = 1002
    const val NFC_REQUEST_CODE = 1003
    const val LOCATION_REQUEST_CODE = 1004
    const val BLUETOOTH_REQUEST_CODE = 1005

    val DEMO_PLACES = listOf(
        "LAB_SISTEMAS_01", "BIBLIOTECA_01", "RAMPA_01", "BAÑO_01",
        "ASCENSOR_01", "PARKING_01", "CENTRO_01", "RUTA_01"
    )
}

fun vibrate(context: Context, pattern: List<Pair<Long, Long>>) {
    try {
        val vibrator = context.getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
        val milliseconds = pattern.flatMap { (delay, duration) ->
            listOf(delay, duration)
        }.toLongArray()
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            vibrator.vibrate(VibrationEffect.createWaveform(milliseconds, -1))
        } else {
            vibrator.vibrate(milliseconds, -1)
        }
    } catch (e: Exception) {
        e.printStackTrace()
    }
}

fun vibrateSimple(context: Context, duration: Long) {
    try {
        val vibrator = context.getSystemService(Context.VIBRATOR_SERVICE) as Vibrator
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            vibrator.vibrate(VibrationEffect.createOneShot(duration, VibrationEffect.DEFAULT_AMPLITUDE))
        } else {
            vibrator.vibrate(duration)
        }
    } catch (e: Exception) {
        e.printStackTrace()
    }
}

fun hapticPatternForType(type: HapticPatternType): HapticPattern {
    return when (type) {
        HapticPatternType.LEFT -> HapticPattern.createLeft()
        HapticPatternType.RIGHT -> HapticPattern.createRight()
        HapticPatternType.DANGER -> HapticPattern.createDanger()
        HapticPatternType.STOP -> HapticPattern.createStop()
        HapticPatternType.DESTINATION -> HapticPattern.createDestination()
        HapticPatternType.HELP -> HapticPattern.createHelp()
    }
}

fun speak(context: Context, text: String) {
    try {
        val ttsManager = com.inclu.speech.TTSManager(context)
        ttsManager.speak(text)
    } catch (e: Exception) {
        e.printStackTrace()
    }
}

fun openDialer(context: Context, phoneNumber: String) {
    try {
        val intent = Intent(Intent.ACTION_DIAL, Uri.parse("tel:$phoneNumber"))
        context.startActivity(intent)
    } catch (e: Exception) {
        e.printStackTrace()
    }
}

fun openMaps(context: Context, lat: Double, lng: Double) {
    try {
        val uri = Uri.parse("geo:$lat,$lng?q=$lat,$lng")
        val intent = Intent(Intent.ACTION_VIEW, uri)
        context.startActivity(intent)
    } catch (e: Exception) {
        e.printStackTrace()
    }
}

fun isAccessibilityEnabled(context: Context): Boolean {
    val am = context.getSystemService(Context.ACCESSIBILITY_SERVICE) as android.view.accessibility.AccessibilityManager
    return am.isEnabled
}