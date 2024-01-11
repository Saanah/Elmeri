import React from 'react';
import '../App.css';
import PlusMinus from './PlusMinus';
import Header from './Header';
import Raportti from './Raportti';

export default function Tarkastuskohdat() {
  return (
    <div style={{ textAlign: 'center' }}>
      <Header />
      <Raportti/>
    </div>
  );
}
