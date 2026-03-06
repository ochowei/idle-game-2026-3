import { BUILDING_CONFIGS, BuildingId } from '../../store/useGameStore';
import { BuildingItem } from './BuildingItem';

const BUILDING_IDS = Object.keys(BUILDING_CONFIGS) as BuildingId[];

export function StorePanel() {
  return (
    <section className="mt-8">
      <h2 className="text-lg font-bold text-cyan-400 mb-3">商店</h2>
      {BUILDING_IDS.map((id) => (
        <BuildingItem key={id} id={id} />
      ))}
    </section>
  );
}
