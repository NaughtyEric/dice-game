# Dice Ethereum Smart Contract

A decentralized dice game on Ethereum, implemented in Solidity. Players can place bets with ETH and roll a virtual 5–100 sided dice. The contract supports adjustable house edge and safe payout calculations.

---

## Features

- **Non-uniform payout logic**: Higher-risk bets pay more than low-risk bets.
- **Max payout limit**: Ensures the contract cannot overpay and fail transactions.
- **Reentrancy protection**: Prevents reentrancy attacks using `ReentrancyGuard`.
- **Adjustable game parameters**: Minimum/maximum bets and house edge configurable.
- **Pause/unpause**: Game can be temporarily disabled.
- **Withdrawal**: Deployer can withdraw contract balance.

---

## Contract Details

### Game Rules

- The game simulates 5 D20 dice rolls summed together. Therefore, the result is generated pseudo-randomly in the range **5–100**.
- Players can bet `rollUnder` or `rollOver`:
  - `rollUnder = true`: win if dice < target
  - `rollUnder = false`: win if dice > target
- Payout formula ensures:
  - High-risk bets get higher multipliers
  - Maximum payout capped at **2x**
  - House edge applied in basis points (`houseEdgeBps`)

### Deployment & Initialization

```solidity
// Deploy the contract (payable if needed)
Dice dice = new Dice{value: initialBalance}();

// Initialize game parameters
dice.initialize(
    minBet,      // Minimum ETH bet (wei)
    maxBet,      // Maximum ETH bet (wei)
    houseEdgeBps // House edge in basis points (e.g., 1000 = 10%)
);
```

The deploy script can be found in `scripts/deploy.js`. For other operations, we use `query.js`. [Remix](https://remix.ethereum.org/) was used for initial testing, and is recommended for contract deployment and interaction.

The contract is deployed on Sepolia at: `0x355Ed4721D2f4a9e8d428071DAA0B7ef9186D268`.

## Frontend Details

Frontend is built with Vue.js and ethers.js for interaction with the smart contract. It provides a user-friendly interface for placing bets, viewing game history, and displaying results.

For more details, refer to the [README](frontend/README.md) in the `frontend/` directory.

---

## Code Usage

### Place a Bet

```solidity
dice.play(target, rollUnder, { value: betAmount });
```

- `target`: Number between 5–100
- `rollUnder`: Boolean indicating roll under or over
- `betAmount`: Amount of ETH to bet

**Note:** The contract ensures the bet is within `[minBet, maxBet]` and payout does not exceed contract balance.

### Withdraw ETH (Deployer Only)

```solidity
dice.withdraw(amount);
```

- Withdraw ETH from the contract. Cannot exceed current balance.
- Only the deployer can call this.

### Pause / Unpause

```solidity
dice.pause();   // Disable betting
dice.unpause(); // Enable betting
```

---

## Security Notes

- **Reentrancy**: `play` is protected with `nonReentrant`.
- **Payout Safety**: Maximum multiplier limited; payouts exceeding contract balance will revert.
- **Randomness**: Currently pseudo-random using `keccak256(block.timestamp, msg.sender, gameCounter)`. (Not secure for production.)
- **Minimum Bet**: Low bets (<0.01 ETH) may be truncated to 0 in payout due to integer math; use appropriate minBet.

---

## Frontend Integration

- Listen to `GamePlayed` events to update UI.
- Show `payout` and `roll` visually.
- Ensure users know minimum bet and max payout.

---

## Example

```javascript
import { ethers } from "ethers";
import DiceABI from "./DiceABI.json";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const signer = provider.getSigner();
const dice = new ethers.Contract(DICE_ADDRESS, DiceABI, signer);

// Place a 0.01 ETH bet under 50
const tx = await dice.play(50, true, { value: ethers.utils.parseEther("0.01") });
await tx.wait();

// Listen to GamePlayed events
dice.on("GamePlayed", (player, gameId, betAmount, roll, payout) => {
    console.log(player, gameId.toString(), ethers.utils.formatEther(betAmount), roll.toString(), ethers.utils.formatEther(payout));
});
```
