package com.inclu.data.model

enum class HapticPatternType(val label: String) {
    LEFT("Izquierda"),
    RIGHT("Derecha"),
    DANGER("Peligro"),
    STOP("Detenerse"),
    DESTINATION("Destino cercano"),
    HELP("Ayuda")
}

data class HapticPattern(
    val type: HapticPatternType,
    val name: String,
    val icon: String,
    val description: String,
    val pattern: List<Pair<Long, Long>>
) {
    companion object {
        fun createLeft(): HapticPattern = HapticPattern(type = HapticPatternType.LEFT, name = "Izquierda", icon = "\u2b05", description = "Una vibracion corta indica izquierda.", pattern = listOf(Pair(100L, 50L)))
        fun createRight(): HapticPattern = HapticPattern(type = HapticPatternType.RIGHT, name = "Derecha", icon = "\u27a1", description = "Dos vibraciones cortas indican derecha.", pattern = listOf(Pair(100L, 50L), Pair(100L, 50L)))
        fun createDanger(): HapticPattern = HapticPattern(type = HapticPatternType.DANGER, name = "Peligro", icon = "\u26a0", description = "Tres vibraciones indican peligro.", pattern = listOf(Pair(100L, 50L), Pair(100L, 50L), Pair(100L, 50L)))
        fun createStop(): HapticPattern = HapticPattern(type = HapticPatternType.STOP, name = "Detenerse", icon = "\u1f6d1", description = "Una vibracion larga indica detenerse.", pattern = listOf(Pair(500L, 100L)))
        fun createDestination(): HapticPattern = HapticPattern(type = HapticPatternType.DESTINATION, name = "Destino cercano", icon = "\u1f3cd", description = "Dos vibraciones largas indican destino cercano.", pattern = listOf(Pair(500L, 100L), Pair(500L, 100L)))
        fun createHelp(): HapticPattern = HapticPattern(type = HapticPatternType.HELP, name = "Ayuda", icon = "\u1f6d8", description = "Patron de ayuda.", pattern = listOf(Pair(100L, 50L), Pair(100L, 50L), Pair(100L, 50L), Pair(100L, 50L), Pair(100L, 50L)))
    }
}
