<script setup>
import { ref } from "vue"

const displayedNumber = ref(0)  // 当前显示的数字
let animationFrame = null       // 动画控制

// 函数：平滑更新数字
function setResult(target) {

  cancelAnimationFrame(animationFrame)  // 取消之前动画

  const duration = 800         // 动画时长：0.8 秒
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


// 暴露函数给父组件使用
defineExpose({ setResult, displayedNumber })
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
  transition: transform 0.2s ease;
}
</style>
