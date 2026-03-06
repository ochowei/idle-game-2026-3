import { useGameStore, BUILDING_CONFIGS, BuildingId } from '../../store/useGameStore';
import { formatNumber } from '../../utils/formatters';

interface BuildingItemProps {
  id: BuildingId;
}

export function BuildingItem({ id }: BuildingItemProps) {
  const cfg = BUILDING_CONFIGS[id];

  const count = useGameStore((s) => s.buildings[id]);
  const minerals = useGameStore((s) => s.resources.minerals);
  const getBuildingCost = useGameStore((s) => s.getBuildingCost);
  const buyBuilding = useGameStore((s) => s.buyBuilding);

  const cost = getBuildingCost(id);
  const canAfford = minerals >= cost;

  return (
    <div className="flex items-center justify-between border border-gray-700 p-3 mb-2 bg-gray-800">
      {/* 左側：建築資訊 */}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <span className="text-white font-semibold">{cfg.name}</span>
          <span className="text-gray-500 text-xs">x{count}</span>
        </div>
        <p className="text-gray-400 text-xs mt-1">{cfg.desc}</p>
        <div className="flex gap-3 mt-1 text-xs text-gray-500">
          {cfg.prodMinerals > 0 && (
            <span className="text-cyan-400">+{cfg.prodMinerals} 礦物/s</span>
          )}
          {cfg.prodEnergy > 0 && (
            <span className="text-yellow-400">+{cfg.prodEnergy} 能源/s</span>
          )}
          {cfg.consEnergy > 0 && (
            <span className="text-red-400">-{cfg.consEnergy} 能源/s</span>
          )}
        </div>
      </div>

      {/* 右側：成本與購買 */}
      <div className="ml-4 text-right">
        <p className={`text-sm mb-1 ${canAfford ? 'text-white' : 'text-gray-600'}`}>
          ⛏️ {formatNumber(cost)}
        </p>
        <button
          onClick={() => buyBuilding(id)}
          disabled={!canAfford}
          className={`px-3 py-1 text-sm border transition-colors
            ${canAfford
              ? 'border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-gray-900 cursor-pointer'
              : 'border-gray-700 text-gray-700 cursor-not-allowed'
            }`}
        >
          購買
        </button>
      </div>
    </div>
  );
}
