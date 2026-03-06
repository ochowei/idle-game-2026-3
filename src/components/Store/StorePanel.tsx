import { BUILDING_CONFIGS, BuildingId, useGameStore } from '../../store/useGameStore';
import { BuildingItem } from './BuildingItem';

const BUILDING_IDS = Object.keys(BUILDING_CONFIGS) as BuildingId[];

export function StorePanel() {
  const buildings = useGameStore((s) => s.buildings);

  return (
    <section className="mt-8">
      <h2 className="text-lg font-bold text-cyan-400 mb-3">商店</h2>
      {BUILDING_IDS.map((id) => {
        const cfg = BUILDING_CONFIGS[id];
        const isUnlocked = !cfg.unlockCondition || cfg.unlockCondition(buildings);

        if (isUnlocked) {
          return <BuildingItem key={id} id={id} />;
        }

        // 尚未解鎖：顯示鎖定卡片
        return (
          <div
            key={id}
            className="mb-2 p-3 border border-gray-700 text-gray-600 opacity-60 cursor-not-allowed select-none"
          >
            <span className="mr-2">🔒</span>
            <span className="font-bold">{cfg.name}</span>
            {cfg.unlockHint && (
              <span className="ml-2 text-xs">（{cfg.unlockHint}）</span>
            )}
          </div>
        );
      })}
    </section>
  );
}
