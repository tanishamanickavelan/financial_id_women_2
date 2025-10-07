// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract FinancialID {
    struct User {
        string name;
        address wallet;
        string cid;        // IPFS CID (off-chain JSON with income profile)
        uint256 trustScore; 
        uint256 createdAt;
    }

    address public owner;
    uint256 public nextId = 1;
    mapping(uint256 => User) public users;
    mapping(address => uint256) public walletToId;
    mapping(address => bool) public approver;

    event UserCreated(uint256 indexed id, address indexed wallet, string cid, uint256 trustScore);
    event TrustScoreUpdated(uint256 indexed id, uint256 trustScore);
    event ApproverAdded(address indexed approver);
    event ApproverRemoved(address indexed approver);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    modifier onlyApprover() {
        require(approver[msg.sender] == true, "Not approver");
        _;
    }

    constructor() {
        owner = msg.sender;
        approver[msg.sender] = true;
    }

    function addApprover(address _a) external onlyOwner {
        approver[_a] = true;
        emit ApproverAdded(_a);
    }

    function removeApprover(address _a) external onlyOwner {
        approver[_a] = false;
        emit ApproverRemoved(_a);
    }

    function createUser(address _wallet, string calldata _name, string calldata _cid, uint256 _trustScore) external onlyApprover returns (uint256) {
        require(walletToId[_wallet] == 0, "User exists");
        uint256 id = nextId++;
        users[id] = User(_name, _wallet, _cid, _trustScore, block.timestamp);
        walletToId[_wallet] = id;
        emit UserCreated(id, _wallet, _cid, _trustScore);
        return id;
    }

    function updateTrustScore(uint256 _id, uint256 _trustScore) external onlyApprover {
        require(_id > 0 && _id < nextId, "Invalid id");
        users[_id].trustScore = _trustScore;
        emit TrustScoreUpdated(_id, _trustScore);
    }

    function getUserByWallet(address _wallet) external view returns (User memory) {
        uint256 id = walletToId[_wallet];
        require(id != 0, "Not found");
        return users[id];
    }
}
