package com.inclu.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "AccessiblePlace")
data class AccessiblePlace(
    @PrimaryKey val id: String = "",
    val name: String = "",
    val description: String = "",
    val address: String = "",
    val type: PlaceType = PlaceType.RAMP,
    val isAccessible: Boolean = true,
    val latitude: Double = 0.0,
    val longitude: Double = 0.0
)

enum class PlaceType(val label: String, val icon: String) {
    RAMP("Rampas", "\u267f"),
    ACCESSIBLE_BATHROOM("Banos accesibles", "\u1f6bb"),
    ELEVATOR("Ascensores", "\u1f699"),
    BLIND_ROUTE("Rutas para personas ciegas", "\u267F"),
    ACCESSIBLE_PARKING("Estacionamientos accesibles", "\u1f195"),
    HEALTH_CENTER("Centros de atencion", "\u1f3e5"),
    INSTITUTION("Instituciones", "\u1f3eb")
}

@Entity(tableName = "BleDevice")
data class BleDevice(
    @PrimaryKey val address: String = "",
    val name: String = "",
    val isConnected: Boolean = false,
    val batteryLevel: Int = 0,
    val deviceType: BleDeviceType = BleDeviceType.BAND
)

enum class BleDeviceType(val label: String) {
    BAND("INCLU Band"),
    CANE("INCLU Cane"),
    GLOVE("INCLU Glove")
}

@Entity(tableName = "UserProfile")
data class UserProfile(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val profiles: Set<String> = emptySet(),
    val fontSizeMultiplier: Float = 1.0f,
    val highContrast: Boolean = false,
    val invertColors: Boolean = false,
    val hapticIntensity: Float = 0.5f,
    val hapticDuration: Long = 100L,
    val voiceEnabled: Boolean = true,
    val largeButtons: Boolean = false,
    val voiceControlEnabled: Boolean = false,
    val emergencyContact: String = ""
)
