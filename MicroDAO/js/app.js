// app.js - Main JavaScript file for MicroDAO Frontend

// Import ethers.js
import { ethers } from "https://cdn.ethers.io/lib/ethers-5.7.esm.min.js";

// Contract ABI and address (would come from deployment)
const DAOContractABI = [
  "function name() view returns (string)",
  "function purpose() view returns (string)",
  "function memberCount() view returns (uint256)",
  "function proposalCount() view returns (uint256)",
  "function votingPeriod() view returns (uint256)",
  "function executionThreshold() view returns (uint256)",
  "function createProposal(string calldata _title, string calldata _description) external",
  "function vote(uint256 _proposalId, bool _inSupport) external",
  "function executeProposal(uint256 _proposalId) external",
  "function getProposalDetails(uint256 _proposalId) external view returns (uint256, address, string memory, string memory, uint256, uint256, uint256, uint256, bool)",
  "function hasVoted(uint256 _proposalId, address _member) external view returns (bool)",
  "function members(address) view returns (bool, uint256, uint256)"
];
const DAOContractAddress = "0x0000000000000000000000000000000000000000"; // Replace with actual contract address after deployment

// Global variables
let provider;
let signer;
let daoContract;
let currentAccount;

// Initialize Web3 connection
async function initWeb3() {
  try {
    // Check if MetaMask is installed
    if (typeof window.ethereum !== "undefined") {
      // Connect to the Ethereum network using MetaMask
      provider = new ethers.providers.Web3Provider(window.ethereum);
      
      // Request account access
      const accounts = await provider.send("eth_requestAccounts", []);
      currentAccount = accounts[0];
      
      // Get the signer
      signer = provider.getSigner();
      
      // Initialize the contract
      daoContract = new ethers.Contract(DAOContractAddress, DAOContractABI, signer);
      
      // Update UI to show connected account
      updateConnectedAccount();
      
      // Load DAO data
      loadDAOData();
      
      // Setup event listeners for contract events
      setupEventListeners();
      
      return true;
    } else {
      console.error("MetaMask is not installed");
      alert("Please install MetaMask to use this dApp");
      return false;
    }
  } catch (error) {
    console.error("Error initializing Web3:", error);
    return false;
  }
}

// Update UI with connected account
function updateConnectedAccount() {
  const connectWalletBtn = document.getElementById("connectWallet");
  if (currentAccount) {
    const shortAddress = `${currentAccount.substring(0, 6)}...${currentAccount.substring(38)}`;
    connectWalletBtn.textContent = shortAddress;
    connectWalletBtn.classList.remove("connect-wallet");
    connectWalletBtn.classList.add("btn-success");
  }
}

// Load DAO data from smart contract
async function loadDAOData() {
  try {
    if (!daoContract) return;
    
    // Load basic DAO information
    const [name, purpose, memberCount, proposalCount] = await Promise.all([
      daoContract.name(),
      daoContract.purpose(),
      daoContract.memberCount(),
      daoContract.proposalCount()
    ]);
    
    // Update DAO information in UI
    document.querySelector(".navbar-brand").textContent = name;
    
    // Update member count
    const memberCountElement = document.querySelector(".card-title:contains('Active Members') + .display-4");
    if (memberCountElement) {
      memberCountElement.textContent = memberCount.toString();
    }
    
    // Update proposal count
    const proposalCountElement = document.querySelector(".card-title:contains('Open Proposals') + .display-4");
    if (proposalCountElement) {
      proposalCountElement.textContent = proposalCount.toString();
    }
    
    // Check user membership status
    const memberInfo = await daoContract.members(currentAccount);
    const isActiveMember = memberInfo[0];
    const tokenBalance = memberInfo[1];
    
    // Update voting power
    const votingPowerElement = document.querySelector(".card-title:contains('Your Voting Power') + .display-4");
    if (votingPowerElement) {
      votingPowerElement.textContent = isActiveMember ? tokenBalance.toString() : "0";
    }
    
    // Load active proposals
    await loadProposals();
  } catch (error) {
    console.error("Error loading DAO data:", error);
  }
}

// Load proposals from smart contract
async function loadProposals() {
  try {
    if (!daoContract) return;
    
    const proposalCount = await daoContract.proposalCount();
    
    // Clear existing proposals (except the "Create New Proposal" card)
    const proposalsContainer = document.querySelector("#proposals").parentElement;
    const createProposalCard = proposalsContainer.querySelector(".border-dashed").parentElement;
    
    // For demo purposes, we're keeping the static proposals
    // In a real application, we would clear all proposals and load them from the contract
    
    // For each proposal in the contract, create and append a proposal card
    // This is just sample code - in the real implementation you would uncomment this
    /*
    for (let i = 0; i < Math.min(proposalCount, 5); i++) {
      const proposalDetails = await daoContract.getProposalDetails(i);
      const [id, creator, title, description, createdAt, votingEndsAt, yesVotes, noVotes, executed] = proposalDetails;
      
      // Check if voting period is still active
      const isActive = Date.now() / 1000 < votingEndsAt;
      
      // Create proposal card
      const proposalCard = createProposalCard(
        id, 
        title, 
        description, 
        isActive ? "Active" : "Closed", 
        yesVotes, 
        noVotes, 
        Math.floor((votingEndsAt - Date.now() / 1000) / 86400) // days remaining
      );
      
      // Insert before the "Create New Proposal" card
      proposalsContainer.insertBefore(proposalCard, createProposalCard);
    }
    */
  } catch (error) {
    console.error("Error loading proposals:", error);
  }
}

// Create a proposal card element (helper function)
function createProposalCard(id, title, description, status, yesVotes, noVotes, daysRemaining) {
  const totalVotes = Number(yesVotes) + Number(noVotes);
  const yesPercentage = totalVotes > 0 ? Math.floor((Number(yesVotes) / totalVotes) * 100) : 0;
  const noPercentage = totalVotes > 0 ? 100 - yesPercentage : 0;
  
  // Create card HTML
  const cardHtml = `
    <div class="col-md-6 mb-4">
      <div class="card proposal-card" data-proposal-id="${id}">
        <div class="card-body">
          <div class="d-flex justify-content-between align-items-start mb-3">
            <div>
              <span class="proposal-tag ${status === 'Active' ? 'active-tag' : 'closed-tag'}">${status}</span>
              <span class="proposal-tag">Proposal #${id}</span>
            </div>
            <small class="text-muted">${status === 'Active' ? `Ends in ${daysRemaining} days` : 'Voting ended'}</small>
          </div>
          <h5 class="card-title">${title}</h5>
          <p class="card-text">${description}</p>
          <div class="mb-3">
            <div class="d-flex justify-content-between mb-1">
              <small>Yes: ${yesPercentage}%</small>
              <small>No: ${noPercentage}%</small>
            </div>
            <div class="progress">
              <div class="progress-bar bg-success" role="progressbar" style="width: ${yesPercentage}%"></div>
              <div class="progress-bar bg-danger" role="progressbar" style="width: ${noPercentage}%"></div>
            </div>
          </div>
          <div class="d-flex gap-2">
            ${status === 'Active' ? `
              <button class="btn btn-success btn-sm flex-grow-1 vote-btn" data-vote="true">Vote Yes</button>
              <button class="btn btn-danger btn-sm flex-grow-1 vote-btn" data-vote="false">Vote No</button>
            ` : `
              <button class="btn btn-secondary btn-sm flex-grow-1" disabled>Voting Closed</button>
            `}
            <button class="btn btn-light btn-sm proposal-details-btn">Details</button>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Convert to DOM element
  const template = document.createElement('template');
  template.innerHTML = cardHtml.trim();
  
  // Add event listeners
  const cardElement = template.content.firstChild;
  const voteButtons = cardElement.querySelectorAll('.vote-btn');
  voteButtons.forEach(button => {
    button.addEventListener('click', () => {
      const vote = button.dataset.vote === 'true';
      castVote(id, vote);
    });
  });
  
  cardElement.querySelector('.proposal-details-btn').addEventListener('click', () => {
    showProposalDetails(id);
  });
  
  return cardElement;
}

// Cast a vote on a proposal
async function castVote(proposalId, inSupport) {
  try {
    if (!daoContract) {
      alert('Please connect your wallet first');
      return;
    }
    
    // Check if user is a member
    const memberInfo = await daoContract.members(currentAccount);
    if (!memberInfo[0]) {
      alert('You must be a DAO member to vote');
      return;
    }
    
    // Check if already voted
    const hasVoted = await daoContract.hasVoted(proposalId, currentAccount);
    if (hasVoted) {
      alert('You have already voted on this proposal');
      return;
    }
    
    // Send transaction to vote
    const tx = await daoContract.vote(proposalId, inSupport);
    
    // Show loading state
    alert('Voting transaction submitted. Please wait for confirmation...');
    
    // Wait for transaction to be confirmed
    await tx.wait();
    
    // Refresh proposal data
    loadProposals();
    
    alert(`Your vote has been recorded. You voted ${inSupport ? 'YES' : 'NO'} on proposal #${proposalId}`);
  } catch (error) {
    console.error('Error casting vote:', error);
    alert(`Error casting vote: ${error.message}`);
  }
}

// Create a new proposal
async function submitNewProposal(title, description) {
  try {
    if (!daoContract) {
      alert('Please connect your wallet first');
      return;
    }
    
    // Check if user is a member
    const memberInfo = await daoContract.members(currentAccount);
    if (!memberInfo[0]) {
      alert('You must be a DAO member to create a proposal');
      return;
    }
    
    // Send transaction to create proposal
    const tx = await daoContract.createProposal(title, description);
    
    // Show loading state
    alert('Proposal creation transaction submitted. Please wait for confirmation...');
    
    // Wait for transaction to be confirmed
    await tx.wait();
    
    // Refresh proposal data
    loadProposals();
    
    alert('Your proposal has been created successfully!');
  } catch (error) {
    console.error('Error creating proposal:', error);
    alert(`Error creating proposal: ${error.message}`);
  }
}

// Show proposal details
function showProposalDetails(proposalId) {
  // In a real application, this would fetch detailed information about the proposal
  // and display it in a modal or separate page
  alert(`Viewing details for proposal #${proposalId}. In a complete application, this would show full proposal details.`);
}

// Setup event listeners for contract events
function setupEventListeners() {
  // Listen for proposal created events
  daoContract.on("ProposalCreated", (proposalId, creator, title) => {
    console.log(`New proposal created: ${proposalId} - ${title}`);
    loadProposals();
  });
  
  // Listen for vote cast events
  daoContract.on("VoteCast", (proposalId, voter, inSupport) => {
    console.log(`Vote cast on proposal ${proposalId} by ${voter}: ${inSupport ? 'Yes' : 'No'}`);
    loadProposals();
  });
  
  // Listen for proposal executed events
  daoContract.on("ProposalExecuted", (proposalId) => {
    console.log(`Proposal ${proposalId} has been executed`);
    loadProposals();
  });
}

// Event listeners for UI elements
document.addEventListener('DOMContentLoaded', () => {
  // Connect wallet button
  const connectWalletBtn = document.getElementById('connectWallet');
  connectWalletBtn.addEventListener('click', initWeb3);
  
  // Create proposal button
  const createProposalBtn = document.querySelector('.card.border-dashed .btn-primary');
  createProposalBtn.addEventListener('click', () => {
    // In a real application, this would open a modal for proposal creation
    const title = prompt('Enter proposal title:');
    if (!title) return;
    
    const description = prompt('Enter proposal description:');
    if (!description) return;
    
    submitNewProposal(title, description);
  });
  
  // Static button event listeners (for demo purposes)
  document.querySelectorAll('.btn-success').forEach(button => {
    if (button.textContent.includes('Vote Yes')) {
      button.addEventListener('click', function() {
        alert('You voted YES on this proposal! In a real implementation, this would be recorded on the blockchain.');
      });
    }
  });

  document.querySelectorAll('.btn-danger').forEach(button => {
    if (button.textContent.includes('Vote No')) {
      button.addEventListener('click', function() {
        alert('You voted NO on this proposal! In a real implementation, this would be recorded on the blockchain.');
      });
    }
  });
});