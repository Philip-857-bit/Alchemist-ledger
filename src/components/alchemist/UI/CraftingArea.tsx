"use client";
import { motion } from "framer-motion";
import { Element } from "../Constants";

interface CraftingAreaProps {
  isSubmitting: boolean;
  onCraft: () => void;
  slotA: Element | null;
  slotB: Element | null;
  clearSlots: () => void;
}

export const CraftingArea = ({ isSubmitting, onCraft, slotA, slotB, clearSlots }: CraftingAreaProps) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg grid grid-cols-3 items-center gap-2 md:gap-4">
      <motion.div whileTap={{ scale: 0.9 }} className="text-4xl border-2 border-dashed border-gray-600 rounded-lg aspect-square flex items-center justify-center cursor-pointer">{slotA}</motion.div>
      <span className="text-3xl font-bold text-center">+</span>
      <motion.div whileTap={{ scale: 0.9 }} className="text-4xl border-2 border-dashed border-gray-600 rounded-lg aspect-square flex items-center justify-center cursor-pointer">{slotB}</motion.div>
      <div className="col-span-3 flex gap-2 mt-2 justify-center">
        <button onClick={onCraft} disabled={!slotA || !slotB || isSubmitting} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-lg disabled:bg-gray-500">{isSubmitting ? "..." : "Craft"}</button>
        <button onClick={clearSlots} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-3 rounded-lg">Clear</button>
      </div>
    </div>
  );
};
