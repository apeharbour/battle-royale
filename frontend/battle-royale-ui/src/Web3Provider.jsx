import React, { createContext, useContext, useEffect, useState } from "react";
import { WagmiProvider, createConfig, http, fallback, webSocket } from "wagmi";
import {
  mainnet,
  localhost,
  optimismSepolia,
  sepolia,
  optimism,
  baseSepolia,
} from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import punkLogo from "./images/punkLogo.png";

const Web3Context = createContext();

export const useWeb3 = () => useContext(Web3Context);

const config = createConfig(
  getDefaultConfig({
    chains: [baseSepolia, sepolia, localhost, mainnet, optimism],
    transports: {
      [localhost.id]: webSocket("ws://localhost:8545"),
      [sepolia.id]: fallback([
        http(import.meta.env.VITE_SEPOLIA_RPC_URL),
        http("https://sepolia-rpc.wagmi.io"),
      ]),
      [mainnet.id]: fallback([
        http(import.meta.env.VITE_MAINNET_RPC_URL),
        http("https://mainnet-rpc.wagmi.io"),
      ]),
      [optimism.id]: fallback([
        http(import.meta.env.VITE_OPTIMISM_RPC_URL),
        http("https://optimism-rpc.wagmi.io"),
      ]),
      [baseSepolia.id]: fallback([
        http(import.meta.env.VITE_BASE_SEPOLIA_RPC_URL),
        http("https://base-sepolia-rpc.wagmi.io"),
      ]),
    },
    walletConnectProjectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
    appName: "Punkships Royale",
    appDescription: "A battle royale game on the blockchain.",
    appUrl: "https://punkships.io",
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
          <ReactQueryDevtools initialIsOpen={false} />
          <ConnectKitProvider theme="auto" mode={theme.palette.mode}>
            {children}
          </ConnectKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </Web3Context.Provider>
  );
};
