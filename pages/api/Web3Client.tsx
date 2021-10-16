import Web3 from 'web3';
import abiJSON from './abi'
import owhAbiJSON from './owhAbi'

interface contractsAddressInterface {
    ropsten:any;
    bscnet:any;
    [key: string]: any;
};

let contractsAddress: contractsAddressInterface = {
    ropsten: {
        tokenAddr: '0xAFBa3CcE0B584a8637ba920150F4E9ba7B1f15A6',
        owhTokenAddr: '0xA4465b289842FB8FA856b28236825220202FDe68',
    },
    bscnet: {
        tokenAddr: '0x2B4FcF0a9d3f7a0dCF122d99Df90dd5E1FE4CC2C',
        owhTokenAddr: '0xF3AB703fc4C5B49CF20d4af6114fEEb984385fDf',
    }
}

declare global {
    interface Window {
        ethereum:any;
    }
}

let currentNet = 'ropsten';

let token: any;
let owhToken: any;
let isInitialized = false;
let provider: any;
let web3: any;

export const init = async () => {
    provider = window.ethereum;

    web3 = new Web3(provider);

    const networkId = await web3.eth.net.getId();

    token = new web3.eth.Contract(
        abiJSON,
        contractsAddress[currentNet].tokenAddr
    );

    owhToken = new web3.eth.Contract(
        owhAbiJSON,
        contractsAddress[currentNet].owhTokenAddr
    );

    console.log('Chain address: ', contractsAddress[currentNet].tokenAddr);

    isInitialized = true;
};


export const getBalances = async (setEth: any, setToken: any, acc: string) => {
    if (!isInitialized)
        await init();

    console.log(acc);


    web3.eth.getBalance(acc, (err: any, res: string) => {
        if (err) {
            console.error("An error occured when read ETH balance ", err);
            return;
        }
        setEth(web3.utils.fromWei(res));
    });
    token.methods.balances(acc).call((err: any, res: string) => {
        if (err) {
            console.error("An error occured when read Token balance ", err);
            return;
        }
        setToken(res);
    });
};

export const getTokenData = async (setTokenData: any) => {
    if (!isInitialized)
        await init();

    let data = { name: '', symbol: '', supply: '', priceInEth: '' };

    await token.methods.name().call((err: any, res: string) => {
        if (err) {
            console.error("An error occured when read Token name ", err);
            return;
        }
        data.name = res;
    });

    await token.methods.symbol().call((err: any, res: string) => {
        if (err) {
            console.error("An error occured when read Token symbol ", err);
            return;
        }
        data.symbol = res;
    });

    await token.methods.totalSupply().call((err: any, res: string) => {
        if (err) {
            console.error("An error occured when read Token supply ", err);
            return;
        }
        data.supply = res;
    });

    await token.methods.priceOfToken().call((err: any, res: string) => {
        if (err) {
            console.error("An error occured when read Token price ", err);
            return;
        }
        data.priceInEth = web3.utils.fromWei(res);
    });
    setTokenData(data);
};

export const getOwhBalance = async (account: string, setBalance: any) => {
    if (!isInitialized)
        await init();

    token.methods.owhBalanceOf(account).call((err: any, res: string) => {
        if (err) {
            console.error("An error occured when read OWH balance ", err);
            return;
        }
        console.log(res);
        // setBalance(res);
    });
};

export const setOwhContractBalance = async (balance: string) => {
    if (!isInitialized)
        await init();
    if (balance == '')
        return;

    const amount = web3.utils.toWei(balance);
    owhToken.methods.setBalance(amount).call();
};

export const buyToken = async (price: string, account: string) => {
    if (!isInitialized)
        await init();
    token.methods.buyToken().send({
        from: account,
        value: web3.utils.toWei(price)
    });
};

export const listenAccounts = async (setCurrentAccount: any, setCurrentChain: any) => {
    if (!isInitialized)
        await init();

    if (!provider) {
        console.error('No provider');
        return;
    }

    await provider
        .request({ method: 'eth_requestAccounts' })
        .then((accounts: any) => {
            setCurrentAccount(accounts[0]);
        })
        .catch((err: any) => {
            console.log(err);
            return;
        });

    await provider
        .request({ method: 'eth_chainId' })
        .then((chainId: string) => {
            console.log(chainId);
            handleChangeChain(setCurrentChain, chainId);
        })

    window.ethereum.on('accountsChanged', (accounts: any) => {
        setCurrentAccount(accounts[0]);
    });
    window.ethereum.on('chainChanged', async (chainId: string) => {
        handleChangeChain(setCurrentChain, chainId);
    });
}

function handleChangeChain(setCurrentChain: any, chainId: string) {
    if (chainId != '0x61' && chainId != '0x3')
        return;
    if (chainId == '0x61') {
        setCurrentChain('bscnet');
        currentNet = 'bscnet';
    }
    if (chainId == '0x3') {
        setCurrentChain('ropsten');
        currentNet = 'ropsten';
    }
    isInitialized = false;
}
