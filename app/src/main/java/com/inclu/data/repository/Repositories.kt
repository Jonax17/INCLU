package com.inclu.data.repository

import android.content.Context
import com.inclu.data.db.DatabaseProvider
import com.inclu.data.db.PlaceDao
import com.inclu.data.db.ProfileDao
import com.inclu.data.db.DeviceDao
import com.inclu.data.model.AccessiblePlace
import com.inclu.data.model.BleDevice
import com.inclu.data.model.UserProfile
import com.inclu.data.model.PlaceType
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first

class SettingsRepository(context: Context) {
    private val profileDao = DatabaseProvider.getDatabase(context).profileDao()

    suspend fun getProfile(): UserProfile {
        return try {
            profileDao.getProfile() ?: UserProfile()
        } catch (e: Exception) {
            UserProfile()
        }
    }

    suspend fun saveProfile(profile: UserProfile) {
        profileDao.insertProfile(profile)
    }
}

class PlacesRepository(context: Context) {
    private val placeDao = DatabaseProvider.getDatabase(context).placeDao()

    fun getAllPlaces(): Flow<List<AccessiblePlace>> = placeDao.getAllPlaces()

    suspend fun addDemoPlaces() {
        val places = listOf(
            AccessiblePlace(
                id = "LAB_SISTEMAS_01",
                name = "Laboratorio de Sistemas",
                description = "Segundo piso. Acceso por rampa.",
                address = "Edificio Académico, 2do piso",
                type = PlaceType.INSTITUTION
            ),
            AccessiblePlace(
                id = "BIBLIOTECA_01",
                name = "Biblioteca Central",
                description = "A 10 metros. Baños accesibles disponibles.",
                address = "Planta baja, aledaña al jardín",
                type = PlaceType.INSTITUTION
            ),
            AccessiblePlace(
                id = "RAMPA_01",
                name = "Rampa principal",
                description = "Rampa de acceso al edificio principal.",
                address = "Entrada principal",
                type = PlaceType.RAMP
            ),
            AccessiblePlace(
                id = "BAÑO_01",
                name = "Baño accesible",
                description = "Baño adaptado en planta baja.",
                address = "Pasillo norte",
                type = PlaceType.ACCESSIBLE_BATHROOM
            ),
            AccessiblePlace(
                id = "ASCENSOR_01",
                name = "Ascensor",
                description = "Ascensor con botones en braille.",
                address = "Hall central",
                type = PlaceType.ELEVATOR
            ),
            AccessiblePlace(
                id = "PARKING_01",
                name = "Estacionamiento accesible",
                description = "Zona de estacionamiento reservada.",
                address = "Nivel B1, lado occidental",
                type = PlaceType.ACCESSIBLE_PARKING
            ),
            AccessiblePlace(
                id = "CENTRO_01",
                name = "Centro de atención",
                description = "Atención prioritaria para personas con discapacidad.",
                address = "Ventanilla de servicios",
                type = PlaceType.HEALTH_CENTER
            ),
            AccessiblePlace(
                id = "RUTA_01",
                name = "Ruta para personas ciegas",
                description = "Sendero táctil desde la entrada hasta el patio.",
                address = "Desde la entrada hasta el patio central",
                type = PlaceType.BLIND_ROUTE
            )
        )
        placeDao.insertAllPlaces(places)
    }
}

class DevicesRepository(context: Context) {
    private val deviceDao = DatabaseProvider.getDatabase(context).deviceDao()

    fun getAllDevices(): Flow<List<BleDevice>> = deviceDao.getAllDevices()

    suspend fun saveDevice(device: BleDevice) {
        deviceDao.insertDevice(device)
    }

    suspend fun updateDevice(device: BleDevice) {
        deviceDao.updateDevice(device)
    }
}