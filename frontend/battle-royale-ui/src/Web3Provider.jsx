import { WagmiProvider, createConfig, http, fallback } from "wagmi";
import {
  mainnet,
  localhost,
  optimismSepolia,
  sepolia,
  optimism,
} from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ConnectKitProvider, getDefaultConfig } from "connectkit";
import punkLogo from "./images/punkLogo.png";

const config = createConfig(
  getDefaultConfig({
    // Your dApps chains
    chains: [localhost, sepolia, mainnet, optimism],
    transports: {
      // RPC URL for each chain
      [localhost.id]: http(
        import.meta.env.VITE_LOCALHOST_RPC_URL || "http://localhost:8545"
      ),
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
    },

    // Required API Keys
    walletConnectProjectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID,

    // Required App Info
    appName: "Punkships Royale",

    // Optional App Info
    appDescription: "A battle royale game on the blockchain.",
    appUrl: "https://punkships.io", // your app's url
    appIcon: punkLogo, // your app's icon, no bigger than 1024x1024px (max. 1MB)
  })
);

const queryClient = new QueryClient();

export const Web3Provider = ({ theme, children }) => {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <ConnectKitProvider theme="auto" mode={theme.palette.mode}>
          {children}
        </ConnectKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
