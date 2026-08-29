package com.inclu.data.repository

import android.content.Context
import com.inclu.data.db.DatabaseProvider
import com.inclu.data.db.CustomHapticDao
import com.inclu.data.model.CustomHaptic
import kotlinx.coroutines.flow.Flow

class HapticRepository(context: Context) {
    private val dao: CustomHapticDao = DatabaseProvider.getDatabase(context).customHapticDao()

    fun getAll(): Flow<List<CustomHaptic>> = dao.getAll()

    suspend fun insert(item: CustomHaptic) = dao.insert(item)

    suspend fun delete(item: CustomHaptic) = dao.delete(item)
}
