<template>
  <div>
    <video ref="videoRef" autoplay playsinline class="mx-auto rounded shadow" width="640" height="480" />
    <p class="text-xl font-semibold mt-4">Detected Gesture: {{ gesture }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import * as handpose from '@tensorflow-models/handpose'
import '@tensorflow/tfjs-backend-webgl'

const videoRef = ref(null)
const gesture = ref('None')
let model = null
let intervalId = null

const detectGesture = (landmarks) => {
  if (!landmarks || landmarks.length === 0) return 'None'

  const fingers = {
    thumb: landmarks[4][1] < landmarks[3][1],
    index: landmarks[8][1] < landmarks[6][1],
    middle: landmarks[12][1] < landmarks[10][1],
    ring: landmarks[16][1] < landmarks[14][1],
    pinky: landmarks[20][1] < landmarks[18][1],
  }

  const raised = Object.entries(fingers)
    .filter(([, up]) => up)
    .map(([name]) => name)

  // Counting gestures
  if (raised.length === 1 && raised.includes('index')) return '1'
  if (raised.includes('index') && raised.includes('middle') && raised.length === 2) return '2'
  if (raised.includes('index') && raised.includes('middle') && raised.includes('ring') && raised.length === 3) return '3'
  if (raised.includes('index') && raised.includes('middle') && raised.includes('ring') && raised.includes('pinky') && raised.length === 4) return '4'
  if (raised.length === 5) return '5'

  // Common gestures
  if (raised.includes('index') && raised.includes('middle') && raised.length === 2) return 'Peace ✌️'
  if (raised.includes('index') && raised.includes('pinky') && raised.length === 2) return 'Rock 🤘'
  if (fingers.thumb && fingers.index && !fingers.middle && !fingers.ring && !fingers.pinky) return 'OK 👌'
  if (raised.length === 0) return 'Fist'
  if (fingers.thumb && !fingers.index && !fingers.middle && !fingers.ring && !fingers.pinky) return 'Thumbs Up'

  return `Raised fingers: ${raised.join(', ')}`
}

const setupCamera = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true })
  videoRef.value.srcObject = stream

  return new Promise((resolve) => {
    videoRef.value.onloadedmetadata = () => {
      resolve(videoRef.value)
    }
  })
}

const runDetection = async () => {
  const predictions = await model.estimateHands(videoRef.value)
  if (predictions.length > 0) {
    gesture.value = detectGesture(predictions[0].landmarks)
  } else {
    gesture.value = 'None'
  }
}

onMounted(async () => {
  await setupCamera()
  model = await handpose.load()
  intervalId = setInterval(runDetection, 200)
})

onBeforeUnmount(() => {
  clearInterval(intervalId)
  const tracks = videoRef.value?.srcObject?.getTracks() || []
  tracks.forEach(track => track.stop())
})
</script>