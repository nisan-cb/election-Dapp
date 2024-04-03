import { Contract, ContractAbi } from "web3";


// export const getCurrentBlockNumber = () => {
//     // return new Promise((resolve, reject) => {
//     console.log('here')
//     window?.web3.eth.getBlockNumber((error: Error | null, latestBlockNumber: number) => {
//         if (error) {
//             console.error('Error getting latest block number:', error);
//             console.log(0)
//             // resolve(0)
//         } else {
//             console.log(latestBlockNumber)
//             // resolve(latestBlockNumber)
//         }
//     });
//     // })
// }

export const subscribeEvent = async (contract: Contract<ContractAbi>, eventName: string, cb?: (event: any) => void) => {
    try {
        if (!contract) return
        const eventInstance = contract?.events[eventName]({});
        eventInstance?.on('data', (event: any) => {
            cb?.(event)
        });

        eventInstance?.on('error', console.error);
    } catch (error) {
        console.log(error)
    }

}