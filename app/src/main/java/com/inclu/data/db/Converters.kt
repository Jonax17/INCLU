package com.inclu.data.db

import androidx.room.TypeConverter
import com.google.gson.Gson
import com.google.gson.reflect.TypeToken
import com.inclu.data.model.BleDeviceType
import com.inclu.data.model.HapticSegment
import com.inclu.data.model.PlaceType

class Converters {
    private val gson = Gson()

    @TypeConverter
    fun fromProfilesSet(set: Set<String>): String = gson.toJson(set)

    @TypeConverter
    fun toProfilesSet(json: String): Set<String> {
        val type = object : TypeToken<Set<String>>() {}.type
        return gson.fromJson(json, type) ?: emptySet()
    }

    @TypeConverter
    fun fromPlaceType(type: PlaceType): String = type.name

    @TypeConverter
    fun toPlaceType(value: String): PlaceType = PlaceType.valueOf(value)

    @TypeConverter
    fun fromBleDeviceType(type: BleDeviceType): String = type.name

    @TypeConverter
    fun toBleDeviceType(value: String): BleDeviceType = BleDeviceType.valueOf(value)

    @TypeConverter
    fun fromHapticSegments(list: List<HapticSegment>): String = gson.toJson(list)

    @TypeConverter
    fun toHapticSegments(json: String): List<HapticSegment> {
        val type = object : TypeToken<List<HapticSegment>>() {}.type
        return gson.fromJson(json, type) ?: emptyList()
    }
}
