<script setup>
defineProps(["result"])
const emit = defineEmits(["close"])
</script>

<template>
  <div class="overlay">
    <div class="modal">
      <h2 class="title">🎲 Dice Result</h2>
      <div class="result-row">
        <span class="label">Roll:</span>
        <span class="value">{{ result?.roll ?? "-" }}</span>
      </div>
      <div class="result-row">
        <span class="label">Payout:</span>
        <span class="value">{{ result?.payout ?? "0" }} ETH</span>
      </div>
      <button class="close-btn" @click="emit('close')">Close</button>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #1a1a2e;
  padding: 30px 40px;
  border-radius: 20px;
  box-shadow: 0 0 30px rgba(255, 221, 85, 0.4);
  display: flex;
  flex-direction: column;
  gap: 20px;
  min-width: 280px;
  text-align: center;
  font-family: "Orbitron", sans-serif;
}

.title {
  font-size: 2rem;
  color: #ffdd55;
  text-shadow: 0 0 8px #ffdd55aa, 0 0 16px #ffdd5577;
  margin-bottom: 10px;
}

.result-row {
  display: flex;
  justify-content: space-between;
  font-size: 1.2rem;
  background: rgba(255, 255, 255, 0.05);
  padding: 10px 15px;
  border-radius: 12px;
}

.label {
  color: #aaa;
  font-weight: bold;
}

.value {
  color: #fff;
  font-weight: bold;
}

.close-btn {
  padding: 12px 20px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(45deg, #ff5555, #ffdd55);
  color: #1a1a2e;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 10px;
}

.close-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px #ffdd55aa;
}
</style>
