import type { GameState } from '../store/useGameStore';

export const STORAGE_KEY = 'space-colonization-save';

export type PersistedState = Pick<
  GameState,
  'resources' | 'buildings' | 'upgrades' | 'triggeredMilestones'
>;
