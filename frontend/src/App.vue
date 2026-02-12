<script setup>
import DicePanel from "./components/DicePanel.vue"
import WalletConnection from "./components/WalletBar.vue"
import Dice from "@/components/Dice.vue";
import {ref} from "vue";
import Bgm from "@/components/bgm.vue";

const diceResult = ref(null)
const diceRef = ref(null)
const bgmRef = ref(null)

function startDiceRolling() {
  if (diceRef.value) {
    diceRef.value.startRolling()
  }
}

function handleDiceResult(result, isWin) {
  diceResult.value = result.roll
  console.log("收到骰子结果:", result)
  if (diceRef.value) {
    diceRef.value.stopRolling()
    diceRef.value.setResult(result.roll)
  }
  duckingBgm(isWin)
}

function duckingBgm(isWin) {
  if (!bgmRef.value) return

  const normalVolume = 0.25
  const duckVolume = 0.12
  const fadeDuration = 300 // ms

  if (!isWin) {
    // 输 → duck
    bgmRef.value.fadeTo?.(duckVolume, fadeDuration)

    // 2 秒后恢复正常音量
    setTimeout(() => {
      bgmRef.value.fadeTo?.(normalVolume, fadeDuration)
    }, 2000)
  }
}

</script>

<template>
  <!--- Second Dealing - たつろー --->
  <Bgm />
  <div id="app" class="background">
    <!-- 顶部 Wallet Bar -->
    <WalletConnection />

    <!-- 主体布局 -->
    <div class="main-container">
      <div class="spacer left"></div>

      <!-- 左侧骰子动画区域 -->
      <div class="dice-animation">
        <Dice ref="diceRef" />
      </div>

      <div class="spacer middle"></div>

      <div style="display: flex; flex-direction: column;">
        <div class="game-info">
          <h3>🎲 How to Play</h3>
          <p>Roll five 20-sided dice. The closer your total is to the maximum, the bigger your reward!</p>
          <p>Choose a target number and bet your ETH. Roll under or over to win.</p>
        </div>

        <!-- 右侧下注 Panel -->
        <DicePanel @result="handleDiceResult" @start="startDiceRolling"/>
      </div>

      <div class="spacer right"></div>
    </div>
  </div>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  background: #0d0d1a; /* 和 #app 背景一致 */
}

#app {
  min-height: 100vh;
  font-family: "Orbitron", sans-serif;
  color: #eee;
  overflow: hidden;
  background: linear-gradient(180deg, #0d0d1a 0%, #1a1a2e 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 顶部 WalletBar 已在组件内部处理 */
.main-container {
  flex: 1;
  display: flex;
  width: 100%;
  max-width: 1200px; /* 页面主体最大宽度 */
  padding-top: 50px;  /* 顶部 WalletBar 高度预留 */
  align-items: center;
  justify-content: space-between;
}

/* 边距 / 间隔占位 */
.spacer.left {
  flex: 1;
}
.spacer.middle {
  flex: 2;
}
.spacer.right {
  flex: 1;
}

.game-info {
  max-width: 320px;
  background: rgba(255, 255, 255, 0.05);
  padding: 15px 20px;
  border-radius: 16px;
  text-align: left;
  color: #ffdd55;
  font-size: 0.9rem;
  font-family: "Orbitron", sans-serif;
  box-shadow: 0 0 10px #ffdd5588;
}

.game-info h3 {
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  text-shadow: 0 0 6px #000;
}

.game-info p {
  margin: 3px 0;
}

/* 骰子动画区 */
.dice-animation {
  flex: 7;
  height: 400px;  /* 可根据实际设计调整 */
  background: rgba(78,78,255,0.05);
  border-radius: 20px;
  box-shadow: 0 0 20px rgba(78,78,255,0.2);
  display: flex;
  justify-content: center;
  align-items: center;
}

/* DicePanel 保持原有宽度和样式 */
</style>

<!-- 星光和中心光晕保持之前效果 -->
<style scoped>
.background {
  position: relative;
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 星光粒子 */
.background::before {
  content: "";
  position: absolute;
  width: 200%;
  height: 200%;
  top: -50%;
  left: -50%;
  background: radial-gradient(white, transparent 2px) repeat;
  background-size: 5px 5px;
  animation: starMove 60s linear infinite;
  opacity: 0.1;
  pointer-events: none;
}

@keyframes starMove {
  0% { transform: translate(0,0); }
  100% { transform: translate(100px, -100px); }
}

/* 中心光晕效果 */
.background::after {
  content: "";
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,221,85,0.15) 0%, transparent 60%);
  pointer-events: none;
  animation: pulse 3s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 0.15; }
  50% { transform: scale(1.1); opacity: 0.25; }
}
</style>
