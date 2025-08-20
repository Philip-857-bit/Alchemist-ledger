// components/PlayerProfile.tsx
"use client";

import { usePrivy, CrossAppAccountWithMetadata } from '@privy-io/react-auth';
import { useState, useEffect } from 'react';
import AlchemistGame from './AlchemistGame';
import Leaderboard from './Leaderboard';

interface MonadUser {
  id: number;
  username: string;
  walletAddress: string;
}

export default function PlayerProfile() {
  const { ready, authenticated, user, login, logout } = usePrivy();
  const [monadWallet, setMonadWallet] = useState<string | null>(null);
  const [monadUser, setMonadUser] = useState<MonadUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!ready) {
      setIsLoading(true);
      return;
    }
    
    if (!authenticated || !user) {
      setIsLoading(false);
      return;
    }

    const crossAppAccount = user.linkedAccounts.find(
      (account) =>
        account.type === 'cross_app' &&
        account.providerApp.id === 'cmd8euall0037le0my79qpz42'
    ) as CrossAppAccountWithMetadata | undefined;

    if (crossAppAccount?.embeddedWallets[0]?.address) {
      const walletAddress = crossAppAccount.embeddedWallets[0].address;
      setMonadWallet(walletAddress);

      fetch(`https://monad-games-id-site.vercel.app/api/check-wallet?wallet=${walletAddress}`)
        .then(res => res.json())
        .then(data => {
          if (data.hasUsername) {
            setMonadUser(data.user);
          }
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch username:", err);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [ready, authenticated, user]);

  if (isLoading) {
    return <div className="text-center p-4">Loading Player...</div>;
  }

  if (!authenticated) {
    return (
      <button
        onClick={login}
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg"
      >
        Sign In with Monad Games ID
      </button>
    );
  }

  return (
    <div className="w-full flex flex-col items-center px-2 sm:px-0">
      <div className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg text-center w-full max-w-4xl">
        {monadUser ? (
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">Welcome, {monadUser.username}</h3>
            <p className="text-gray-400 mt-2 break-all text-xs sm:text-sm">Wallet: {monadWallet}</p>
            <button onClick={logout} className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-sm sm:text-base">
              Logout
            </button>
          </div>
        ) : (
          <div>
            <p className="text-lg sm:text-xl text-white">Your Monad wallet is linked!</p>
            <p className="text-gray-300 mt-2 text-sm sm:text-base">You need a username to join the leaderboard.</p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mt-4">
                <a
                  href="https://monad-games-id-site.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
                >
                  Reserve Your Username Here
                </a>
                <button onClick={logout} className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg">
                  Logout
                </button>
            </div>
          </div>
        )}
      </div>

      {monadWallet && (
        <>
          <Leaderboard playerAddress={monadWallet} />
          <AlchemistGame playerAddress={monadWallet} />
        </>
      )}
    </div>
  );
}