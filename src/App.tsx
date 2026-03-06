import { useGameStore } from './store/useGameStore';
import { formatNumber } from './utils/formatters';

export default function App() {
  const { resources, manualMine, manualEnergy } = useGameStore();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-mono">
      <h1 className="text-2xl font-bold text-cyan-400 mb-6">
        宇宙殖民 (Space Colonization)
      </h1>
      <section className="mb-4">
        <p>星際礦物: {formatNumber(resources.minerals)}</p>
        <p>能源: {formatNumber(resources.energy)}</p>
      </section>
      <section className="flex gap-4">
        <button
          onClick={manualMine}
          className="px-4 py-2 border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-gray-900"
        >
          ⛏️ 開採隕石
        </button>
        <button
          onClick={manualEnergy}
          className="px-4 py-2 border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900"
        >
          ⚡ 手搖發電機
        </button>
      </section>
    </div>
  );
}
