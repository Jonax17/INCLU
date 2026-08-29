package com.inclu.data.db

import androidx.room.*
import kotlinx.coroutines.flow.Flow
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.inclu.data.model.AccessiblePlace
import com.inclu.data.model.BleDevice
import com.inclu.data.model.CustomHaptic
import com.inclu.data.model.UserProfile

@Dao
interface PlaceDao {
    @Query("SELECT * FROM AccessiblePlace ORDER BY name ASC")
    fun getAllPlaces(): Flow<List<AccessiblePlace>>

    @Query("SELECT * FROM AccessiblePlace WHERE id = :id")
    fun getPlaceById(id: String): AccessiblePlace?

    @Query("SELECT * FROM AccessiblePlace WHERE type = :type")
    fun getPlacesByType(type: String): List<AccessiblePlace>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    fun insertPlace(place: AccessiblePlace)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    fun insertAllPlaces(places: List<AccessiblePlace>)

    @Delete
    fun deletePlace(place: AccessiblePlace)
}

@Dao
interface DeviceDao {
    @Query("SELECT * FROM BleDevice")
    fun getAllDevices(): Flow<List<BleDevice>>

    @Query("SELECT * FROM BleDevice WHERE address = :address")
    fun getDeviceByAddress(address: String): BleDevice?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    fun insertDevice(device: BleDevice)

    @Update
    fun updateDevice(device: BleDevice)
}

@Dao
interface ProfileDao {
    @Query("SELECT * FROM UserProfile LIMIT 1")
    suspend fun getProfile(): UserProfile?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    fun insertProfile(profile: UserProfile)

    @Update
    fun updateProfile(profile: UserProfile)
}

@Dao
interface CustomHapticDao {
    @Query("SELECT * FROM CustomHaptic ORDER BY id DESC")
    fun getAll(): Flow<List<CustomHaptic>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insert(item: CustomHaptic)

    @Delete
    suspend fun delete(item: CustomHaptic)
}