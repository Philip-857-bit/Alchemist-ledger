// app/page.tsx
import PlayerProfile from "../components/PlayerProfile";

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen py-4 sm:py-8 bg-gray-900 text-white">
      <main className="flex flex-col items-center w-full flex-1 px-2 sm:px-4 text-center">
        <h1 className="text-4xl sm:text-6xl font-bold mb-4 sm:mb-8">
          The Alchemist's Ledger
        </h1>
        <PlayerProfile />
      </main>
    </div>
  );
}