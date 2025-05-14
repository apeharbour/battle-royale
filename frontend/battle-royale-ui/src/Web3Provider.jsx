/* eslint-disable no-unused-vars */
import { createContext, useContext, useEffect, useState } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import punkLogo from "./images/punkLogo.png";

// Define ApeChain
const apeChain = {
  id: 33139,
  name: 'ApeChain',
  network: 'apechain',
  nativeCurrency: {
    name: 'ApeCoin',
    symbol: 'APE',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.apechain.com/http'],
    },
    public: {
      http: ['https://rpc.apechain.com/http'],
    },
  },
  blockExplorers: {
    default: {
      name: 'ApeChain Explorer',
      url: 'https://apescan.io',
    },
  },
};

const curtisChain = {
  id: 33111,
  name: 'CurtisChain',
  network: 'curtischain',
  nativeCurrency: {
    name: 'ApeCoin',
    symbol: 'APE',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://curtis.rpc.caldera.xyz/http'],
    },
    public: {
      http: ['wss://curtis.rpc.caldera.xyz/ws'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Curtis Explorer',
      url: 'https://curtis.explorer.caldera.xyz/',
    },
  },
};

const Web3Context = createContext();

export const useWeb3 = () => useContext(Web3Context);

const config = createConfig(
  getDefaultConfig({
    chains: [apeChain],
    // transports: {
    //   [apeChain.id]: http('https://rpc.apechain.com/http'),
    // },
    walletConnectProjectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
    appName: "yarts",
    appDescription: "yarts - onchain art",
    appUrl: "https://yarts.xyz",
    appIcon: punkLogo,
  })
);

const queryClient = new QueryClient();

export const Web3Provider = ({ theme, children }) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const storedConnection = localStorage.getItem("walletConnected");
    if (storedConnection) {
      setIsConnected(true);
    }
  }, []);

  const connectWallet = () => {
    localStorage.setItem("walletConnected", "true");
    setIsConnected(true);
  };

  const disconnectWallet = () => {
    localStorage.removeItem("walletConnected");
    setIsConnected(false);
  };

  return (
    <Web3Context.Provider
      value={{ isConnected, connectWallet, disconnectWallet }}
    >
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <ConnectKitProvider theme="auto" mode={theme.palette.mode}>
            {children}
          </ConnectKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </Web3Context.Provider>
  );
};
