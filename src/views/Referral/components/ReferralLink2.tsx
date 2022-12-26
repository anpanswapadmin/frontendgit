import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Web3 from 'web3';
import CopyHelper2 from './Copy/Copy2';

function ReferralLink2() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {

    let web3=null; // Will hold the web3 instance

    if (!(window as any).ethereum) {
      window.alert('Please install MetaMask first.');
      }
      if (!web3) {
        try {
        // Request account access if needed
        await (window as any).ethereum.enable();
    
        // We don't know window.web3 version, so we use our own instance of Web3
        // with the injected provider given by MetaMask
        web3 = new Web3((window as any).ethereum);
        } catch (error) {
          window.alert('You need to allow MetaMask.');
          }
        }
      const coinbase = await web3.eth.getCoinbase();
      if (!coinbase) {
        window.alert('Please activate MetaMask first.');
      }
      const account = coinbase.toLowerCase();

    const { data } = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users?account=${account}`);
    setUsers(data);
  };

  return (
    <div className='users'>
      {users.map((account) => (
          <CopyHelper2 toCopy={`${account.referralcode}`} />
      ))}
    </div>
  );
}

export default ReferralLink2;
