import React, { useState, useEffect } from 'react';

export function AssetTest() {
  const [results, setResults] = useState({});
  const [testing, setTesting] = useState(true);

  const assets = [
    { name: 'Spider Model', path: '/spider.glb' },
    { name: 'Labubu Model', path: '/creepy_labubu.glb' },
  ];

  useEffect(() => {
    const testAssets = async () => {
      const testResults = {};

      for (const asset of assets) {
        try {
          const response = await fetch(asset.path, { method: 'HEAD' });
          testResults[asset.name] = {
            status: response.status,
            ok: response.ok,
            size: response.headers.get('content-length'),
            type: response.headers.get('content-type'),
          };
        } catch (error) {
          testResults[asset.name] = {
            error: error.message,
            ok: false,
          };
        }
      }

      setResults(testResults);
      setTesting(false);
    };

    testAssets();
  }, []);

  if (testing) {
    return <div style={styles.container}>Testing assets...</div>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Asset Loading Test</h2>
      {Object.entries(results).map(([name, result]) => (
        <div key={name} style={styles.result}>
          <strong>{name}:</strong>
          {result.ok ? (
            <span style={styles.success}>
              ✅ OK (Status: {result.status}, Size: {(parseInt(result.size) / 1024 / 1024).toFixed(2)} MB)
            </span>
          ) : (
            <span style={styles.error}>
              ❌ Failed {result.error ? `- ${result.error}` : `(Status: ${result.status})`}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed',
    top: '20px',
    right: '20px',
    background: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    padding: '20px',
    borderRadius: '10px',
    fontFamily: 'monospace',
    fontSize: '14px',
    maxWidth: '400px',
    zIndex: 1000,
  },
  title: {
    margin: '0 0 15px 0',
    fontSize: '16px',
    color: '#00ffff',
  },
  result: {
    marginBottom: '10px',
    lineHeight: '1.5',
  },
  success: {
    color: '#00ff00',
    marginLeft: '10px',
  },
  error: {
    color: '#ff0000',
    marginLeft: '10px',
  },
};
