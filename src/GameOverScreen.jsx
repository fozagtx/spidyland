import React, { useState } from 'react';
import { tokenContract } from './TokenContract';

export function GameOverScreen({ score, onPlayAgain, onClose }) {
  const [claiming, setClaiming] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [walletAddress, setWalletAddress] = useState(null);

  const handleClaimTokens = async () => {
    if (score === 0) {
      setError('No tokens to claim! Catch some fireflies first.');
      return;
    }

    setClaiming(true);
    setError(null);

    try {
      let address = walletAddress;
      
      if (!address) {
        address = await tokenContract.connect();
        setWalletAddress(address);
      }

      const result = await tokenContract.mintTokens(score);
      
      if (result.success) {
        setClaimSuccess(true);
        
        const leaderboard = JSON.parse(localStorage.getItem('spiderlandLeaderboard') || '[]');
        leaderboard.push({
          score,
          address: address.substring(0, 6) + '...' + address.substring(address.length - 4),
          timestamp: new Date().toISOString(),
          txHash: result.txHash
        });
        leaderboard.sort((a, b) => b.score - a.score);
        localStorage.setItem('spiderlandLeaderboard', JSON.stringify(leaderboard.slice(0, 10)));
      }
    } catch (err) {
      setError(err.message || 'Failed to claim tokens. Please try again.');
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.95)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      fontFamily: "'Creepster', cursive, sans-serif"
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #1a0a00 0%, #330a00 100%)',
        border: '4px solid #ff6600',
        borderRadius: '20px',
        padding: '40px',
        maxWidth: '500px',
        boxShadow: '0 0 50px rgba(255, 102, 0, 0.5), inset 0 0 30px rgba(0, 0, 0, 0.5)',
        textAlign: 'center'
      }}>
        <h1 style={{
          fontSize: '48px',
          color: '#ff6600',
          textShadow: '0 0 20px #ff6600, 0 0 40px #ff3300',
          marginBottom: '20px',
          fontFamily: "'Creepster', cursive"
        }}>
          🎃 GAME OVER 🎃
        </h1>

        <div style={{
          fontSize: '72px',
          color: '#ffaa00',
          textShadow: '0 0 20px #ffaa00',
          margin: '30px 0',
          fontWeight: 'bold'
        }}>
          {score}
        </div>

        <div style={{
          fontSize: '24px',
          color: '#ffcc66',
          marginBottom: '30px'
        }}>
          🔥 Fireflies Caught
        </div>

        {claimSuccess ? (
          <div style={{
            background: 'rgba(0, 255, 0, 0.1)',
            border: '2px solid #00ff00',
            borderRadius: '10px',
            padding: '20px',
            marginBottom: '20px',
            color: '#00ff00'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '10px' }}>✅ Success!</div>
            <div style={{ fontSize: '16px' }}>
              {score} $SPDR tokens claimed!
            </div>
          </div>
        ) : (
          <button
            onClick={handleClaimTokens}
            disabled={claiming}
            style={{
              padding: '15px 40px',
              fontSize: '24px',
              background: claiming ? '#666' : 'linear-gradient(45deg, #ff6600, #ff9933)',
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              cursor: claiming ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 0 30px rgba(255, 102, 0, 0.5)',
              marginBottom: '15px',
              width: '100%',
              fontFamily: "'Creepster', cursive",
              transition: 'transform 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!claiming) {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 0 40px rgba(255, 102, 0, 0.8)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 0 30px rgba(255, 102, 0, 0.5)';
            }}
          >
            {claiming ? '⏳ Claiming...' : '💰 Claim $SPDR Tokens'}
          </button>
        )}

        {error && (
          <div style={{
            background: 'rgba(255, 0, 0, 0.1)',
            border: '2px solid #ff0000',
            borderRadius: '10px',
            padding: '15px',
            marginBottom: '20px',
            color: '#ff6666',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <button
          onClick={onPlayAgain}
          style={{
            padding: '15px 40px',
            fontSize: '24px',
            background: 'linear-gradient(45deg, #9933ff, #cc66ff)',
            border: 'none',
            borderRadius: '10px',
            color: 'white',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 0 30px rgba(153, 51, 255, 0.5)',
            width: '100%',
            fontFamily: "'Creepster', cursive",
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 0 40px rgba(153, 51, 255, 0.8)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 0 30px rgba(153, 51, 255, 0.5)';
          }}
        >
          🕷️ Play Again
        </button>

        {walletAddress && (
          <div style={{
            marginTop: '20px',
            fontSize: '12px',
            color: '#888',
            wordBreak: 'break-all'
          }}>
            Connected: {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
          </div>
        )}
      </div>
    </div>
  );
}
