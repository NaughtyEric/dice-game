<script setup>
import { ref } from "vue"
import Cookies from "js-cookie"
import { SEPOLIA_CHAIN_ID } from "../config/dice"

const account = ref(null)
const avatarUrl = ref("")
const showHistory = ref(false)
const historyData = ref([])

async function connect() {
  if (!window.ethereum) {
    alert("请先安装 MetaMask")
    return
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    })

    const chainId = await window.ethereum.request({
      method: "eth_chainId",
    })

    if (chainId !== SEPOLIA_CHAIN_ID) {
      alert("请切换到 Sepolia 测试网")
      return
    }

    account.value = accounts[0]
    loadHistory()
  } catch (err) {
    console.error(err)
    alert("连接失败")
  }
}

function toggleHistory() {
  showHistory.value = !showHistory.value
  if (showHistory.value) loadHistory()
}

// 从 Cookies 读取历史
function loadHistory() {
  const cookieKey = `dice_history_${account.value}`
  const historyJson = Cookies.get(cookieKey)
  if (historyJson) {
    historyData.value = JSON.parse(historyJson)
  } else {
    historyData.value = []
  }
}
</script>

<template>
  <nav class="top-nav">
    <div class="logo">🎲 Fate’s Dice</div>

    <div class="wallet">
      <button v-if="!account" class="connect-btn" @click="connect">
        Connect Wallet
      </button>

      <div v-else class="account-info">
        <span class="address">{{ account.slice(0,6) }}...{{ account.slice(-4) }}</span>
        <button class="history-btn" @click="toggleHistory">History</button>
      </div>
    </div>

    <!-- 历史悬浮窗 -->
    <div v-if="showHistory" class="history-popup">
      <h3>🎲 Game History</h3>
      <div v-if="historyData.length === 0">No history yet</div>
      <ul v-else>
        <li v-for="(item, index) in historyData" :key="index">
          <span>{{ new Date(item.time).toLocaleTimeString() }}</span>：
          Bet {{ item.bet }} ETH, Target {{ item.target }},
          {{ item.rollUnder ? "UNDER" : "OVER" }},
          Rolled {{ item.roll }}, Payout {{ item.payout }}
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
.top-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 25px;
  background: #1a1a2e;
  box-shadow: 0 0 15px #4e4eff88;
  color: #eee;
  font-family: "Orbitron", sans-serif;
  position: relative;
  z-index: 10;
}

.logo {
  font-size: 1.5rem;
  color: #ffdd55;
  text-shadow: 0 0 8px #ffdd55aa;
}

.wallet {
  display: flex;
  align-items: center;
  gap: 10px;
}

.connect-btn, .history-btn {
  padding: 6px 12px;
  background: #4e4eff;
  color: #fff;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s ease;
  text-shadow: 0 0 4px #000;
}

.connect-btn:hover, .history-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 15px #4e4effaa;
}

.account-info {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #2a2a40;
  padding: 5px 12px;
  border-radius: 15px;
  box-shadow: 0 0 8px #4e4eff88;
}


.address {
  font-weight: bold;
  color: #ffdd55;
  text-shadow: 0 0 4px #000;
  font-size: 0.9rem;
}

/* 历史悬浮窗 */
.history-popup {
  position: absolute;
  top: 60px;
  right: 10px;
  width: 300px;
  max-height: 400px;
  overflow-y: auto;
  background: #1a1a2e;
  border: 1px solid #4e4eff;
  border-radius: 15px;
  padding: 15px;
  box-shadow: 0 0 20px #4e4eff88;
  z-index: 100;
}

.history-popup h3 {
  margin-top: 0;
  margin-bottom: 10px;
  text-align: center;
  color: #ffdd55;
}

.history-popup ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.history-popup li {
  font-size: 0.8rem;
  margin-bottom: 5px;
  line-height: 1.2;
}
</style>
