package com.inclu.data.model

enum class AccessibilityProfile(val label: String) {
    BLIND("Persona ciega"),
    LOW_VISION("Persona con baja vision"),
    DEAF("Persona sorda"),
    DEAF_BLIND("Persona sordociega"),
    MOTOR_IMPAIRMENT("Persona con dificultad motora"),
    GENERAL("Usuario general")
}
