import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import { Element, BASE_ELEMENTS, recipes, normalizeKey, rarityMap, achievementsList } from "./Constants";

export const useGameLogic = (playerAddress: string) => {
  const [inventory, setInventory] = useState<{ [key in Element]?: number }>(() => {
    if (typeof window === 'undefined') return { '💧 Water': 10, '🌍 Earth': 10, '🔥 Fire': 10, '🌬️ Air': 10 };
    const saved = localStorage.getItem('alchemist-inventory-counts');
    return saved ? JSON.parse(saved) : { '💧 Water': 10, '🌍 Earth': 10, '🔥 Fire': 10, '🌬️ Air': 10 };
  });

  const [discovered, setDiscovered] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem('alchemist-discovered');
    return saved ? JSON.parse(saved) : [];
  });

  const [achievements, setAchievements] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    const saved = localStorage.getItem("alchemist-achievements");
    return saved ? JSON.parse(saved) : [];
  });

  const [message, setMessage] = useState('Select two elements to combine them.');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Resource Regeneration
  useEffect(() => {
    const interval = setInterval(() => {
      setInventory(current => {
        const newInventory = { ...current };
        BASE_ELEMENTS.forEach(el => {
          if ((newInventory[el] || 0) < 10) newInventory[el] = (newInventory[el] || 0) + 1;
        });
        return newInventory;
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Save Progress
  useEffect(() => {
    localStorage.setItem('alchemist-inventory-counts', JSON.stringify(inventory));
    localStorage.setItem('alchemist-discovered', JSON.stringify(discovered));
    localStorage.setItem('alchemist-achievements', JSON.stringify(achievements));
  }, [inventory, discovered, achievements]);

  // Check for achievements
  useEffect(() => {
    const unlocked = [...achievements];
    let newAchievementUnlocked = false;
    achievementsList.forEach(ach => {
      if (!unlocked.includes(ach.id) && ach.condition(discovered)) {
        unlocked.push(ach.id);
        toast.success(`🏆 Achievement Unlocked: ${ach.title}`);
        newAchievementUnlocked = true;
      }
    });
    if (newAchievementUnlocked) setAchievements(unlocked);
  }, [discovered, achievements]);

  const handleCraft = useCallback(async (slotA: Element, slotB: Element) => {
    if (!slotA || !slotB) return;
    if ((inventory[slotA] || 0) < 1 || (inventory[slotB] || 0) < (slotA === slotB ? 2 : 1)) {
      setMessage("Not enough resources.");
      return;
    }

    const newInventory = { ...inventory };
    newInventory[slotA]! -= 1;
    newInventory[slotB]! -= 1;

    const recipe = recipes[normalizeKey(slotA, slotB)];

    if (recipe) {
      newInventory[recipe.result] = (newInventory[recipe.result] || 0) + 1;
      if (!discovered.includes(recipe.result)) {
        toast.success(`✨ New ${rarityMap[recipe.result]} element: ${recipe.result}`);
        setDiscovered(d => [...d, recipe.result]);
      } else {
        setMessage(`Success! You crafted: ${recipe.result}`);
      }
      if (recipe.result === '💎 Diamond') {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 8000);
      }
      setIsSubmitting(true);
      try {
        await fetch('/api/submit-score', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ playerAddress, scoreAmount: recipe.result === '💎 Diamond' ? 100 : 10, transactionAmount: 1 }),
        });
      } catch (error) {
        console.error("Score submission failed:", error);
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setMessage("The reaction fizzled out. Both elements were lost.");
    }
    setInventory(newInventory);
  }, [inventory, discovered, playerAddress]);

  return {
    inventory,
    discovered,
    achievements,
    message,
    isSubmitting,
    showConfetti,
    handleCraft,
    setMessage
  };
};
