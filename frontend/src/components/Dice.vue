<script setup>
import { ref } from "vue"

const displayedNumber = ref(0)

// ====== 平滑动画 ======
let animationFrame = null

function setResult(target) {
  cancelAnimationFrame(animationFrame)
  stopRolling()

  const duration = 800
  const start = displayedNumber.value
  const change = target - start
  const startTime = performance.now()

  function animate(now) {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    displayedNumber.value = Math.floor(start + change * progress)

    if (progress < 1) {
      animationFrame = requestAnimationFrame(animate)
    }
  }

  animationFrame = requestAnimationFrame(animate)
}

// ====== 随机滚动（等待交易用） ======
let rollingTimer = null

function startRolling() {
  stopRolling()

  rollingTimer = setInterval(() => {
    // 5 ~ 100
    displayedNumber.value = Math.floor(Math.random() * 96) + 5
  }, 40)
}

function stopRolling() {
  if (rollingTimer) {
    clearInterval(rollingTimer)
    rollingTimer = null
  }
}

// ====== 对外暴露能力 ======
defineExpose({
  setResult,
  startRolling,
  stopRolling,
  displayedNumber,
})
</script>

<template>
  <div class="dice-result">
    <span>{{ displayedNumber }}</span>
  </div>
</template>

<style scoped>
.dice-result {
  width: 120px;
  height: 120px;
  border-radius: 20px;
  background: linear-gradient(145deg, #4e4eff, #1a1a2e);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3rem;
  font-weight: bold;
  color: #ffdd55;
  text-shadow: 0 0 10px #ffdd55aa;
  box-shadow: 0 0 20px #4e4eff88;
}
</style>
