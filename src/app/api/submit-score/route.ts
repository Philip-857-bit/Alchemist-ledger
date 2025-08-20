// app/api/submit-score/route.ts
import { createWalletClient, http, publicActions } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { contractAbi } from "../../../lib/abi";

// Define the Monad Testnet chain details
const monadTestnet = {
  id: 10143, // Monad Testnet Chain ID
  name: "Monad Testnet",
  network: "monad-testnet",
  nativeCurrency: { name: "MONAD", symbol: "MONAD", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://testnet-rpc.monad.xyz"] },
    public: { http: ["https://testnet-rpc.monad.xyz"] },
  },
};

const contractAddress = "0xceCBFF203C8B6044F52CE23D914A1bfD997541A4";

export async function POST(request: Request) {
  // 1. Check for the private key
  if (!process.env.GAME_PRIVATE_KEY) {
    throw new Error("GAME_PRIVATE_KEY is not set in the environment variables.");
  }

  // 2. Set up the backend wallet client
  const account = privateKeyToAccount(process.env.GAME_PRIVATE_KEY as `0x${string}`);
  const walletClient = createWalletClient({
    account,
    chain: monadTestnet,
    transport: http(),
  }).extend(publicActions);

  // 3. Get player data from the request body
  const { playerAddress, scoreAmount, transactionAmount } = await request.json();

  if (!playerAddress || scoreAmount === undefined || transactionAmount === undefined) {
    return new Response(
      JSON.stringify({ message: "Missing required parameters" }),
      { status: 400 }
    );
  }

  try {
    // 4. Call the 'updatePlayerData' function on the smart contract
    console.log(`Submitting score for ${playerAddress}: score ${scoreAmount}, txs ${transactionAmount}`);

    const { request: simRequest } = await walletClient.simulateContract({
      address: contractAddress,
      abi: contractAbi,
      functionName: "updatePlayerData",
      args: [playerAddress, scoreAmount, transactionAmount],
      account,
    });

    const hash = await walletClient.writeContract(simRequest);
    console.log(`Transaction successful with hash: ${hash}`);

    return new Response(JSON.stringify({ success: true, txHash: hash }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error submitting score:", error);
    return new Response(JSON.stringify({ success: false, message: "Server error" }), {
      status: 500,
    });
  }
}