"use client";
import { motion } from "framer-motion";
import { recipes, rarityMap } from "../Constants";

interface DiscoveriesProps {
  discovered: string[];
}

export const Discoveries = ({ discovered }: DiscoveriesProps) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-lg font-bold mb-3 text-white">Book of Discoveries</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 max-h-64 lg:max-h-[300px] overflow-y-auto">
        {Object.values(recipes).map((recipe) => {
          const isFound = discovered.includes(recipe.result);
          return (
            <motion.div key={recipe.result} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={`text-sm text-center p-2 rounded-md ${isFound ? 'bg-gray-700' : 'bg-gray-900/50'}`}>
              {isFound ? `${recipe.a} + ${recipe.b} = ${recipe.result}` : `??? + ??? = ???`}
              {isFound && <span className="text-xs text-gray-400"> ({rarityMap[recipe.result]})</span>}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};