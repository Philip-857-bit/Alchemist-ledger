"use client";
import { achievementsList } from "../Constants";

interface AchievementsProps {
  achievements: string[];
}

export const Achievements = ({ achievements }: AchievementsProps) => {
  return (
    <div className="bg-gray-900/60 p-4 rounded-lg">
      <h3 className="text-lg font-bold mb-3 text-white">Achievements</h3>
      <ul className="space-y-1 text-sm max-h-64 lg:max-h-none overflow-y-auto">
        {achievementsList.map((ach) => (
          <li key={ach.id} className={`p-2 rounded transition-colors ${achievements.includes(ach.id) ? "bg-green-600/30 text-green-300" : "bg-gray-700/30 text-gray-400"}`}>
            {achievements.includes(ach.id) ? `✅ ${ach.title}` : `🔒 ${ach.title}`}
          </li>
        ))}
      </ul>
    </div>
  );
};
