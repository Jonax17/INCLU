package com.inclu.data.model

data class HapticSegment(val duration: Long, val amplitude: Int)

data class HapticPattern(
    val type: HapticPatternType? = null,
    val name: String,
    val icon: String,
    val description: String,
    val segments: List<HapticSegment>
) {
    fun timings(): LongArray = segments.map { it.duration }.toLongArray()
    fun amplitudes(): IntArray = segments.map { it.amplitude.coerceIn(0, 255) }.toIntArray()
}

fun seg(duration: Long, amplitude: Int) = HapticSegment(duration, amplitude)
fun pause(ms: Long) = HapticSegment(ms, 0)

enum class HapticPatternType(val label: String) {
    LEFT("Izquierda"),
    RIGHT("Derecha"),
    FORWARD("Adelante"),
    BACK("Atras"),
    UP("Arriba"),
    DOWN("Abajo"),
    DANGER("Peligro"),
    STOP("Detenerse"),
    OBSTACLE("Obstaculo"),
    FALL("Caida"),
    HELP("Ayuda"),
    DESTINATION("Destino"),
    ARRIVAL("Llegada"),
    TURN("Giro"),
    YES("Si"),
    NO("No"),
    OK("OK"),
    GO("Vamos"),
    CALL("Llamada"),
    MESSAGE("Mensaje"),
    BATTERY("Bateria baja"),
    NOTIFICATION("Aviso")
}

val BUILT_IN_PATTERNS: List<HapticPattern> = listOf(
    HapticPattern(HapticPatternType.LEFT, "Izquierda", "\u2b05", "Vibracion corta: gira a la izquierda.", listOf(seg(140, 255))),
    HapticPattern(HapticPatternType.RIGHT, "Derecha", "\u27a1", "Dos vibraciones cortas: derecha.", listOf(seg(140, 255), pause(90), seg(140, 255))),
    HapticPattern(HapticPatternType.FORWARD, "Adelante", "\u2b06", "Pulso ascendente: sigue adelante.", listOf(seg(80, 120), pause(60), seg(80, 200), pause(60), seg(80, 255))),
    HapticPattern(HapticPatternType.BACK, "Atras", "\u2b07", "Pulso descendente: retrocede.", listOf(seg(80, 255), pause(60), seg(80, 200), pause(60), seg(80, 120))),
    HapticPattern(HapticPatternType.UP, "Arriba", "\u2b06", "Tres pulsos suaves: arriba.", listOf(seg(60, 90), pause(50), seg(60, 90), pause(50), seg(60, 90))),
    HapticPattern(HapticPatternType.DOWN, "Abajo", "\u2b07", "Un pulso fuerte: abajo.", listOf(seg(220, 255))),
    HapticPattern(HapticPatternType.DANGER, "Peligro", "\u26a0", "Tres pulsos fuertes: peligro.", listOf(seg(160, 255), pause(80), seg(160, 255), pause(80), seg(160, 255))),
    HapticPattern(HapticPatternType.STOP, "Detenerse", "\u26d4", "Vibracion larga: detente.", listOf(seg(600, 255))),
    HapticPattern(HapticPatternType.OBSTACLE, "Obstaculo", "\u26f0", "Pulso corto y largo: obstaculo cercano.", listOf(seg(90, 200), pause(70), seg(300, 200))),
    HapticPattern(HapticPatternType.FALL, "Caida", "\u26d5", "Alerta de caida.", listOf(seg(120, 255), pause(60), seg(120, 255), pause(60), seg(120, 255), pause(60), seg(400, 255))),
    HapticPattern(HapticPatternType.HELP, "Ayuda", "\u1f6d8", "Patron de socorro.", listOf(seg(120, 255), pause(100), seg(120, 255), pause(100), seg(120, 255), pause(100), seg(120, 255), pause(100), seg(120, 255))),
    HapticPattern(HapticPatternType.DESTINATION, "Destino", "\u1f3cd", "Dos pulsos largos: destino cercano.", listOf(seg(500, 255), pause(120), seg(500, 255))),
    HapticPattern(HapticPatternType.ARRIVAL, "Llegada", "\u1f3ec", "Pulso suave y fuerte: llegaste.", listOf(seg(120, 120), pause(80), seg(260, 255))),
    HapticPattern(HapticPatternType.TURN, "Giro", "\u1f504", "Dos pulsos medios: gira.", listOf(seg(120, 180), pause(90), seg(120, 180))),
    HapticPattern(HapticPatternType.YES, "Si", "\u2705", "Un pulso fuerte: confirmacion si.", listOf(seg(220, 255))),
    HapticPattern(HapticPatternType.NO, "No", "\u274c", "Dos pulsos cortos: negacion no.", listOf(seg(80, 220), pause(80), seg(80, 220))),
    HapticPattern(HapticPatternType.OK, "OK", "\u2714", "Un pulso medio: todo bien.", listOf(seg(160, 180))),
    HapticPattern(HapticPatternType.GO, "Vamos", "\u1f3c3", "Tres pulsos rapidos: adelante ya.", listOf(seg(70, 230), pause(50), seg(70, 230), pause(50), seg(70, 230))),
    HapticPattern(HapticPatternType.CALL, "Llamada", "\u1f4de", "Timbre de llamada.", listOf(seg(300, 255), pause(200), seg(300, 255))),
    HapticPattern(HapticPatternType.MESSAGE, "Mensaje", "\u1f4ec", "Doble pulso suave: mensaje.", listOf(seg(90, 160), pause(70), seg(90, 160))),
    HapticPattern(HapticPatternType.BATTERY, "Bateria baja", "\u1f50b", "Pulso lento: bateria baja.", listOf(seg(150, 140), pause(150), seg(150, 140))),
    HapticPattern(HapticPatternType.NOTIFICATION, "Aviso", "\u1f514", "Pulso corto: notificacion.", listOf(seg(100, 200)))
)

fun hapticPatternForType(type: HapticPatternType): HapticPattern =
    BUILT_IN_PATTERNS.first { it.type == type }

val HAPTIC_DIRECTIONS = listOf(HapticPatternType.LEFT, HapticPatternType.RIGHT, HapticPatternType.FORWARD, HapticPatternType.BACK, HapticPatternType.UP, HapticPatternType.DOWN)
val HAPTIC_ALERTS = listOf(HapticPatternType.DANGER, HapticPatternType.STOP, HapticPatternType.OBSTACLE, HapticPatternType.FALL, HapticPatternType.HELP)
val HAPTIC_NAVIGATION = listOf(HapticPatternType.DESTINATION, HapticPatternType.ARRIVAL, HapticPatternType.TURN)
val HAPTIC_COMMUNICATION = listOf(HapticPatternType.YES, HapticPatternType.NO, HapticPatternType.OK, HapticPatternType.GO, HapticPatternType.CALL, HapticPatternType.MESSAGE, HapticPatternType.BATTERY, HapticPatternType.NOTIFICATION)
