'use client';
import React from 'react';
import { Layout } from 'antd';

const { Header } = Layout;

const headerStyle: React.CSSProperties = {
  margin: '0',
  padding: '0px 0px 0px 20px',
  color: '#fff',
  backgroundColor: '#D6A07E',
};

const h1Style: React.CSSProperties = {
  fontSize: '28px',
  fontWeight: 'bold',
  letterSpacing: '2px',
  margin: 0,
  textTransform: 'uppercase',
};

const Headers: React.FC = () => {
  return (
    <>
      <Header style={headerStyle}>
        <h3 style={h1Style}>
          ASSET<span style={{ color: 'black' }}>TRACKER</span>
        </h3>
      </Header>
    </>
  );
};

export default Headers;
