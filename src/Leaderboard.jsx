import React, { useState, useEffect } from 'react';

export function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('spiderlandLeaderboard') || '[]');
    setLeaderboard(data);
  }, [isOpen]);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          padding: '12px 24px',
          fontSize: '16px',
          background: 'linear-gradient(45deg, #ff6600, #ff9933)',
          border: 'none',
          borderRadius: '10px',
          color: 'white',
          cursor: 'pointer',
          fontWeight: 'bold',
          boxShadow: '0 0 20px rgba(255, 102, 0, 0.5)',
          fontFamily: "'Creepster', cursive",
          zIndex: 100
        }}
      >
        🏆 Leaderboard
      </button>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      background: 'linear-gradient(135deg, #1a0a00 0%, #330a00 100%)',
      border: '3px solid #ff6600',
      borderRadius: '15px',
      padding: '20px',
      minWidth: '300px',
      maxHeight: '500px',
      overflowY: 'auto',
      boxShadow: '0 0 30px rgba(255, 102, 0, 0.5)',
      fontFamily: "'Creepster', cursive",
      zIndex: 100
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '15px'
      }}>
        <h2 style={{
          fontSize: '24px',
          color: '#ff6600',
          textShadow: '0 0 10px #ff6600',
          margin: 0
        }}>
          🏆 Top Hunters
        </h2>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            color: '#ff6600',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '0 5px'
          }}
        >
          ✕
        </button>
      </div>

      {leaderboard.length === 0 ? (
        <div style={{
          color: '#999',
          textAlign: 'center',
          padding: '20px',
          fontSize: '14px'
        }}>
          No scores yet!<br/>Be the first to catch fireflies!
        </div>
      ) : (
        <div>
          {leaderboard.map((entry, index) => (
            <div
              key={index}
              style={{
                background: index === 0 ? 'rgba(255, 215, 0, 0.1)' : 'rgba(255, 102, 0, 0.1)',
                border: `2px solid ${index === 0 ? '#ffd700' : '#ff6600'}`,
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : '#ff9933'
                }}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`}
                </span>
                <div>
                  <div style={{
                    color: index === 0 ? '#ffd700' : '#ffaa00',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}>
                    {entry.address}
                  </div>
                  <div style={{
                    color: '#888',
                    fontSize: '11px'
                  }}>
                    {new Date(entry.timestamp).toLocaleDateString()}
                  </div>
                </div>
              </div>
              <div style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#ff6600',
                textShadow: '0 0 10px #ff6600'
              }}>
                {entry.score}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
