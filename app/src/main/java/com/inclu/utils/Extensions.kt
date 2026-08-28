package com.inclu.utils

import android.app.Activity
import android.os.Build
import android.view.View
import android.view.Window

object StatusBarUtils {
    fun setStatusBarColor(activity: Activity) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                val window: Window = activity.window
                window.statusBarColor = android.graphics.Color.parseColor("#1A237E")
                window.navigationBarColor = android.graphics.Color.parseColor("#FFFFFF")
                window.decorView.systemUiVisibility =
                    View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR
            }
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}