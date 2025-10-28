import { ethers } from 'ethers';

const SOMNIA_RPC_URL = 'https://rpc.somnia.network';
const SPDR_CONTRACT_ADDRESS = '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb';

const SPDR_ABI = [
  "function mintTokens(address player, uint256 amount) external",
  "function balanceOf(address account) external view returns (uint256)",
  "function name() external view returns (string)",
  "function symbol() external view returns (string)",
  "function decimals() external view returns (uint8)"
];

export class TokenContract {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.address = null;
  }

  async connect() {
    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('Please install MetaMask or another Web3 wallet');
      }

      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [{
          chainId: '0x32C7B', // 207995 in hex
          chainName: 'Somnia Network',
          nativeCurrency: {
            name: 'Somnia',
            symbol: 'SOM',
            decimals: 18
          },
          rpcUrls: [SOMNIA_RPC_URL],
          blockExplorerUrls: ['https://explorer.somnia.network']
        }]
      }).catch(() => {
        // Chain might already be added
      });

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      
      this.provider = provider;
      this.signer = await provider.getSigner();
      this.address = accounts[0];
      this.contract = new ethers.Contract(
        SPDR_CONTRACT_ADDRESS,
        SPDR_ABI,
        this.signer
      );

      return this.address;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      throw error;
    }
  }

  async mintTokens(amount) {
    try {
      if (!this.contract || !this.address) {
        throw new Error('Wallet not connected');
      }

      console.log('Minting', amount, '$SPDR tokens to', this.address);
      
      const signature = this.generateMockSignature(this.address, amount);
      
      console.log('Mock transaction successful!');
      console.log('Signature:', signature);
      console.log('Amount:', amount, '$SPDR');
      console.log('Recipient:', this.address);
      
      return {
        success: true,
        txHash: signature,
        amount: amount
      };
    } catch (error) {
      console.error('Failed to mint tokens:', error);
      throw error;
    }
  }

  generateMockSignature(address, amount) {
    const data = `${address}:${amount}:${Date.now()}`;
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      hash = ((hash << 5) - hash) + data.charCodeAt(i);
      hash = hash & hash;
    }
    return '0x' + Math.abs(hash).toString(16).padStart(64, '0');
  }

  async getBalance() {
    try {
      if (!this.contract || !this.address) {
        throw new Error('Wallet not connected');
      }

      const balance = await this.contract.balanceOf(this.address);
      return ethers.formatEther(balance);
    } catch (error) {
      console.error('Failed to get balance:', error);
      return '0';
    }
  }

  disconnect() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.address = null;
  }
}

export const tokenContract = new TokenContract();
