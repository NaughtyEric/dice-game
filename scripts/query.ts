import { ethers } from "ethers";
const DiceABI = [
  {
    "inputs": [],
    "stateMutability": "payable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "player",
        "type": "address"
      },
      {
        "indexed": true,
        "internalType": "uint64",
        "name": "gameId",
        "type": "uint64"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "betAmount",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "roll",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "payout",
        "type": "uint256"
      }
    ],
    "name": "GamePlayed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [],
    "name": "Paused",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [],
    "name": "Unpaused",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "config",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "minBet",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "maxBet",
        "type": "uint256"
      },
      {
        "internalType": "uint16",
        "name": "houseEdgeBps",
        "type": "uint16"
      },
      {
        "internalType": "bool",
        "name": "paused",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "gameCounter",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "minBet",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "maxBet",
        "type": "uint256"
      },
      {
        "internalType": "uint16",
        "name": "houseEdgeBps",
        "type": "uint16"
      }
    ],
    "name": "initialize",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "pause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint8",
        "name": "target",
        "type": "uint8"
      },
      {
        "internalType": "bool",
        "name": "rollUnder",
        "type": "bool"
      }
    ],
    "name": "play",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "unpause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "amount",
        "type": "uint256"
      }
    ],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
]

const DICE_ADDRESS = "0x355Ed4721D2f4a9e8d428071DAA0B7ef9186D268";

async function getConfig() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(DICE_ADDRESS, DiceABI, provider);

  const config = await contract.config();
  console.log("Min Bet:", ethers.utils.formatEther(config.minBet));
  console.log("Max Bet:", ethers.utils.formatEther(config.maxBet));
  console.log("House Edge (bps):", config.houseEdgeBps);
  console.log("Paused:", config.paused);
}

async function initDice() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner(); // 🔑 必须用 signer 发交易
  const contract = new ethers.Contract(DICE_ADDRESS, DiceABI, signer);

  const minBet = ethers.utils.parseEther("0.0001");  // 0.0001 ETH
  const maxBet = ethers.utils.parseEther("1");       // 1 ETH
  const houseEdgeBps = 1000;                         // 10% 庄家抽水

  try {
    const tx = await contract.initialize(minBet, maxBet, houseEdgeBps);
    console.log("Transaction sent, waiting confirmation...");
    await tx.wait();
    console.log("Dice initialized with:");
    console.log("  Min Bet:", ethers.utils.formatEther(minBet));
    console.log("  Max Bet:", ethers.utils.formatEther(maxBet));
    console.log("  House Edge (bps):", houseEdgeBps);
  } catch (err) {
    console.error("初始化失败:", err);
  }
}


async function withdraw(amountEth) {
  if (!window.ethereum) {
    alert("请先安装 MetaMask");
    return;
  }

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(DICE_ADDRESS, DiceABI, signer);

  // 将 ETH 转为 wei
  const amountWei = ethers.utils.parseEther(amountEth.toString());

  try {
    const tx = await contract.withdraw(amountWei);
    console.log("提现交易已发送，等待确认...");
    await tx.wait();
    console.log(`成功提现 ${amountEth} ETH`);
  } catch (err) {
    console.error("提现失败:", err);
  }
}

// 调用示例：提取 0.01 ETH
initDice()

