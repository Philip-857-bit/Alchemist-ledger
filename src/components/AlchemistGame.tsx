// components/AlchemistGame.tsx
"use client";

import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { useGameLogic } from "./alchemist/useGameLogic";
import { Element } from "./alchemist/Constants";
import { ProgressBar } from "./alchemist/UI/ProgressBar";
import { CraftingArea } from "./alchemist/UI/CraftingArea";
import { Inventory } from "./alchemist/UI/Inventory";
import { Discoveries } from "./alchemist/UI/Discoveries";
import { Achievements } from "./alchemist/UI/Achievements";

interface AlchemistGameProps {
  playerAddress: string;
}

export default function AlchemistGame({ playerAddress }: AlchemistGameProps) {
  const {
    inventory,
    discovered,
    achievements,
    message,
    isSubmitting,
    showConfetti,
    handleCraft,
    setMessage,
  } = useGameLogic(playerAddress);

  const [craftingSlotA, setCraftingSlotA] = useState<Element | null>(null);
  const [craftingSlotB, setCraftingSlotB] = useState<Element | null>(null);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSelectElement = (element: Element) => {
    if (craftingSlotA === element) { setCraftingSlotA(null); return; }
    if (craftingSlotB === element) { setCraftingSlotB(null); return; }
    if (!craftingSlotA) {
      setCraftingSlotA(element);
    } else if (!craftingSlotB) {
      if (craftingSlotA === element && (inventory[element] || 0) < 2) {
        setMessage(`You need at least 2 ${element} to combine it with itself.`);
        return;
      }
      setCraftingSlotB(element);
    }
  };
  
  const handleClearSlots = () => {
    setCraftingSlotA(null);
    setCraftingSlotB(null);
  }

  const handleDoCraft = () => {
    if(craftingSlotA && craftingSlotB) {
      handleCraft(craftingSlotA, craftingSlotB);
      handleClearSlots();
    }
  }

  return (
    <>
      {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} recycle={false} />}
      <div className="w-full mt-6 px-2 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <ProgressBar 
            discovered={discovered} 
            inventory={inventory} 
            onGetHint={(hint) => setMessage(hint)} 
          />
          <CraftingArea
            isSubmitting={isSubmitting}
            onCraft={handleDoCraft}
            slotA={craftingSlotA}
            slotB={craftingSlotB}
            clearSlots={handleClearSlots}
          />
          <p className="text-center text-sm md:text-base text-gray-300 h-5 truncate">{message}</p>
          <Inventory inventory={inventory} onSelectElement={handleSelectElement} />
        </div>
        <div className="space-y-4">
          <Discoveries discovered={discovered} />
          <Achievements achievements={achievements} />
        </div>
      </div>
    </>
  );
}
