package com.inclu.camera

import android.content.Context
import android.content.ContextWrapper
import android.util.Log
import androidx.camera.core.*
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.ContextCompat
import androidx.lifecycle.LifecycleOwner
import com.google.mlkit.vision.common.InputImage

private fun Context.findLifecycleOwner(): LifecycleOwner? {
    var ctx: Context? = this
    while (ctx != null) {
        if (ctx is LifecycleOwner) return ctx
        ctx = if (ctx is ContextWrapper) ctx.baseContext else null
    }
    return null
}

@Composable
fun CameraPreview(
    modifier: Modifier = Modifier,
    enableAnalysis: Boolean = false,
    onAnalyze: (InputImage, ImageProxy) -> Unit = { _, proxy -> proxy.close() }
): Camera? {
    val context = LocalContext.current
    val lifecycleOwner = remember(context) { context.findLifecycleOwner() }
    val previewView = remember { PreviewView(context) }
    var camera by remember { mutableStateOf<Camera?>(null) }
    val providerFuture = remember { ProcessCameraProvider.getInstance(context) }

    LaunchedEffect(Unit) {
        val owner = lifecycleOwner ?: return@LaunchedEffect
        providerFuture.addListener({
            try {
                val provider = providerFuture.get()
                val preview = Preview.Builder().build().also {
                    it.setSurfaceProvider(previewView.surfaceProvider)
                }
                val selector = CameraSelector.DEFAULT_BACK_CAMERA
                val useCases = mutableListOf<UseCase>(preview)
                if (enableAnalysis) {
                    val analysis = ImageAnalysis.Builder()
                        .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
                        .build()
                    analysis.setAnalyzer(ContextCompat.getMainExecutor(context)) { proxy ->
                        val mediaImage = proxy.image
                        if (mediaImage != null) {
                            val input = InputImage.fromMediaImage(mediaImage, proxy.imageInfo.rotationDegrees)
                            onAnalyze(input, proxy)
                        } else {
                            proxy.close()
                        }
                    }
                    useCases.add(analysis)
                }
                provider.unbindAll()
                camera = provider.bindToLifecycle(owner, selector, *useCases.toTypedArray())
            } catch (e: Exception) {
                Log.e("CameraPreview", "Binding failed", e)
            }
        }, ContextCompat.getMainExecutor(context))
    }

    AndroidView(factory = { previewView }, modifier = modifier)
    return camera
}
