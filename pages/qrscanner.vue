<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <div id="reader" style="width: 500px"></div>

        <!-- Show Scanned QR Code Output -->
        <v-row class="mt-4" justify="center" v-if="scannedResult">
          <v-alert type="success" variant="outlined">
            ✅ Scanned QR Code: <strong>{{ scannedResult }}</strong>
          </v-alert>
        </v-row>

        <v-row class="mt-4" justify="center" v-if="scanner">
          <v-btn @click="pauseScanner" :disabled="!isRunning">Pause</v-btn>
          <v-btn @click="resumeScanner" :disabled="isRunning">Resume</v-btn>
          <v-btn color="error" @click="stopScanner">Stop</v-btn>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { Html5QrcodeScanner } from 'html5-qrcode'

// Props for configurability
const props = defineProps({
  fps: { type: Number, default: 10 },
  qrbox: {
    type: Object,
    default: () => ({ width: 250, height: 250 })
  }
})

// Emit scanned text to parent
const emit = defineEmits(['scanned', 'error'])

// Local state
const scanner = ref(null)
const isRunning = ref(false)
const mounted = ref(false)
const scannedResult = ref("")   // ✅ Added variable to store result

const onScanSuccess = (decodedText, decodedResult) => {
  isRunning.value = true
  scannedResult.value = decodedText   // ✅ Display scanned result
  emit('scanned', decodedText)
}

const onScanFailure = (err) => {
  console.warn('QR scan failed:', err)
  emit('error', err)
}

onMounted(() => {
  mounted.value = true
  scanner.value = new Html5QrcodeScanner(
    'reader',
    { fps: props.fps, qrbox: props.qrbox },
    false
  )
  scanner.value.render(onScanSuccess, onScanFailure)
})

onBeforeUnmount(() => {
  if (scanner.value) {
    scanner.value.clear().catch((e) => {
      console.warn('Failed to clear html5QrcodeScanner', e)
    })
  }
})

// Control methods
function pauseScanner() {
  if (scanner.value) {
    scanner.value.pause(true)
    isRunning.value = false
  }
}

function resumeScanner() {
  if (scanner.value) {
    scanner.value.resume()
    isRunning.value = true
  }
}

function stopScanner() {
  if (scanner.value) {
    scanner.value.clear()
    isRunning.value = false
    mounted.value = false
  }
}
</script>
