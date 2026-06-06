export type ActionType =
  | { type: 'TICK' }
  | { type: 'SET_BLADE_ANGLE'; payload: { id: string; bladeAngle: number } }
  | { type: 'TOGGLE_MAINTENANCE'; payload: { id: string } }
  | { type: 'TOGGLE_SHUTDOWN'; payload: { id: string } }
  | { type: 'SET_GLOBAL_WIND'; payload: { windSpeed: number } }
  | { type: 'SET_ENVIRONMENTAL_PRESET'; payload: { preset: 'calm' | 'storm' | 'peak' } }
  | { type: 'RESET_GRID' };
