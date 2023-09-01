import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css'; import MarketData from "./MarketData";

import Test from './Test'

declare global {
  interface Window {
    ethereum?: any
  }
}
interface DummyProps {
  number: Number,
  setNumber: Number

}
const App: React.FC<DummyProps> = ({ number, setNumber }) => {

  return (
    <div className="App" >
      <Test />
      <MarketData />
    </div>
  );
}

export default App;
