import { create } from 'zustand';
import { MILESTONES, type MilestoneConditionArgs } from '../data/milestones';

// ─── 型別定義 ────────────────────────────────────────────

export type BuildingId = 'drone' | 'solar' | 'asteroid' | 'reactor';
export type UpgradeId = 'drill' | 'coating' | 'ai';

export interface Resources {
  minerals: number;
  energy: number;
}

export interface Buildings {
  drone: number;
  solar: number;
  asteroid: number;
  reactor: number;
}

export interface Upgrades {
  drill: boolean;
  coating: boolean;
  ai: boolean;
}

export interface BuildingConfig {
  id: BuildingId;
  name: string;
  desc: string;
  baseCost: number;   // 初始礦物成本
  costMult: number;   // 每次購買後成本乘數
  prodMinerals: number; // 每秒礦物產量
  prodEnergy: number;   // 每秒能源產量
  consEnergy: number;   // 每秒能源消耗
}

export interface UpgradeConfig {
  id: UpgradeId;
  name: string;
  desc: string;
  costMinerals: number;
}

// ─── 靜態設定（不放在 store 中，直接 export）──────────────

export const BUILDING_CONFIGS: Record<BuildingId, BuildingConfig> = {
  drone: {
    id: 'drone',
    name: '採礦無人機',
    desc: '基礎採礦設備。',
    baseCost: 10,
    costMult: 1.15,
    prodMinerals: 1,
    prodEnergy: 0,
    consEnergy: 0.5,
  },
  solar: {
    id: 'solar',
    name: '太陽能陣列',
    desc: '收集恆星光芒轉換為能源。',
    baseCost: 15,
    costMult: 1.15,
    prodMinerals: 0,
    prodEnergy: 2,
    consEnergy: 0,
  },
  asteroid: {
    id: 'asteroid',
    name: '小行星礦場',
    desc: '大型採礦設施，耗能巨大。',
    baseCost: 200,
    costMult: 1.15,
    prodMinerals: 15,
    prodEnergy: 0,
    consEnergy: 10,
  },
  reactor: {
    id: 'reactor',
    name: '核融合反應爐',
    desc: '提供龐大且穩定的能源。',
    baseCost: 500,
    costMult: 1.15,
    prodMinerals: 0,
    prodEnergy: 50,
    consEnergy: 0,
  },
};

export const UPGRADE_CONFIGS: Record<UpgradeId, UpgradeConfig> = {
  drill: {
    id: 'drill',
    name: '碳纖維鑽頭',
    desc: '手動開採隕石的收益 +1。',
    costMinerals: 100,
  },
  coating: {
    id: 'coating',
    name: '高導電塗層',
    desc: '太陽能陣列的產能提升 50%。',
    costMinerals: 250,
  },
  ai: {
    id: 'ai',
    name: 'AI 協同網絡',
    desc: '所有採礦無人機的礦物產量 x2。',
    costMinerals: 1000,
  },
};

// ─── Store 介面 ──────────────────────────────────────────

export interface GameState {
  // 動態資料
  resources: Resources;
  buildings: Buildings;
  upgrades: Upgrades;
  lastSaveTime: number;

  // 計算快取（每次 recalcRates 後更新）
  mineralsPerSec: number;
  energyPerSec: number;
  energyConsPerSec: number;
  isPowerOutage: boolean;
  triggeredMilestones: string[];     // 已達成的里程碑 ID 清單
  pendingMilestone: string | null;   // 待顯示的通知（顯示後清空）

  // Actions
  manualMine: () => void;
  manualEnergy: () => void;
  buyBuilding: (id: BuildingId) => void;
  buyUpgrade: (id: UpgradeId) => void;
  tick: (delta: number) => void;       // delta 單位：秒
  recalcRates: () => void;
  getBuildingCost: (id: BuildingId) => number;
  checkMilestones: () => void;
  dismissMilestone: () => void;
}

// ─── 輔助：計算建築成本 ──────────────────────────────────

function calcBuildingCost(id: BuildingId, count: number): number {
  const cfg = BUILDING_CONFIGS[id];
  return Math.floor(cfg.baseCost * Math.pow(cfg.costMult, count));
}

// ─── 輔助：計算當前產量（不修改 state，只回傳計算結果）──

function calcRates(buildings: Buildings, upgrades: Upgrades) {
  let mineralsPerSec = 0;
  let energyPerSec = 0;
  let energyConsPerSec = 0;

  // 採礦無人機
  let droneProd = BUILDING_CONFIGS.drone.prodMinerals;
  if (upgrades.ai) droneProd *= 2;
  mineralsPerSec += buildings.drone * droneProd;
  energyConsPerSec += buildings.drone * BUILDING_CONFIGS.drone.consEnergy;

  // 太陽能陣列
  let solarProd = BUILDING_CONFIGS.solar.prodEnergy;
  if (upgrades.coating) solarProd *= 1.5;
  energyPerSec += buildings.solar * solarProd;

  // 小行星礦場
  mineralsPerSec += buildings.asteroid * BUILDING_CONFIGS.asteroid.prodMinerals;
  energyConsPerSec += buildings.asteroid * BUILDING_CONFIGS.asteroid.consEnergy;

  // 核融合反應爐
  energyPerSec += buildings.reactor * BUILDING_CONFIGS.reactor.prodEnergy;

  return { mineralsPerSec, energyPerSec, energyConsPerSec };
}

// ─── Zustand Store ───────────────────────────────────────

export const useGameStore = create<GameState>((set, get) => ({
  // 初始資料
  resources: { minerals: 0, energy: 0 },
  buildings: { drone: 0, solar: 0, asteroid: 0, reactor: 0 },
  upgrades: { drill: false, coating: false, ai: false },
  lastSaveTime: Date.now(),

  // 初始計算快取
  mineralsPerSec: 0,
  energyPerSec: 0,
  energyConsPerSec: 0,
  isPowerOutage: false,
  triggeredMilestones: [],
  pendingMilestone: null,

  // ── 手動操作 ──────────────────────────────────────────

  manualMine: () => {
    const { upgrades } = get();
    const amount = 1 + (upgrades.drill ? 1 : 0);
    set((s) => ({
      resources: { ...s.resources, minerals: s.resources.minerals + amount },
    }));
  },

  manualEnergy: () => {
    set((s) => ({
      resources: { ...s.resources, energy: s.resources.energy + 1 },
      isPowerOutage: false, // 手動注入能源可解除停電
    }));
  },

  // ── 購買建築 ──────────────────────────────────────────

  buyBuilding: (id: BuildingId) => {
    const { resources, buildings, upgrades } = get();
    const cost = calcBuildingCost(id, buildings[id]);
    if (resources.minerals < cost) return;

    const newBuildings = { ...buildings, [id]: buildings[id] + 1 };
    const rates = calcRates(newBuildings, upgrades);

    set({
      resources: { ...resources, minerals: resources.minerals - cost },
      buildings: newBuildings,
      ...rates,
    });
  },

  // ── 購買升級 ──────────────────────────────────────────

  buyUpgrade: (id: UpgradeId) => {
    const { resources, buildings, upgrades } = get();
    if (upgrades[id]) return; // 已購買
    const cost = UPGRADE_CONFIGS[id].costMinerals;
    if (resources.minerals < cost) return;

    const newUpgrades = { ...upgrades, [id]: true };
    const rates = calcRates(buildings, newUpgrades);

    set({
      resources: { ...resources, minerals: resources.minerals - cost },
      upgrades: newUpgrades,
      ...rates,
    });
  },

  // ── Game Tick（由 useGameLoop 呼叫，delta 單位為秒）──

  tick: (delta: number) => {
    const { resources, mineralsPerSec, energyPerSec, energyConsPerSec, isPowerOutage } = get();

    const netEnergy = (energyPerSec - energyConsPerSec) * delta;
    const newEnergy = resources.energy + netEnergy;

    if (newEnergy <= 0) {
      set((s) => ({
        resources: { ...s.resources, energy: 0 },
        isPowerOutage: true,
      }));
    } else {
      const newMinerals = isPowerOutage
        ? resources.minerals
        : resources.minerals + mineralsPerSec * delta;

      set({
        resources: {
          minerals: newMinerals,
          energy: newEnergy,
        },
        isPowerOutage: false,
      });
    }

    get().checkMilestones();
  },

  // ── 重新計算產量快取（供外部強制同步使用）────────────

  recalcRates: () => {
    const { buildings, upgrades } = get();
    const rates = calcRates(buildings, upgrades);
    set(rates);
  },

  // ── 取得建築當前購買成本 ──────────────────────────────

  getBuildingCost: (id: BuildingId) => {
    return calcBuildingCost(id, get().buildings[id]);
  },

  checkMilestones: () => {
    const { resources, buildings, mineralsPerSec, energyPerSec, energyConsPerSec, triggeredMilestones, pendingMilestone } = get();
    // 若已有待顯示的通知，先不疊加新的
    if (pendingMilestone !== null) return;

    const args: MilestoneConditionArgs = { resources, buildings, mineralsPerSec, energyPerSec, energyConsPerSec };

    for (const milestone of MILESTONES) {
      if (triggeredMilestones.includes(milestone.id)) continue;
      if (milestone.condition(args)) {
        set({
          triggeredMilestones: [...triggeredMilestones, milestone.id],
          pendingMilestone: milestone.id,
        });
        return; // 一次只觸發一個，下個 tick 再觸發下一個
      }
    }
  },

  dismissMilestone: () => {
    set({ pendingMilestone: null });
  },
}));
