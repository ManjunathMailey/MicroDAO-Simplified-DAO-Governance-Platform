# MicroDAO-Simplified-DAO-Governance-Platform
<p>BITS Pilani Apogee '25</p>

<div align="center">
  <h3>Decentralized governance for everyone</h3>
  <p>Built for Web 3.0 Online Hackathon | BITS Pilani Apogee '25</p>
</div>

## 🚀 Project Overview

MicroDAO is a user-friendly decentralized autonomous organization (DAO) platform that simplifies the process of creating, joining, and participating in DAOs, making decentralized governance accessible to everyone, not just blockchain experts.

## 🌟 Key Features

- **Intuitive Governance Interface**: User-friendly proposal creation and voting system
- **Gas-Optimized Smart Contracts**: Minimized transaction costs for broader participation
- **Transparent Decision Making**: All votes and treasury actions recorded on-chain
- **Simplified Member Management**: Easy onboarding and role assignment
- **Responsive Dashboard**: Real-time metrics on DAO performance and participation
- **Dark/Light Mode**: Personalized visual experience for users
- **Transaction Feedback**: Clear loading animations during blockchain interactions

## 📊 Project Architecture

Our architecture follows a clean separation between frontend and blockchain components:

1. **Frontend Layer**: User interface components built with HTML, CSS, and JavaScript
2. **Web3 Connection Layer**: Connects the UI to the blockchain using ethers.js
3. **Smart Contract Layer**: Contains the business logic for DAO governance
4. **Blockchain Layer**: Ethereum Virtual Machine where the contract is deployed

## 💻 Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 5
- **Smart Contracts**: Solidity
- **Blockchain**: Ethereum (compatible with EVM chains)
- **Web3 Integration**: Ethers.js

## 🏗️ Smart Contract Structure

The `SimpleDAO.sol` contract includes the following key components:

```solidity
// Core data structures
struct Member { bool isActive; uint256 tokenBalance; uint256 joinedAt; }
struct Proposal { uint256 id; address creator; string title; string description; ... }

// State variables
string public name;
string public purpose;
address public admin;
uint256 public memberCount;
uint256 public proposalCount;

// Core functionality
function createProposal(string calldata _title, string calldata _description) external
function vote(uint256 _proposalId, bool _inSupport) external
function executeProposal(uint256 _proposalId) external
```

## 🛠️ User Flow

1. **Connect Wallet**: Users connect their Web3 wallet (e.g., MetaMask)
2. **View DAO Dashboard**: Access key metrics and active proposals
3. **Create Proposal**: Submit new governance proposals
4. **Vote on Proposals**: Cast votes on active proposals
5. **Execute Proposals**: Implement passed proposals automatically

## 🔧 Setup Instructions

1. Clone the repository
```bash
git clone https://github.com/your-github-username/MicroDAO.git
cd MicroDAO
```

2. Structure your files as follows:
```
MicroDAO/
├── index.html
├── js/
│   └── app.js
├── contracts/
│   └── SimpleDAO.sol
└── README.md
```

3. Open `index.html` in your browser to view the frontend

4. For contract deployment (on testnet):
```bash
# Install development tools
npm init -y
npm install --save-dev hardhat @nomiclabs/hardhat-ethers ethers

# Deploy contract (after setting up hardhat config)
npx hardhat run scripts/deploy.js --network goerli
```

5. Update the contract address in `js/app.js` to connect to your deployed contract:
```javascript
const DAOContractAddress = "https://github.com/ManjunathMailey/MicroDAO-Simplified-DAO-Governance-Platform";
```

## 🚀 Future Development

- Integration with multiple EVM-compatible chains
- Enhanced governance models (quadratic voting, delegation)
- NFT membership capabilities
- Mobile app version for on-the-go governance
- Integration with other DeFi protocols

## 👥 Target Users

- Community collectives needing democratic decision-making
- DeFi projects seeking governance solutions
- Web3 communities transitioning from traditional governance
- Newcomers to the DAO ecosystem

## 🌐 Impact & Innovation

MicroDAO addresses a critical challenge in Web3 adoption: the complexity barrier. By making DAOs accessible to non-technical users, we're expanding the potential for decentralized governance across various sectors and communities.

## 👨‍💻 Team

- Manjunath Mailey
- Suchita Yerramsetty


---

*Built with ❤️ for BITS Blockchain Web 3.0 Online Hackathon | Apogee '25*
