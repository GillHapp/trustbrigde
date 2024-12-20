import React, { useEffect, useState } from 'react';
import Header from './components/Header/Header';
import Form from './components/Form/Form';
import Dashboard from './components/Dashboard/Dashboard';
import Footer from './components/Footer/Footer';
import { AccountContext } from './AccountContext';
import { getEscrowData } from './actions/dashboard';

const App = () => {
    const [currentAccount, setCurrentAccount] = useState("");
    const [isMining, setIsMining] = useState(false);
    const [escrowData, setEscrowData] = useState([]);

    const isWalletConnected = async () => {
        try {
            const { ethereum } = window;
            if (!ethereum) {
                console.log("please connect metamask");
                return;
            }
            console.log("ethereum object found: ", ethereum);
            console.log(ethereum.networkVersion);
            const accounts = await ethereum.request({ method: 'eth_accounts' });
            if (accounts.length !== 0) {
                let account = accounts[0];
                console.log("found authorized account: ", account);
                setCurrentAccount(account);
                ethereum.on('accountsChanged', (accounts) => {
                    account = accounts[0];
                    console.log('accounts changed: ', account);
                    setCurrentAccount(account);
                    window.location.reload();
                });
            } else {
                console.log("no authorized account found");
            }
        } catch (error) {
            if (!window.ethereum) {
                alert("please install metamask");
            } else if (window.ethereum.network !== "4157") {
                alert("please connect on CrossFi");
            } else {
                console.log(error);
            }
            return;
        }
    }

    const connectWallet = async () => {
        try {
            const { ethereum } = window;
            if (!ethereum) {
                console.log("get metamask");
                return;
            }
            console.log(ethereum.networkVersion);
            const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
            console.log("connected", accounts[0]);
            setCurrentAccount(accounts[0]);
        } catch (error) {
            if (!window.ethereum) {
                alert("please install metamask");
            } else if (window.ethereum.network !== "4157") {
                alert("please connect on CrossFi");
            } else {
                console.log(error);
            }
            return;
        }
    }

    useEffect(() => {
        isWalletConnected();
    }, [currentAccount]);

    useEffect(() => {
        try {
            setIsMining(true);
            const promise = new Promise(resolve => resolve(getEscrowData()));
            promise.then(data => {
                if (data) {
                    setEscrowData(data);
                    setIsMining(false);
                } else {
                    if (!window.ethereum) {
                        alert("please install metamask");
                    } else if (window.ethereum.network !== "4157") {
                        alert("please connect on CrossFi");
                    } else {
                        alert("something went wrong")
                    }
                    return;
                }
            });

        } catch (error) {
            if (!window.ethereum) {
                alert("please install metamask");
            } else if (window.ethereum.network !== "4157") {
                alert("please connect on CrossFi");
            } else {
                console.log(error);
            }
            return;
        }
    }, [currentAccount]);

    return (
        <AccountContext.Provider value={{ currentAccount, setCurrentAccount, escrowData, setEscrowData, isMining, setIsMining }}>
            <div>
                <Header />
                <Form connectWallet={connectWallet} />
                <Dashboard />
                {/* <Footer /> */}
            </div>
        </AccountContext.Provider>
    );
}

export default App;