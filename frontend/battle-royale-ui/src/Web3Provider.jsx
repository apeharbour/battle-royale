import React, { useEffect, useState, useCallback, useMemo } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import yartsLogo from "./images/yartsLogo.png";
import Web3Context from "./contexts/Web3Context";



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
  name: "CurtisChain",
  network: "curtischain",
  nativeCurrency: {
    name: "ApeCoin",
    symbol: "APE",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://curtis.rpc.caldera.xyz/http"] },
    public: { http: ["wss://curtis.rpc.caldera.xyz/ws"] },
  },
  blockExplorers: {
    default: {
      name: "Curtis Explorer",
      url: "https://curtis.explorer.caldera.xyz/",
    },
  },
};

const wagmiConfig = createConfig(
  getDefaultConfig({
    chains: [curtisChain],
    transports: {
      [curtisChain.id]: http(curtisChain.rpcUrls.default.http[0]),
    },
    walletConnectProjectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,
    appName: "Battle Royale",
    appDescription: "A battle royale game on the blockchain.",
    appUrl: "https://yarts.xyz",
    appIcon: yartsLogo,
  })
);

const queryClient = new QueryClient();

export function Web3Provider({ theme, children }) {
  const [isConnected, setIsConnected] = useState(false);

  // only run on mount
  useEffect(() => {
    const isWalletConnected =
      localStorage.getItem("walletConnected") === "true";
    setIsConnected(isWalletConnected);
  }, []);

  // stable connect/disconnect callbacks
  const connectWallet = useCallback(() => {
    localStorage.setItem("walletConnected", "true");
    setIsConnected(true);
  }, []);

  const disconnectWallet = useCallback(() => {
    localStorage.removeItem("walletConnected");
    setIsConnected(false);
  }, []);

  // memoize context value
  const contextValue = useMemo(
    () => ({ isConnected, connectWallet, disconnectWallet }),
    [isConnected, connectWallet, disconnectWallet]
  );

  return (
    <Web3Context.Provider value={contextValue}>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          {/* <ReactQueryDevtools initialIsOpen={false} /> */}
          <ConnectKitProvider
            theme="auto"
            mode={theme?.palette?.mode || "light"}
          >
            {children}
          </ConnectKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </Web3Context.Provider>
  );
}

export default Web3Provider;
