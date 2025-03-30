// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

/**
 * @title SimpleDAO
 * @dev A simplified DAO implementation for community governance
 */
contract SimpleDAO {
    // DAO Member structure
    struct Member {
        bool isActive;
        uint256 tokenBalance;
        uint256 joinedAt;
    }
    
    // Proposal structure
    struct Proposal {
        uint256 id;
        address creator;
        string title;
        string description;
        uint256 createdAt;
        uint256 votingEndsAt;
        uint256 yesVotes;
        uint256 noVotes;
        bool executed;
        mapping(address => bool) hasVoted;
    }
    
    // State variables
    string public name;
    string public purpose;
    address public admin;
    uint256 public memberCount;
    uint256 public proposalCount;
    uint256 public votingPeriod = 3 days;
    uint256 public executionThreshold = 51; // Percentage threshold for execution
    
    // Mappings
    mapping(address => Member) public members;
    mapping(uint256 => Proposal) public proposals;
    
    // Events
    event MemberAdded(address indexed member);
    event MemberRemoved(address indexed member);
    event ProposalCreated(uint256 indexed proposalId, address indexed creator, string title);
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool inSupport);
    event ProposalExecuted(uint256 indexed proposalId);
    
    // Modifiers
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }
    
    modifier onlyMember() {
        require(members[msg.sender].isActive, "Only active members can perform this action");
        _;
    }
    
    constructor(string memory _name, string memory _purpose) {
        name = _name;
        purpose = _purpose;
        admin = msg.sender;
        
        // Add creator as first member
        _addMember(msg.sender);
    }
    
    /**
     * @dev Add a new member to the DAO
     * @param _member Address of the new member
     */
    function addMember(address _member) external onlyAdmin {
        _addMember(_member);
    }
    
    /**
     * @dev Internal function to add a member
     */
    function _addMember(address _member) internal {
        require(!members[_member].isActive, "Address is already a member");
        
        members[_member] = Member({
            isActive: true,
            tokenBalance: 100, // Initial governance tokens
            joinedAt: block.timestamp
        });
        
        memberCount++;
        
        emit MemberAdded(_member);
    }
    
    /**
     * @dev Remove a member from the DAO
     * @param _member Address of the member to remove
     */
    function removeMember(address _member) external onlyAdmin {
        require(members[_member].isActive, "Address is not an active member");
        
        members[_member].isActive = false;
        memberCount--;
        
        emit MemberRemoved(_member);
    }
    
    /**
     * @dev Create a new proposal
     * @param _title Title of the proposal
     * @param _description Description of the proposal
     */
    function createProposal(string calldata _title, string calldata _description) external onlyMember {
        uint256 proposalId = proposalCount++;
        
        Proposal storage newProposal = proposals[proposalId];
        newProposal.id = proposalId;
        newProposal.creator = msg.sender;
        newProposal.title = _title;
        newProposal.description = _description;
        newProposal.createdAt = block.timestamp;
        newProposal.votingEndsAt = block.timestamp + votingPeriod;
        
        emit ProposalCreated(proposalId, msg.sender, _title);
    }
    
    /**
     * @dev Vote on a proposal
     * @param _proposalId ID of the proposal
     * @param _inSupport Whether the vote is in support of the proposal
     */
    function vote(uint256 _proposalId, bool _inSupport) external onlyMember {
        Proposal storage proposal = proposals[_proposalId];
        
        require(block.timestamp < proposal.votingEndsAt, "Voting period has ended");
        require(!proposal.hasVoted[msg.sender], "Already voted on this proposal");
        
        proposal.hasVoted[msg.sender] = true;
        
        if (_inSupport) {
            proposal.yesVotes += members[msg.sender].tokenBalance;
        } else {
            proposal.noVotes += members[msg.sender].tokenBalance;
        }
        
        emit VoteCast(_proposalId, msg.sender, _inSupport);
    }
    
    /**
     * @dev Execute a passed proposal
     * @param _proposalId ID of the proposal to execute
     */
    function executeProposal(uint256 _proposalId) external {
        Proposal storage proposal = proposals[_proposalId];
        
        require(block.timestamp >= proposal.votingEndsAt, "Voting period not ended yet");
        require(!proposal.executed, "Proposal already executed");
        
        uint256 totalVotes = proposal.yesVotes + proposal.noVotes;
        require(totalVotes > 0, "No votes cast");
        
        uint256 yesPercentage = (proposal.yesVotes * 100) / totalVotes;
        
        require(yesPercentage >= executionThreshold, "Approval threshold not met");
        
        proposal.executed = true;
        
        // Implementation would execute the actual proposal action here
        // This is simplified for the hackathon
        
        emit ProposalExecuted(_proposalId);
    }
    
    /**
     * @dev Get proposal details
     * @param _proposalId ID of the proposal
     */
    function getProposalDetails(uint256 _proposalId) external view returns (
        uint256 id,
        address creator,
        string memory title,
        string memory description,
        uint256 createdAt,
        uint256 votingEndsAt,
        uint256 yesVotes,
        uint256 noVotes,
        bool executed
    ) {
        Proposal storage proposal = proposals[_proposalId];
        
        return (
            proposal.id,
            proposal.creator,
            proposal.title,
            proposal.description,
            proposal.createdAt,
            proposal.votingEndsAt,
            proposal.yesVotes,
            proposal.noVotes,
            proposal.executed
        );
    }
    
    /**
     * @dev Check if a member has voted on a proposal
     */
    function hasVoted(uint256 _proposalId, address _member) external view returns (bool) {
        return proposals[_proposalId].hasVoted[_member];
    }
}