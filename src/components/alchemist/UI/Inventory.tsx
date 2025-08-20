"use client";
import { motion } from "framer-motion";
import { Element, rarityMap, rarityOrder } from "../Constants";

interface InventoryProps {
  inventory: { [key in Element]?: number };
  onSelectElement: (element: Element) => void;
}

export const Inventory = ({ inventory, onSelectElement }: InventoryProps) => {
  const sortedInventory = Object.entries(inventory).sort(([elA], [elB]) => {
    const rarityA = rarityOrder.indexOf(rarityMap[elA as Element]);
    const rarityB = rarityOrder.indexOf(rarityMap[elB as Element]);
    return rarityA - rarityB || elA.localeCompare(elB);
  });

  return (
    <div className="bg-gray-800 p-4 rounded-lg">
      <h3 className="text-lg font-bold mb-3 text-white">Your Inventory</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 max-h-64 overflow-y-auto">
        {sortedInventory.map(([element, count]) =>
          count > 0 ? (
            <motion.button whileTap={{ scale: 0.9 }} key={element} onClick={() => onSelectElement(element as Element)} className="bg-gray-700 hover:bg-gray-600 p-3 rounded-lg text-lg md:text-2xl relative transition-transform">
              {element}
              <span className={`absolute -top-2 -right-2 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center border-2 border-gray-800 ${count === 10 ? 'bg-yellow-500' : 'bg-purple-600'}`}>{count}</span>
              <span className="block text-xs text-gray-400 mt-1">{rarityMap[element as Element]}</span>
            </motion.button>
          ) : null
        )}
      </div>
    </div>
  );
};