package com.inclu.data.model

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "CustomHaptic")
data class CustomHaptic(
    @PrimaryKey(autoGenerate = true) val id: Int = 0,
    val name: String,
    val segments: List<HapticSegment>
)
