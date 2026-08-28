
package com.inclu.nfc

import android.app.Activity
import android.content.Intent
import android.nfc.NfcAdapter
import android.nfc.Tag
import android.os.Bundle
import android.widget.Toast

class NfcManager(private val activity: Activity) {
    private var nfcAdapter: NfcAdapter? = null

    data class NfcTagData(
        val id: String = "",
        val label: String = "",
        val description: String = "",
        val location: String = ""
    )

    fun initialize() {
        nfcAdapter = NfcAdapter.getDefaultAdapter(activity)
        if (nfcAdapter == null) {
            Toast.makeText(activity, "NFC no disponible", Toast.LENGTH_SHORT).show()
        }
    }

    fun isNfcAvailable(): Boolean {
        val adapter = nfcAdapter
        return adapter != null && adapter.isEnabled
    }

    fun enableNfc() {
        // NFC is enabled from device settings / system UI
    }

    fun readTag(tag: Tag): NfcTagData? {
        return try {
            val id = tag.id.joinToString("") { "%02X".format(it) }
            NfcTagData(
                id = id,
                label = "Tag NFC detectado",
                description = "ID: $id",
                location = ""
            )
        } catch (e: Exception) {
            null
        }
    }

    fun handleIntent(intent: Intent) {
        if (NfcAdapter.ACTION_TAG_DISCOVERED == intent.action) {
            val tag = intent.getParcelableExtra<Tag>(NfcAdapter.EXTRA_TAG)
            tag?.let { readTag(it) }
        }
    }
}
