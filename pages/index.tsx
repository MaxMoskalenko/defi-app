import React, { FC, useEffect, useState } from 'react';
import { listenAccounts, getBalances, getTokenData, getOwhBalance, setOwhContractBalance, buyToken } from './api/Web3Client';

const Home: FC<{}> = (): JSX.Element => {
  const [ethBalance, setEthBalance] = useState(0);
  const [tokenBalance, setTokenBalance] = useState(0);
  const [currentAccount, setCurrentAccount] = useState('0x5e03b549e435C6ccf1a968fc60792145582AE80B');
  const [currentChain, setCurrentChain] = useState('ropsten');
  const [owhBalance, setOwhBalance] = useState('Press the button <-');
  const [owhSetAmount, setOwhSetAmount] = useState('');
  const [buyPrice, setBuyPrice] = useState('');
  const [tokenData, setTokenData] = useState({
    name: '',
    symbol: '',
    supply: '',
    priceInEth: '',
  });

  listenAccounts(setCurrentAccount, setCurrentChain);
  useEffect(() => {
    getBalances(setEthBalance, setTokenBalance, currentAccount);
  }, [currentAccount, currentChain]);

  useEffect(() => {
    getTokenData(setTokenData);
  }, [currentChain]);


  return (
    <div className="flex h-screen ">
      <div className="w-1/2 m-auto shadow-lg border border-green-500 overflow-auto rounded-lg">
        <div className="border-b border-green-500">
          <div className="flex p-3">
            <span className="w-full">
              Current Account:
            </span>
            <span className="w-full">
              {currentAccount}
            </span>
          </div>
          <div className="flex p-3">
            <span className="w-1/2">
              {currentChain == 'ropsten' ? 'ETH' : 'BNB'}: {ethBalance}
            </span>
            <span className="w-1/2">
              {tokenData.symbol}: {tokenBalance}
            </span>
          </div>
        </div>
        <div className="border-b border-green-500 p-3">
          TOKEN DATA
          <div className="flex flex-col">
            <span>Name: {tokenData.name}</span>
            <span>Symbol: {tokenData.symbol}</span>
            <span>Supply: {tokenData.supply}</span>
            <span>Price in ETH: {tokenData.priceInEth}</span>
          </div>
        </div>
        <div className="p-3 flex flex-col">
          <div className="flex mb-2">
            <div className="w-full flex justify-center">
              <button
                className="p-2 rounded border bg-green-500 w-1/2 text-white"
                onClick={() => getOwhBalance(currentAccount, setOwhBalance)}
              >
                GET OWH Balance
              </button>
            </div>
            <span className="w-full p-2">{owhBalance}</span>
          </div>
          <div className="flex mb-2">
            <div className="w-full flex justify-center">
              <button
                className="p-2 rounded border bg-green-500 w-1/2 text-white"
                onClick={() => setOwhContractBalance(owhSetAmount)}
              >
                SET OWH Balance
              </button>
            </div>
            <input
              type="text"
              className="p-2 rounded w-full border border-green-500"
              placeholder="Amount of tokens to set"
              onChange={(v) => setOwhSetAmount(v.target.value)}
            />
          </div>
          <div className="flex mb-2">
            <div className="w-full flex justify-center">
              <button
                className="p-2 rounded border bg-green-500 w-1/2 text-white"
                onClick={() => buyToken(buyPrice, currentAccount)}
              >
                Buy {tokenData.symbol}
              </button>
            </div>
            <input
              type="text"
              className="p-2 rounded w-full border border-green-500"
              placeholder="Amount of ETH to spend"
              onChange={(v) => setBuyPrice(v.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
