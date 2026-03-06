import { useGameStore } from '../../store/useGameStore';
import { MILESTONES } from '../../data/milestones';

export function MilestoneNotification() {
  const pendingMilestone = useGameStore((s) => s.pendingMilestone);
  const dismissMilestone = useGameStore((s) => s.dismissMilestone);

  if (!pendingMilestone) return null;

  const milestone = MILESTONES.find((m) => m.id === pendingMilestone);
  if (!milestone) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/60">
      <div className="bg-gray-900 border border-cyan-400 p-8 max-w-sm w-full text-center shadow-lg">
        <div className="text-4xl mb-3">{milestone.title.split(' ')[0]}</div>
        <h2 className="text-xl font-bold text-cyan-400 mb-2">
          {milestone.title.replace(/^\S+\s/, '')}
        </h2>
        <p className="text-gray-300 text-sm mb-6">{milestone.desc}</p>
        <button
          onClick={dismissMilestone}
          className="px-6 py-2 border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-gray-900 transition-colors"
        >
          繼續
        </button>
      </div>
    </div>
  );
}
