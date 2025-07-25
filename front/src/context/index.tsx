import React, { useEffect, useRef, useState } from 'react';
import Web3, { Contract } from 'web3';
import ElectionContractArtifact from '../../../truffle/build/contracts/Election.json';
import { subscribeEvent } from '../services/web3';

export interface ICandidate {
    id: number;
    name: string;
    voteCount: number;
    ideology: {
        economy: number;
        education: number;
        security: number;
    }
}

const initialContext = {
    candidates: [] as ICandidate[],
    currentAccount: '' as string,
    isOwner: false as boolean,
    connectAccountHandler: () => { },
    electionContract: undefined as Contract<typeof ElectionContractArtifact.abi> | undefined,
    isCurrentUserHasVoted: false,
    startTimeInMs: 0,
    endTimeInMs: 0,
    isOpen: false,
    timeToStart: 0,
    timeToEnd: 0,
    isLoading: false
}

type AppContextType = typeof initialContext


export const AppContext = React.createContext<AppContextType>(initialContext);

const ContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState('');
    const [electionContract, setElectionContractInstance] = useState<Contract<typeof ElectionContractArtifact.abi>>();
    const [isOwner, setIsOwner] = useState(false);
    const [candidates, setCandidates] = useState<ICandidate[]>([]);
    const [isCurrentUserHasVoted, setIsCurrentUserHasVoted] = useState(false);
    const [startTimeInMs, setStartTime] = useState<number>(0);
    const [endTimeInMs, setEndTime] = useState<number>(0);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [timeToStart, setTimeToStart] = useState(0);
    const [timeToEnd, setTimeToEnd] = useState(0);
    const timerIDref = useRef<NodeJS.Timeout | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        initWeb3Provider();
        checkWalletIsConnected();
        initContract();
    }, []);

    useEffect(() => {
        checkIsOwner();
    }, [currentAccount])

    useEffect(() => {
        if (!electionContract) return;
        subscribeEvents()
        getCandidates();
        getTime();
    }, [electionContract])

    useEffect(() => {
        clearInterval(timerIDref.current)
        setTimeToStart(startTimeInMs - Date.now());
        setTimeToEnd(endTimeInMs - Date.now());

        timerIDref.current = setInterval(() => {
            setTimeToStart(prev => prev - 1000)
            setTimeToEnd(prev => prev - 1000)
        }, 1000);
        return () => {
            clearInterval(timerIDref.current)
        }
    }, [startTimeInMs, endTimeInMs]);

    useEffect(() => {
        setIsOpen(timeToStart <= 0 && timeToEnd > 0)
    }, [timeToStart, timeToEnd])

    const subscribeEvents = async () => {
        if (!electionContract) return
        subscribeEvent(electionContract, 'NewCandidate', () => getCandidates())
        subscribeEvent(electionContract, 'Reset', () => initContract())
        subscribeEvent(electionContract, 'NewVote', () => {
            getCandidates();
            connectAccountHandler();
            checkIsCurrentUserHasVoted();
        })
    }


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
        console.log('connectAccountHandler')
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
        setIsLoading(true)
        const candidatesCount: number = await electionContract?.methods.candidatesCount().call();
        const array: ICandidate[] = [];
        for (let i = 1; i <= candidatesCount; i++) {
            const candidate: any = await electionContract?.methods.candidates(i).call();
            array.push({
                id: Number(candidate[0]),
                name: candidate[1],
                voteCount: Number(candidate[2]),
                ideology: {
                    economy: Number(candidate[3][0]),
                    education: Number(candidate[3][1]),
                    security: Number(candidate[3][2])
                }
            })

        }
        setCandidates(array);
        setIsLoading(false)
    }

    const getTime = async () => {
        if (!electionContract) return;
        const startTime: number = await electionContract.methods.startTime().call();
        const endTime: number = await electionContract.methods.endTime().call();

        setStartTime(Number(startTime) * 1000);
        setEndTime((Number(endTime) * 1000))

    }

    const checkIsCurrentUserHasVoted = async () => {
        if (!electionContract || !currentAccount) return;
        const res: boolean = await electionContract?.methods.voters(currentAccount).call();
        console.log({ res })
        setIsCurrentUserHasVoted(res);
    }


    return (
        <AppContext.Provider value={{
            isOwner, currentAccount, candidates, connectAccountHandler, electionContract, isCurrentUserHasVoted,
            startTimeInMs, endTimeInMs, isOpen, timeToStart, timeToEnd, isLoading
        }}>
            {children}
        </AppContext.Provider>
    )
}

export default ContextProvider;
