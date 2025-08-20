"use client";

import { useState, useEffect } from "react";
import { createPublicClient, http } from "viem";
import { contractAbi } from "../lib/abi";

// Define the Monad Testnet chain details
const monadTestnet = {
  id: 10143,
  name: "Monad Testnet",
  network: "monad-testnet",
  nativeCurrency: { name: "MONAD", symbol: "MONAD", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://testnet-rpc.monad.xyz"] },
    public: { http: ["https://testnet-rpc.monad.xyz"] },
  },
};

const contractAddress = "0xceCBFF203C8B6044F52CE23D914A1bfD997541A4";

// Set up the read-only public client
const publicClient = createPublicClient({
  chain: monadTestnet,
  transport: http(),
});

// Helper function to determine rank & thresholds
const rankThresholds: { threshold: number; rank: string }[] = [
  { threshold: 1000, rank: "Emperor Alchemist" },
  { threshold: 500, rank: "Venerate Alchemist" },
  { threshold: 300, rank: "King Alchemist" },
  { threshold: 200, rank: "Master Alchemist" },
  { threshold: 100, rank: "Adept Creator" },
  { threshold: 50, rank: "Skilled Crafter" },
  { threshold: 1, rank: "Apprentice" },
  { threshold: 0, rank: "Novice" },
];

const getRankFromScore = (score: bigint): string => {
  const scoreNum = Number(score);
  for (const { threshold, rank } of rankThresholds) {
    if (scoreNum >= threshold) return rank;
  }
  return "Novice";
};

// Dynamic colors per rank
const rankColors: Record<string, string> = {
  Novice: "text-gray-400",
  Apprentice: "text-green-400",
  "Adept Creator": "text-blue-400",
  "Skilled Crafter": "text-blue-400",
  "Master Alchemist": "text-purple-400",
  "King Alchemist": "text-purple-500",
  "Venerate Alchemist": "text-yellow-300",
  "Emperor Alchemist": "text-yellow-400",
};

interface LeaderboardProps {
  playerAddress: string;
}

export default function Leaderboard({ playerAddress }: LeaderboardProps) {
  const [score, setScore] = useState<bigint | null>(null);
  const [transactions, setTransactions] = useState<bigint | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const rank = score !== null ? getRankFromScore(score) : "Novice";

  // Format numbers
  const formatNum = (n: bigint | null) =>
    n !== null ? new Intl.NumberFormat().format(Number(n)) : "0";

  // Shorten address
  const shortAddress = (addr: string) =>
    addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : "";

  // Calculate progress toward next rank
  const progressPercent = (() => {
    if (score === null) return 0;
    const scoreNum = Number(score);
    const currentRankIndex = rankThresholds.findIndex(
      (r) => r.rank === rank
    );
    const currentThreshold = rankThresholds[currentRankIndex].threshold;
    const nextThreshold =
      currentRankIndex > 0
        ? rankThresholds[currentRankIndex - 1].threshold
        : currentThreshold;
    const progress =
      ((scoreNum - currentThreshold) / (nextThreshold - currentThreshold)) *
      100;
    return Math.max(0, Math.min(100, progress));
  })();

  useEffect(() => {
    if (!playerAddress) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const results = await publicClient.multicall({
          contracts: [
            {
              address: contractAddress,
              abi: contractAbi,
              functionName: "totalScoreOfPlayer",
              args: [playerAddress as `0x${string}`],
            },
            {
              address: contractAddress,
              abi: contractAbi,
              functionName: "totalTransactionsOfPlayer",
              args: [playerAddress as `0x${string}`],
            },
          ],
        });

        setScore(results[0].result as bigint);
        setTransactions(results[1].result as bigint);
      } catch (err) {
        console.error("Failed to fetch score:", err);
        setError("⚠️ Could not load leaderboard data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [playerAddress]);

  if (isLoading) {
    return <div className="text-center text-gray-400">Loading Score...</div>;
  }

  if (error) {
    return <div className="text-center text-red-400">{error}</div>;
  }

  return (
    <div className="w-full max-w-4xl mt-4 bg-gray-800 p-4 sm:p-6 rounded-lg">
      <h3 className="text-lg sm:text-xl font-bold mb-4 text-white text-center">
        Your Global Standing
      </h3>

      <p className="text-center text-gray-400 text-sm mb-2">
        Address: <span className="font-mono">{shortAddress(playerAddress)}</span>
      </p>

      <div className="text-center mb-4">
        <p className="text-gray-400 text-xs sm:text-sm uppercase">Rank</p>
        <p
          className={`text-2xl sm:text-3xl font-bold ${
            rankColors[rank] || "text-white"
          }`}
        >
          {rank}
        </p>

        {/* Progress bar toward next rank */}
        <div className="w-full bg-gray-700 h-2 rounded mt-2">
          <div
            className="bg-yellow-400 h-2 rounded"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-gray-400 text-xs mt-1">
          Progress to next rank: {progressPercent.toFixed(0)}%
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-around text-center border-t border-gray-700 pt-4 gap-4 sm:gap-0">
        <div>
          <p className="text-2xl sm:text-3xl font-bold text-purple-400">
            {formatNum(score)}
          </p>
          <p className="text-gray-400 text-sm">Points</p>
        </div>
        <div>
          <p className="text-2xl sm:text-3xl font-bold text-purple-400">
            {formatNum(transactions)}
          </p>
          <p className="text-gray-400 text-sm">Transactions</p>
        </div>
      </div>
    </div>
  );
}
