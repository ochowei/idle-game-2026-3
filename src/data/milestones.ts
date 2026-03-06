import type { Buildings, Resources } from '../store/useGameStore';

export interface MilestoneConditionArgs {
  resources: Resources;
  buildings: Buildings;
  mineralsPerSec: number;
  energyPerSec: number;
  energyConsPerSec: number;
}

export interface Milestone {
  id: string;
  title: string;
  desc: string;
  condition: (args: MilestoneConditionArgs) => boolean;
}

export const MILESTONES: Milestone[] = [
  {
    id: 'first_mineral',
    title: '🪨 星際採礦者',
    desc: '你的第一塊礦石。宇宙殖民之路，從此啟程。',
    condition: ({ resources }) => resources.minerals >= 1,
  },
  {
    id: 'hundred_minerals',
    title: '💎 百礦里程碑',
    desc: '已累積 100 單位礦物。你的艦隊正在成長。',
    condition: ({ resources }) => resources.minerals >= 100,
  },
  {
    id: 'first_drone',
    title: '🤖 自動化元年',
    desc: '第一台採礦無人機上線！礦物產出不再依賴人力。',
    condition: ({ buildings }) => buildings.drone >= 1,
  },
  {
    id: 'ten_drones',
    title: '🚀 無人機艦隊',
    desc: '擁有 10 台採礦無人機。殖民地工業化正式開始。',
    condition: ({ buildings }) => buildings.drone >= 10,
  },
  {
    id: 'first_solar',
    title: '☀️ 恆星能源',
    desc: '第一座太陽能陣列部署完成。能源危機暫時解除。',
    condition: ({ buildings }) => buildings.solar >= 1,
  },
  {
    id: 'energy_surplus',
    title: '⚡ 能源充盈',
    desc: '能源產出超越消耗。你的殖民地進入穩定發展期。',
    condition: ({ energyPerSec, energyConsPerSec }) => energyPerSec > energyConsPerSec,
  },
  {
    id: 'first_asteroid',
    title: '☄️ 深空採礦',
    desc: '第一座小行星礦場投入運作。星際資源唾手可得。',
    condition: ({ buildings }) => buildings.asteroid >= 1,
  },
  {
    id: 'thousand_minerals',
    title: '🌌 千礦殖民者',
    desc: '礦物總量突破 1,000！你已是星際富豪的雛形。',
    condition: ({ resources }) => resources.minerals >= 1000,
  },
];
