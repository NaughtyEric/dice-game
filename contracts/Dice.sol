// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title Dice - ETH version
 * @notice No owner/permissions, any address can initialize and pause/unpause
 */
contract Dice is ReentrancyGuard {
    struct GameConfig {
        uint256 minBet;
        uint256 maxBet;
        uint16 houseEdgeBps; // basis points
        bool paused;
    }

    GameConfig public config;
    uint64 public gameCounter;
    address deployer;

    event GamePlayed(address indexed player, uint64 indexed gameId, uint256 betAmount, uint256 roll, uint256 payout);
    event Paused();
    event Unpaused();

    constructor() payable {
        deployer = msg.sender;
    }

    // ─── Initialization ────────────────────────────────────────────────────────
    function initialize(
        uint256 minBet,
        uint256 maxBet,
        uint16 houseEdgeBps
    ) external {
        config.minBet = minBet;
        config.maxBet = maxBet;
        config.houseEdgeBps = houseEdgeBps;
        config.paused = false;
    }

    // ─── Play ─────────────────────────────────────────────────────────────────
    function play(uint8 target, bool rollUnder) external payable nonReentrant {
        require(!config.paused, "Game not active");
        require(target >= 5 && target <= 100, "Invalid target");
        require(msg.value >= config.minBet && msg.value <= config.maxBet, "Bet out of range");

        // Generate random roll (5-100)
        uint256 seed = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, gameCounter)));
        uint256 roll = (seed % 95) + 5;  // 5-100

        // Increment game counter
        uint64 gameId = gameCounter++;

        // Calculate win
        bool won = rollUnder ? (roll < target) : (roll > target);
        uint256 payout = 0;

        if (won) {
            uint256 probability = rollUnder ? uint256(target - 1) : uint256(100 - target);
            uint256 multiplier = (10000 * 10000) / probability;
            if (multiplier > 20000) multiplier = 20000;  // 限制最大赔率
            payout = (msg.value * multiplier) * (10000 - config.houseEdgeBps) / 100000000;

            // 发送 ETH 给玩家
            require(payout <= address(this).balance, "Not enough contract balance");
            (bool sent, ) = msg.sender.call{value: payout}("");
            require(sent, "Payout transfer failed");
        }

        emit GamePlayed(msg.sender, gameId, msg.value, roll, payout);
    }

    // ─── Pause / Unpause ─────────────────────────────────────────────────────
    function pause() external {
        config.paused = true;
        emit Paused();
    }

    function unpause() external {
        config.paused = false;
        emit Unpaused();
    }

    // ─── Withdraw ETH (optional for treasury) ─────────────────────────────────
    function withdraw(uint256 amount) external {
        require(deployer == msg.sender, "Not deployer");
        require(amount <= address(this).balance, "Not enough balance");
        (bool sent, ) = msg.sender.call{value: amount}("");
        require(sent, "Withdraw failed");
    }

    // Fallback to receive ETH
    receive() external payable {}
}
