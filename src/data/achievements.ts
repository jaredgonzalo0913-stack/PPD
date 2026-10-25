import { Achievement } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-explorer',
    name: 'First Engine Explorer',
    description: 'Enter the 3D ME-C engine lab for the first time',
    icon: '🔍',
    unlocked: false,
  },
  {
    id: 'component-master',
    name: 'Component Master',
    description: 'Explore and identify all 14 major ME-C components',
    icon: '⚙️',
    unlocked: false,
  },
  {
    id: 'control-system-specialist',
    name: 'Control System Specialist',
    description: 'Complete all control system modules with 100% score',
    icon: '🎯',
    unlocked: false,
  },
  {
    id: 'hydraulics-expert',
    name: 'Hydraulics Expert',
    description: 'Master the hydraulic control system module',
    icon: '💧',
    unlocked: false,
  },
  {
    id: 'sensor-savant',
    name: 'Sensor Savant',
    description: 'Perfect score on all sensor system quizzes',
    icon: '📊',
    unlocked: false,
  },
  {
    id: 'safety-guardian',
    name: 'Safety Guardian',
    description: 'Demonstrate mastery of engine safety systems',
    icon: '🛡️',
    unlocked: false,
  },
  {
    id: 'fuel-injection-pro',
    name: 'Fuel Injection Pro',
    description: 'Complete fuel injection system module with excellence',
    icon: '⚡',
    unlocked: false,
  },
  {
    id: 'exhaust-valve-expert',
    name: 'Exhaust Valve Expert',
    description: 'Master exhaust valve control systems',
    icon: '🔥',
    unlocked: false,
  },
  {
    id: 'guided-tour-explorer',
    name: 'Guided Tour Explorer',
    description: 'Complete the guided tour of ME-C engine systems',
    icon: '🗺️',
    unlocked: false,
  },
  {
    id: 'mec-master',
    name: 'ME-C Engine Master',
    description: 'Complete all 8 modules with 85%+ average score',
    icon: '👑',
    unlocked: false,
  },
];

export const ACHIEVEMENT_TIERS = {
  BRONZE: { color: '#CD7F32', label: 'Bronze', xp: 100 },
  SILVER: { color: '#C0C0C0', label: 'Silver', xp: 250 },
  GOLD: { color: '#FFD700', label: 'Gold', xp: 500 },
  PLATINUM: { color: '#E5E4E2', label: 'Platinum', xp: 1000 },
};
