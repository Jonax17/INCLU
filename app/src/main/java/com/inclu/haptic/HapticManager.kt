package com.inclu.haptic

import android.content.Context
import android.os.Build
import android.os.VibrationEffect
import android.os.Vibrator

class HapticManager(context: Context) {
    private val vibrator = context.getSystemService(Context.VIBRATOR_SERVICE) as Vibrator

    fun playPattern(pattern: List<Pair<Long, Long>>) {
        try {
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

    fun playSimple(duration: Long) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                vibrator.vibrate(VibrationEffect.createOneShot(duration, VibrationEffect.DEFAULT_AMPLITUDE))
            } else {
                vibrator.vibrate(duration)
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}