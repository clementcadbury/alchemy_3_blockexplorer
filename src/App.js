import { Alchemy, Network } from 'alchemy-sdk';
//import { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route} from "react-router-dom";

import Navbar from './Navbar';
import Home from './Home';
import Block from './Block';
import Transaction from './Transaction';
import ErrorPage from "./error-page";
import Address from './Address';

import './App.css';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {

  return (
    <Router>
      <div className='App'>
        <Navbar alchemy={alchemy} />
        <div className='mx-4' style={{marginTop:'5rem'}}>
          <Routes>
            <Route path={`${process.env.PUBLIC_URL}/`} element={<Home alchemy={alchemy} />} />
            <Route path={`${process.env.PUBLIC_URL}/block/:blockId?`} element={<Block alchemy={alchemy}/>} />
            <Route path={`${process.env.PUBLIC_URL}/transaction/:transactionHash?`} element={<Transaction alchemy={alchemy}/>} />
            <Route path={`${process.env.PUBLIC_URL}/address/:address?`} element={<Address alchemy={alchemy}/>} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </div>
      </div>
    </Router>

  );
}

export default App;
