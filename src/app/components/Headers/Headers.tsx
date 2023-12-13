'use client';
import React from 'react';
import { Image, Layout } from 'antd';

const { Header } = Layout;

const headerStyle: React.CSSProperties = {
  margin: '0',
  padding: '0px 0px 0px 5px',
  color: '#fff',
  backgroundColor: '#f0ccb7',
  display: 'flex',
  height: '70px',
};

const h1Style: React.CSSProperties = {
  fontSize: '30px',
  fontWeight: 'bold',
  padding: ' 5px 0px 0px 0px',
  textAlign: 'center',
  letterSpacing: '2px',
  margin: 0,
  textTransform: 'uppercase',
};

const ImageStyle: React.CSSProperties = {
  width: '72px',
};

const Headers: React.FC = () => {
  return (
    <Header style={headerStyle}>
      <Image src="\img\teste02.png" style={ImageStyle} />
      <h3 style={h1Style}>
        ASSET<span style={{ color: 'black' }}>TRACKER</span>
      </h3>
    </Header>
  );
};

export default Headers;
