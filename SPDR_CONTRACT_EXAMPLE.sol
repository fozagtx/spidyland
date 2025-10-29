// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title SPDR Token Contract
 * @notice ERC-20 token for Spidyland: The Web of Fortune game
 * @dev This is an example contract for the Somnia network
 * 
 * Deploy this contract to Somnia and update the address in src/TokenContract.js
 */
contract SPDRToken is ERC20, Ownable, ReentrancyGuard {
    
    // Game server address authorized to mint tokens
    address public gameServer;
    
    // Maximum tokens that can be minted per transaction
    uint256 public constant MAX_MINT_PER_TX = 100 * 10**18;
    
    // Maximum tokens per player per day
    uint256 public constant MAX_MINT_PER_DAY = 500 * 10**18;
    
    // Mapping to track daily mints per player
    mapping(address => mapping(uint256 => uint256)) public dailyMints;
    
    // Events
    event GameServerUpdated(address indexed oldServer, address indexed newServer);
    event TokensMinted(address indexed player, uint256 amount, uint256 gameId);
    
    /**
     * @notice Constructor
     * @param _gameServer Address of the authorized game server
     */
    constructor(address _gameServer) ERC20("Spidyland Token", "SPDR") Ownable(msg.sender) {
        require(_gameServer != address(0), "Invalid game server address");
        gameServer = _gameServer;
    }
    
    /**
     * @notice Update the game server address
     * @param _newServer New game server address
     */
    function setGameServer(address _newServer) external onlyOwner {
        require(_newServer != address(0), "Invalid address");
        address oldServer = gameServer;
        gameServer = _newServer;
        emit GameServerUpdated(oldServer, _newServer);
    }
    
    /**
     * @notice Mint tokens to a player (called by game server)
     * @param player Address of the player
     * @param amount Amount of tokens to mint (in wei)
     */
    function mintTokens(address player, uint256 amount) external nonReentrant {
        require(msg.sender == gameServer, "Only game server can mint");
        require(player != address(0), "Invalid player address");
        require(amount > 0 && amount <= MAX_MINT_PER_TX, "Invalid amount");
        
        // Check daily limit
        uint256 today = block.timestamp / 1 days;
        uint256 mintedToday = dailyMints[player][today];
        require(mintedToday + amount <= MAX_MINT_PER_DAY, "Daily limit exceeded");
        
        // Update daily mint tracking
        dailyMints[player][today] += amount;
        
        // Mint tokens
        _mint(player, amount);
        
        emit TokensMinted(player, amount, today);
    }
    
    /**
     * @notice Mint tokens with signature verification (alternative approach)
     * @param player Address of the player
     * @param amount Amount of tokens to mint
     * @param gameId Unique game session ID
     * @param signature Signature from game server
     */
    function mintTokensWithSignature(
        address player,
        uint256 amount,
        uint256 gameId,
        bytes memory signature
    ) external nonReentrant {
        require(player == msg.sender, "Can only mint for yourself");
        require(amount > 0 && amount <= MAX_MINT_PER_TX, "Invalid amount");
        
        // Verify signature
        bytes32 messageHash = keccak256(abi.encodePacked(player, amount, gameId));
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);
        require(recoverSigner(ethSignedMessageHash, signature) == gameServer, "Invalid signature");
        
        // Check daily limit
        uint256 today = block.timestamp / 1 days;
        uint256 mintedToday = dailyMints[player][today];
        require(mintedToday + amount <= MAX_MINT_PER_DAY, "Daily limit exceeded");
        
        // Update daily mint tracking
        dailyMints[player][today] += amount;
        
        // Mint tokens
        _mint(player, amount);
        
        emit TokensMinted(player, amount, gameId);
    }
    
    /**
     * @notice Get Ethereum signed message hash
     * @param _messageHash Original message hash
     * @return Ethereum signed message hash
     */
    function getEthSignedMessageHash(bytes32 _messageHash) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", _messageHash));
    }
    
    /**
     * @notice Recover signer from signature
     * @param _ethSignedMessageHash Ethereum signed message hash
     * @param _signature Signature bytes
     * @return Recovered signer address
     */
    function recoverSigner(bytes32 _ethSignedMessageHash, bytes memory _signature)
        internal
        pure
        returns (address)
    {
        require(_signature.length == 65, "Invalid signature length");
        
        bytes32 r;
        bytes32 s;
        uint8 v;
        
        assembly {
            r := mload(add(_signature, 32))
            s := mload(add(_signature, 64))
            v := byte(0, mload(add(_signature, 96)))
        }
        
        return ecrecover(_ethSignedMessageHash, v, r, s);
    }
    
    /**
     * @notice Check how many tokens a player can still mint today
     * @param player Player address
     * @return Remaining tokens that can be minted today
     */
    function getRemainingDailyMint(address player) external view returns (uint256) {
        uint256 today = block.timestamp / 1 days;
        uint256 mintedToday = dailyMints[player][today];
        if (mintedToday >= MAX_MINT_PER_DAY) {
            return 0;
        }
        return MAX_MINT_PER_DAY - mintedToday;
    }
    
    /**
     * @notice Emergency withdraw function (only owner)
     */
    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}

/**
 * DEPLOYMENT INSTRUCTIONS:
 * 
 * 1. Install dependencies:
 *    npm install @openzeppelin/contracts
 * 
 * 2. Install Hardhat or Foundry for deployment:
 *    npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
 * 
 * 3. Create deployment script (Hardhat example):
 * 
 *    const hre = require("hardhat");
 * 
 *    async function main() {
 *      const gameServerAddress = "YOUR_GAME_SERVER_ADDRESS";
 *      
 *      const SPDR = await hre.ethers.getContractFactory("SPDRToken");
 *      const spdr = await SPDR.deploy(gameServerAddress);
 *      await spdr.deployed();
 *      
 *      console.log("SPDR Token deployed to:", spdr.address);
 *    }
 * 
 *    main().catch((error) => {
 *      console.error(error);
 *      process.exitCode = 1;
 *    });
 * 
 * 4. Configure hardhat.config.js for Somnia:
 * 
 *    module.exports = {
 *      solidity: "0.8.20",
 *      networks: {
 *        somnia: {
 *          url: "https://rpc.somnia.network",
 *          chainId: 207995,
 *          accounts: [process.env.PRIVATE_KEY]
 *        }
 *      }
 *    };
 * 
 * 5. Deploy:
 *    npx hardhat run scripts/deploy.js --network somnia
 * 
 * 6. Update src/TokenContract.js:
 *    - Replace SPDR_CONTRACT_ADDRESS with deployed address
 *    - Update ABI if you added/modified functions
 * 
 * 7. Setup backend server to call mintTokens():
 *    - Verify game scores on backend
 *    - Sign transactions from gameServer address
 *    - Call contract.mintTokens(playerAddress, amount)
 * 
 * SECURITY NOTES:
 * - Keep gameServer private key secure (use AWS KMS, etc.)
 * - Implement rate limiting on backend
 * - Validate all game scores server-side
 * - Consider using Chainlink VRF for randomness
 * - Audit contract before mainnet deployment
 * - Test thoroughly on testnet first
 */
