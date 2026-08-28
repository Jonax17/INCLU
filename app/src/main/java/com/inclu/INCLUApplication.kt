package com.inclu

import android.app.Application
import com.inclu.data.repository.PlacesRepository
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch

class INCLUApplication : Application() {
    override fun onCreate() {
        super.onCreate()
        CoroutineScope(Dispatchers.IO).launch {
            try {
                PlacesRepository(applicationContext).addDemoPlaces()
            } catch (e: Exception) {
                e.printStackTrace()
            }
        }
    }
}
