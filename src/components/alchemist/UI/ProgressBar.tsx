"use client";
import { useState, useEffect } from "react";
import { totalUniqueElements, recipes, Element } from "../Constants";

interface ProgressBarProps {
  discovered: string[];
  inventory: { [key in Element]?: number };
  onGetHint: (hint: string) => void;
}

export const ProgressBar = ({ discovered, inventory, onGetHint }: ProgressBarProps) => {
  const [hintCooldown, setHintCooldown] = useState(0);

  useEffect(() => {
    if (hintCooldown > 0) {
      const timer = setTimeout(() => setHintCooldown(hintCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [hintCooldown]);

  const handleGetHint = () => {
    if (hintCooldown > 0) {
      const minutes = Math.floor(hintCooldown / 60);
      const seconds = hintCooldown % 60;
      onGetHint(`Hint is on cooldown for ${minutes}m ${seconds}s`);
      return;
    }

    const undiscoveredRecipes = Object.values(recipes).filter(
      (r) => !discovered.includes(r.result)
    );

    if (undiscoveredRecipes.length === 0) {
      onGetHint("You've discovered everything!");
      return;
    }

    const potentialHints = undiscoveredRecipes.filter(
      (r) => (inventory[r.a] || 0) > 0 && (inventory[r.b] || 0) > (r.a === r.b ? 1 : 0)
    );

    if (potentialHints.length === 0) {
      onGetHint("No hints available right now. You might need more elements.");
      return;
    }

    const randomRecipe = potentialHints[Math.floor(Math.random() * potentialHints.length)];
    onGetHint(`Try combining ${randomRecipe.a} and ${randomRecipe.b}.`);
    setHintCooldown(300);
  };

  const discoveredCount = discovered.length;

  return (
    <div className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-lg text-center space-y-3">
      <div>
        <p className="text-white font-bold text-sm sm:text-base">Discovered {discoveredCount}/{totalUniqueElements} elements</p>
        <div className="w-full bg-gray-700 h-3 rounded-lg mt-2">
          <div className="bg-purple-500 h-3 rounded-lg transition-all duration-500" style={{ width: `${(discoveredCount / totalUniqueElements) * 100}%` }} />
        </div>
      </div>
      <div className="border-t border-gray-700 pt-3">
        <button onClick={handleGetHint} disabled={hintCooldown > 0} className="bg-yellow-500/20 hover:bg-yellow-500/40 text-yellow-300 font-bold py-2 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed">
          {hintCooldown > 0 ? `Hint in ${Math.floor(hintCooldown / 60)}:${(hintCooldown % 60).toString().padStart(2, '0')}` : "Get Hint"}
        </button>
      </div>
    </div>
  );
};