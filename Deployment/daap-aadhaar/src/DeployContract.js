import React, { useState } from 'react';
import Web3 from 'web3';

const DeployContract = ({ abi, bytecode }) => {
  const [account, setAccount] = useState('');
  const [web3, setWeb3] = useState(null);
  const [contractAddress, setContractAddress] = useState('');
  const [deploymentStatus, setDeploymentStatus] = useState('');

  // Function to connect to MetaMask
  const connectToMetaMask = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const web3Instance = new Web3(window.ethereum);
        const accounts = await web3Instance.eth.getAccounts();
        setAccount(accounts[0]);
        setWeb3(web3Instance);
        setDeploymentStatus('Connected to MetaMask');
      } catch (error) {
        setDeploymentStatus(`Error connecting to MetaMask: ${error.message}`);
      }
    } else {
      setDeploymentStatus('MetaMask is not installed');
    }
  };

  // Function to deploy the contract
  const deployContract = async () => {
    if (web3 && account) {
      try {
        const contract = new web3.eth.Contract(abi);
        const deployedContract = await contract
          .deploy({ data: bytecode })
          .send({ from: account });

        setContractAddress(deployedContract.options.address);
        setDeploymentStatus('Contract deployed successfully');
      } catch (error) {
        setDeploymentStatus(`Error deploying contract: ${error.message}`);
      }
    } else {
      setDeploymentStatus('Please connect to MetaMask first');
    }
  };

  return (
    <div>
      <h2>Deploy Smart Contract</h2>
      <button onClick={connectToMetaMask}>Connect to MetaMask</button>
      <button onClick={deployContract}>Deploy Contract</button>
      <div>
        <p>Status: {deploymentStatus}</p>
        {contractAddress && <p>Contract Address: {contractAddress}</p>}
      </div>
    </div>
  );
};

export default DeployContract;
