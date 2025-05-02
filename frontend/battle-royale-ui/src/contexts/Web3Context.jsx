// src/Web3Context.jsx
import React, { createContext, useContext } from "react";

// Create the context
const Web3Context = createContext();

// Export the hook
export function useWeb3() {
  return useContext(Web3Context);
}

export default Web3Context;