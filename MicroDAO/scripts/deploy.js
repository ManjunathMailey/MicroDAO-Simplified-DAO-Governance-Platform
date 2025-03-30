// scripts/deploy.js
const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying SimpleDAO contract...");

  // Get the ContractFactory
  const SimpleDAO = await ethers.getContractFactory("SimpleDAO");
  
  // Deploy with constructor arguments
  const simpleDAO = await SimpleDAO.deploy(
    "MicroDAO", 
    "A simplified DAO platform for community governance"
  );

  // Wait for deployment to complete
  await simpleDAO.deployed();

  console.log("SimpleDAO deployed to:", simpleDAO.address);
  console.log("Transaction hash:", simpleDAO.deployTransaction.hash);
  
  // Verify deployment parameters
  console.log("\nVerifying deployment parameters:");
  console.log("DAO Name:", await simpleDAO.name());
  console.log("DAO Purpose:", await simpleDAO.purpose());
  console.log("Admin Address:", await simpleDAO.admin());
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });