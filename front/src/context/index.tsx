import React, { useEffect, useState } from 'react';
import Web3, { Contract } from 'web3';
import ElectionContractArtifact from '../../../truffle/build/contracts/Election.json';

export interface ICandidate {
    id: number;
    name: string;
    voteCount: number;
}

const initialContext = {
    candidates: [] as ICandidate[],
    currentAccount: '' as string,
    isOwner: false as boolean,
    connectAccountHandler: () => { },
    electionContract: undefined as Contract<typeof ElectionContractArtifact.abi> | undefined,
    isCurrentUserHasVoted: false
}

type AppContextType = typeof initialContext


export const AppContext = React.createContext<AppContextType>(initialContext);

const ContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState('');
    const [electionContract, setElectionContractInstance] = useState<Contract<typeof ElectionContractArtifact.abi>>();
    const [isOwner, setIsOwner] = useState(false);
    const [candidates, setCandidates] = useState<ICandidate[]>([]);
    const [isCurrentUserHasVoted, setIsCurrentUserHasVoted] = useState(false);

    useEffect(() => {
        initWeb3Provider();
        checkWalletIsConnected();
        initContract();
    }, []);

    useEffect(() => {
        checkIsOwner();
    }, [currentAccount])

    useEffect(() => {
        getCandidates();
    }, [electionContract])

    useEffect(() => {
        checkIsCurrentUserHasVoted();

    }, [currentAccount, electionContract])

    const initWeb3Provider = () => {
        if (typeof window.ethereum !== 'undefined') {
            // If a web3 instance is already provided by Meta Mask.
            window.web3 = new Web3(window.ethereum);
        } else {
            // Specify default instance if no web3 instance provided
            window.web3 = new Web3.providers.HttpProvider('http://localhost:7545');
        }
    }

    const checkWalletIsConnected = async () => {
        if (!window.ethereum) {
            console.log('Make sure you have Metamask installed!')
            return;
        }
        console.log('Wallet exists! We\'re ready to go');

        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length !== 0) {
            setCurrentAccount(accounts[0])
        } else {
            console.log('No authorized accounts');
        }
    }

    const connectAccountHandler = async () => {
        try {
            if (!window.ethereum)
                alert("Please install MetaMask")
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            setCurrentAccount(accounts[0])
        } catch (error) {
            console.log(error);
        }
    };

    const initContract = async () => {
        try {
            const electionContractInstance = new window.web3.eth.Contract(ElectionContractArtifact.abi, ElectionContractArtifact.networks[5777].address)
            setElectionContractInstance(electionContractInstance)

        } catch (error) {
            console.log(error)
        }
    }

    const checkIsOwner = async () => {

        if (!electionContract) return;

        const res: boolean = await electionContract.methods.isOwner().call({ from: currentAccount });

        setIsOwner(res);
    }

    const getCandidates = async () => {
        if (!electionContract) return;
        const candidatesCount: number = await electionContract?.methods.candidatesCount().call();
        const array: ICandidate[] = [];
        for (let i = 1; i <= candidatesCount; i++) {
            const candidate: any = await electionContract?.methods.candidates(i).call();
            array.push({
                id: Number(candidate[0]),
                name: candidate[1],
                voteCount: Number(candidate[2])
            })

        }
        setCandidates(array);
    }

    const checkIsCurrentUserHasVoted = async () => {
        if (!electionContract || !currentAccount) return;
        const res: boolean = await electionContract?.methods.voters(currentAccount).call();
        setIsCurrentUserHasVoted(res);
    }


    return (
        <AppContext.Provider value={{ isOwner, currentAccount, candidates, connectAccountHandler, electionContract, isCurrentUserHasVoted }}>
            {children}
        </AppContext.Provider>
    )
}

export default ContextProvider;
