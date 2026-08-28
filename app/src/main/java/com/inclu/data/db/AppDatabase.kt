package com.inclu.data.db

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase
import androidx.room.TypeConverters
import com.inclu.data.db.Converters
import com.inclu.data.model.AccessiblePlace
import com.inclu.data.model.BleDevice
import com.inclu.data.model.UserProfile

object DatabaseProvider {
    @Volatile
    private var INSTANCE: AppDatabase? = null

    fun getDatabase(context: Context): AppDatabase {
        return INSTANCE ?: synchronized(this) {
            val instance = Room.databaseBuilder(
                context.applicationContext,
                AppDatabase::class.java,
                "includb"
            ).build()
            INSTANCE = instance
            instance
        }
    }
}

@Database(
    entities = [AccessiblePlace::class, BleDevice::class, UserProfile::class],
    version = 1,
    exportSchema = false
)
@TypeConverters(Converters::class)
abstract class AppDatabase : RoomDatabase() {
    abstract fun placeDao(): PlaceDao
    abstract fun deviceDao(): DeviceDao
    abstract fun profileDao(): ProfileDao
}