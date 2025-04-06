import React from 'react';
import { Text } from 'react-native';

export default function TestScreen() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f5fcff',
    }}>
      <h1 style={{
        fontSize: '20px',
        textAlign: 'center',
        margin: '10px',
      }}>This is a test page</h1>
    </div>
  );
}