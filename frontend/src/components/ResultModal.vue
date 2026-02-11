<script setup>
defineProps(["result"])
const emit = defineEmits(["close"])
</script>

<template>
  <div class="overlay">
    <div class="modal">
      <h2>🎲 Result</h2>
      <p>Roll: {{ result.roll }}</p>
      <p>Payout: {{ result.payout }} ETH</p>
      <button @click="emit('close')">Close</button>
    </div>
  </div>
</template>

<style>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background: #111;
  padding: 30px;
  border-radius: 16px;
}
</style>
