package com.inclu.vision

import androidx.camera.core.ImageProxy
import com.google.mlkit.vision.common.InputImage
import com.google.mlkit.vision.text.TextRecognition
import com.google.mlkit.vision.text.latin.TextRecognizerOptions

object TextRecognitionHelper {
    private val recognizer = TextRecognition.getClient(TextRecognizerOptions.DEFAULT_OPTIONS)

    fun recognize(inputImage: InputImage, proxy: ImageProxy, onResult: (String) -> Unit) {
        recognizer.process(inputImage)
            .addOnSuccessListener { visionText -> onResult(visionText.text.trim()) }
            .addOnFailureListener { onResult("") }
            .addOnCompleteListener { proxy.close() }
    }
}
