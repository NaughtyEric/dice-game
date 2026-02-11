import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);

  const Dice = await ethers.getContractFactory("Dice");
  const dice = await Dice.deploy({
    value: ethers.utils.parseEther("0.04")  // 注入 0.02 ETH
  });

  // 初始化参数
  const minBet = ethers.utils.parseEther("0.0001");  // 最小下注
  const maxBet = ethers.utils.parseEther("1");     // 最大下注
  const houseEdgeBps = 1000;                       // 10% 庄家抽水

  const tx = await dice.initialize(minBet, maxBet, houseEdgeBps);
  await tx.wait();

  console.log("Dice initialized with:");
  console.log("  Min Bet:", minBet.toString());
  console.log("  Max Bet:", maxBet.toString());
  console.log("  House Edge (bps):", houseEdgeBps);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
