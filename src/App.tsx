import { useGameStore } from './store/useGameStore';
import { formatNumber, formatRate } from './utils/formatters';
import { useGameLoop } from './hooks/useGameLoop';
import { StorePanel } from './components/Store/StorePanel';
import { MilestoneNotification } from './components/Milestone/MilestoneNotification';
import { useClickEffect, ClickEffectLayer } from './components/Effects/ClickEffect';

export default function App() {
  useGameLoop();

  const {
    resources,
    mineralsPerSec,
    energyPerSec,
    isPowerOutage,
    upgrades,
    manualMine,
    manualEnergy,
  } = useGameStore();

  const { spawn, floaters } = useClickEffect();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-mono">
      <h1 className="text-2xl font-bold text-cyan-400 mb-6">
        宇宙殖民 (Space Colonization)
      </h1>

      {isPowerOutage && (
        <div className="mb-4 px-4 py-2 bg-red-900 border border-red-500 text-red-300">
          ⚠️ 停電中！礦物產出暫停。請手動發電或購買太陽能陣列。
        </div>
      )}

      <section className="mb-6">
        <p>
          星際礦物: {formatNumber(resources.minerals)}
          <span className="text-gray-400 text-sm ml-2">
            ({formatRate(mineralsPerSec)})
          </span>
        </p>
        <p>
          能源: {formatNumber(resources.energy)}
          <span className="text-gray-400 text-sm ml-2">
            ({formatRate(energyPerSec)})
          </span>
        </p>
      </section>

      <section className="flex gap-4">
        <button
          onClick={(e) => {
            manualMine();
            spawn(e, upgrades.drill ? '+2' : '+1', 'text-yellow-300');
          }}
          className="px-4 py-2 border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-gray-900"
        >
          ⛏️ 開採隕石
        </button>
        <button
          onClick={(e) => {
            manualEnergy();
            spawn(e, '+1⚡', 'text-cyan-300');
          }}
          className="px-4 py-2 border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900"
        >
          ⚡ 手搖發電機
        </button>
      </section>

      <StorePanel />

      <MilestoneNotification />

      <ClickEffectLayer floaters={floaters} />
    </div>
  );
}
