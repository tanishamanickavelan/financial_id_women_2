const hre = require("hardhat");

async function main() {
  const FinancialID = await hre.ethers.getContractFactory("FinancialID");
  const financialID = await FinancialID.deploy();
  await financialID.deployed();
  console.log("FinancialID deployed to:", financialID.address);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
