import React from 'react';
import '../App.css';
import PlusMinus from './PlusMinus';
import Header from './Header';

export default function Tarkastuskohdat() {
  return (
    <div style={{ textAlign: 'center' }}>
      <Header />
      <PlusMinus />
    </div>
  );
}
