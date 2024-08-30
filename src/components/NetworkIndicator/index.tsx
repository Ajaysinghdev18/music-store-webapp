
interface INetworkIndicator {
    [key: number]: string
}

interface INetworkIndicatorProps {
    networkId: number;
    props: any
}

const names: INetworkIndicator = {
  1: "Ethereum mainnet",
  3: "Ethereum ropsten",
  56: "Binance smart chain",
  97: "Binance testnet",
  43113: "Avalanche testnet",
  43114: "Avalanche mainet",
  9999: "Casper Signer",
};

export const getNetworkName = (chainId: number | string) => {
  return names[chainId as number] ?? "Wrong network";
};
