<script setup>
import { ref } from "vue"
import { ethers } from "ethers"
import DiceABI from "../config/dice_abi.json"
import { DICE_ADDRESS } from "../config/dice"
import ResultModel from "./ResultModel.vue"

const bet = ref("0.01")
const target = ref(50)
const rollUnder = ref(true)
const loading = ref(false)
const resultData = ref(null)
const emit = defineEmits(["result", "start"])
import Cookies from "js-cookie"

function saveHistory(record) {
  const cookieKey = `dice_history_${account.value}`
  const historyJson = Cookies.get(cookieKey)
  let history = historyJson ? JSON.parse(historyJson) : []
  history.unshift(record)  // 最新在前
  if (history.length > 50) history.pop()  // 最多保存 50 条
  Cookies.set(cookieKey, JSON.stringify(history), { expires: 7 }) // 7 天过期
}

async function play() {
  loading.value = true
  emit('start')

  try {
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()

    const contract = new ethers.Contract(DICE_ADDRESS, DiceABI, signer)

    const tx = await contract.play(
        target.value,
        rollUnder.value,
        { value: ethers.parseEther(bet.value.toString()) }
    )

    const receipt = await tx.wait()

    // 解析事件
    const iface = new ethers.Interface(DiceABI)
    const event = receipt.logs
        .map(log => {
          try { return iface.parseLog(log) }
          catch { return null }
        })
        .find(e => e && e.name === "GamePlayed")

    if (event) {
      resultData.value = {
        roll: event.args.roll.toString(),
        payout: ethers.formatEther(event.args.payout)
      }
      // emit value & win/lose info
      emit('result', resultData.value,
        (rollUnder.value && parseInt(resultData.value.roll) < target.value) ||
        (!rollUnder.value && parseInt(resultData.value.roll) > target.value)
      )

      // --- 存入 Cookie ---
      const account = window.ethereum.selectedAddress
      if (account) {
        const record = {
          time: Date.now(),
          bet: bet.value,
          target: target.value,
          rollUnder: rollUnder.value,
          roll: resultData.value.roll,
          payout: resultData.value.payout
        }

        const cookieKey = `dice_history_${account}`
        const historyJson = Cookies.get(cookieKey)
        let history = historyJson ? JSON.parse(historyJson) : []
        history.unshift(record) // 最新在前
        if (history.length > 50) history.pop() // 最多保存50条
        Cookies.set(cookieKey, JSON.stringify(history), { expires: 7 }) // 7天过期
      }
    }
  } catch (err) {
    console.error(err)
    emit('result', 0, false)
    alert("交易失败或用户拒绝")
  }

  loading.value = false
}

</script>

<template>
  <div class="dice-panel">
    <h2 class="title">🎲 DICE</h2>

    <div class="input-group">
      <label>Bet (ETH)</label>
      <input v-model="bet" type="number" step="0.001" min="0.001" />
    </div>

    <div class="input-group">
      <label>Target</label>
      <input v-model="target" type="number" min="1" max="99" />
    </div>

    <button class="toggle-btn" @click="rollUnder = !rollUnder">
      {{ rollUnder ? "ROLL UNDER" : "ROLL OVER" }}
    </button>

    <button class="play-btn" @click="play" :disabled="loading">
      <span v-if="!loading">PLAY</span>
      <span v-else class="loading">Rolling...</span>
    </button>

    <ResultModel
        v-if="resultData"
        :result="resultData"
        @close="resultData = null"
    />
  </div>
</template>

<style scoped>
.dice-panel {
  width: 320px;
  margin: 50px auto;
  padding: 25px;
  background: #1a1a2e;
  border-radius: 20px;
  box-shadow: 0 0 20px #4e4eff88;
  display: flex;
  flex-direction: column;
  gap: 15px;
  color: #eee;
  font-family: "Orbitron", sans-serif;
}

.title {
  text-align: center;
  font-size: 2rem;
  color: #ffdd55;
  text-shadow: 0 0 8px #ffdd55aa;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

input {
  padding: 8px;
  border-radius: 10px;
  border: none;
  background: #2a2a40;
  color: #fff;
  text-align: center;
  font-size: 1rem;
}

input:focus {
  outline: none;
  box-shadow: 0 0 10px #4e4eff88;
}

.toggle-btn {
  padding: 10px;
  border: none;
  border-radius: 12px;
  background: #4e4eff;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  text-shadow: 0 0 4px #000;
}

.toggle-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px #4e4effaa;
}

.play-btn {
  padding: 15px;
  border: none;
  border-radius: 15px;
  background: linear-gradient(45deg, #ff5555, #ffdd55);
  color: #1a1a2e;
  font-weight: bold;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s ease;
  text-shadow: 0 0 6px #000;
}

.play-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px #ffdd55aa;
}

.play-btn:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.loading {
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50%, 100% { opacity: 1; }
  25%, 75% { opacity: 0; }
}
</style>
