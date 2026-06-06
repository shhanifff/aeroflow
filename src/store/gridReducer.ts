import type { ActionType } from './actions';
import {
  calculateTurbinePower,
  calculateTurbineStress,
  calculateTurbineHealth,
  calculateGridStability,
} from '../utils/calculations';

export interface Turbine {
  id: string;
  name: string;
  windSpeed: number;
  bladeAngle: number;
  maintenanceMode: boolean;
  mechanicalStress: number;
  healthStatus: number;
  powerOutput: number;
  offlineStatus: boolean;
}

export interface TelemetryPoint {
  time: string;
  production: number;
  load: number;
  stability: number;
}

export interface GridState {
  totalPower: number;
  gridStability: number;
  globalWindSpeed: number;
  globalBladeAngle: number;
  turbines: Turbine[];
  telemetryHistory: TelemetryPoint[];
}

export const INITIAL_STATE: GridState = {
  totalPower: 0,
  gridStability: 100,
  globalWindSpeed: 25,
  globalBladeAngle: 15,
  turbines: Array.from({ length: 6 }, (_, i) => ({
    id: `turbine-${i + 1}`,
    name: `Turbine ${String.fromCharCode(65 + i)}`,
    windSpeed: 25,
    bladeAngle: 15,
    maintenanceMode: false,
    mechanicalStress: 0,
    healthStatus: 0,
    powerOutput: 0,
    offlineStatus: false,
  })),
  telemetryHistory: Array.from({ length: 30 }, (_, i) => {
    const timeVal = new Date(Date.now() - (30 - i) * 2000);
    return {
      time: timeVal.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      production: 12 + Math.random() * 4,
      load: 15,
      stability: 95 + Math.round(Math.random() * 5),
    };
  }),
};

export const gridReducer = (state: GridState, action: ActionType): GridState => {
  switch (action.type) {
    case 'TICK': {
      const updatedTurbines = state.turbines.map((t) => {
        const stress = calculateTurbineStress(t.windSpeed, t.bladeAngle, t.offlineStatus, t.maintenanceMode);
        
        let health = calculateTurbineHealth(t.healthStatus, stress, t.maintenanceMode);
        
        let offline = t.offlineStatus;
        if (health >= 100) {
          offline = true;
        }

        const power = calculateTurbinePower(t.windSpeed, t.bladeAngle, offline, t.maintenanceMode);

        return {
          ...t,
          mechanicalStress: Math.round(stress),
          healthStatus: Math.round(health * 10) / 10,
          offlineStatus: offline,
          powerOutput: Math.round(power * 100) / 100,
        };
      });

      const totalPower = updatedTurbines.reduce((sum, t) => sum + t.powerOutput, 0);
      
      const gridStability = calculateGridStability(updatedTurbines, state.globalWindSpeed);

      const simulatedLoad = 18.0 + (Math.sin(Date.now() / 10000) * 2) + (Math.random() * 0.5);

      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const newPoint: TelemetryPoint = {
        time: timeStr,
        production: Math.round(totalPower * 10) / 10,
        load: Math.round(simulatedLoad * 10) / 10,
        stability: gridStability,
      };

      const telemetryHistory = state.telemetryHistory.length >= 120
        ? [...state.telemetryHistory.slice(1), newPoint]
        : [...state.telemetryHistory, newPoint];

      return {
        ...state,
        turbines: updatedTurbines,
        totalPower: Math.round(totalPower * 10) / 10,
        gridStability,
        telemetryHistory,
      };
    }

    case 'SET_BLADE_ANGLE': {
      const { id, bladeAngle } = action.payload;
      const updatedTurbines = state.turbines.map((t) => {
        if (t.id !== id) return t;

        const power = calculateTurbinePower(t.windSpeed, bladeAngle, t.offlineStatus, t.maintenanceMode);
        const stress = calculateTurbineStress(t.windSpeed, bladeAngle, t.offlineStatus, t.maintenanceMode);

        return {
          ...t,
          bladeAngle,
          powerOutput: Math.round(power * 100) / 100,
          mechanicalStress: Math.round(stress),
        };
      });

      const totalPower = updatedTurbines.reduce((sum, t) => sum + t.powerOutput, 0);
      const gridStability = calculateGridStability(updatedTurbines, state.globalWindSpeed);

      return {
        ...state,
        turbines: updatedTurbines,
        totalPower: Math.round(totalPower * 10) / 10,
        gridStability,
      };
    }

    case 'TOGGLE_MAINTENANCE': {
      const { id } = action.payload;
      const updatedTurbines = state.turbines.map((t) => {
        if (t.id !== id) return t;

        const nextMaintenance = !t.maintenanceMode;
        
        const power = nextMaintenance ? 0 : calculateTurbinePower(t.windSpeed, t.bladeAngle, t.offlineStatus, false);
        const stress = nextMaintenance ? 0 : calculateTurbineStress(t.windSpeed, t.bladeAngle, t.offlineStatus, false);

        return {
          ...t,
          maintenanceMode: nextMaintenance,
          healthStatus: nextMaintenance ? t.healthStatus : Math.min(t.healthStatus, 15),
          offlineStatus: nextMaintenance ? t.offlineStatus : false,
          powerOutput: Math.round(power * 100) / 100,
          mechanicalStress: Math.round(stress),
        };
      });

      const totalPower = updatedTurbines.reduce((sum, t) => sum + t.powerOutput, 0);
      const gridStability = calculateGridStability(updatedTurbines, state.globalWindSpeed);

      return {
        ...state,
        turbines: updatedTurbines,
        totalPower: Math.round(totalPower * 10) / 10,
        gridStability,
      };
    }

    case 'TOGGLE_SHUTDOWN': {
      const { id } = action.payload;
      const updatedTurbines = state.turbines.map((t) => {
        if (t.id !== id) return t;

        const nextOffline = !t.offlineStatus;
        const power = nextOffline ? 0 : calculateTurbinePower(t.windSpeed, t.bladeAngle, false, t.maintenanceMode);
        const stress = nextOffline ? 0 : calculateTurbineStress(t.windSpeed, t.bladeAngle, false, t.maintenanceMode);

        return {
          ...t,
          offlineStatus: nextOffline,
          powerOutput: Math.round(power * 100) / 100,
          mechanicalStress: Math.round(stress),
        };
      });

      const totalPower = updatedTurbines.reduce((sum, t) => sum + t.powerOutput, 0);
      const gridStability = calculateGridStability(updatedTurbines, state.globalWindSpeed);

      return {
        ...state,
        turbines: updatedTurbines,
        totalPower: Math.round(totalPower * 10) / 10,
        gridStability,
      };
    }

    case 'SET_GLOBAL_WIND': {
      const { windSpeed } = action.payload;
      const updatedTurbines = state.turbines.map((t) => {
        const power = calculateTurbinePower(windSpeed, t.bladeAngle, t.offlineStatus, t.maintenanceMode);
        const stress = calculateTurbineStress(windSpeed, t.bladeAngle, t.offlineStatus, t.maintenanceMode);

        return {
          ...t,
          windSpeed,
          powerOutput: Math.round(power * 100) / 100,
          mechanicalStress: Math.round(stress),
        };
      });

      const totalPower = updatedTurbines.reduce((sum, t) => sum + t.powerOutput, 0);
      const gridStability = calculateGridStability(updatedTurbines, windSpeed);

      return {
        ...state,
        globalWindSpeed: windSpeed,
        turbines: updatedTurbines,
        totalPower: Math.round(totalPower * 10) / 10,
        gridStability,
      };
    }

    case 'SET_ENVIRONMENTAL_PRESET': {
      const { preset } = action.payload;
      let targetWind = 25;
      let targetAngle = 15;

      switch (preset) {
        case 'calm':
          targetWind = 20;
          targetAngle = 25;
          break;
        case 'storm':
          targetWind = 90;
          targetAngle = 15;
          break;
        case 'peak':
          targetWind = 60;
          targetAngle = 40;
          break;
      }

      const updatedTurbines = state.turbines.map((t) => {
        const shouldReenable = t.offlineStatus && t.healthStatus < 100;
        const offline = shouldReenable ? false : t.offlineStatus;

        const power = calculateTurbinePower(targetWind, targetAngle, offline, t.maintenanceMode);
        const stress = calculateTurbineStress(targetWind, targetAngle, offline, t.maintenanceMode);

        return {
          ...t,
          windSpeed: targetWind,
          bladeAngle: targetAngle,
          offlineStatus: offline,
          powerOutput: Math.round(power * 100) / 100,
          mechanicalStress: Math.round(stress),
        };
      });

      const totalPower = updatedTurbines.reduce((sum, t) => sum + t.powerOutput, 0);
      const gridStability = calculateGridStability(updatedTurbines, targetWind);

      return {
        ...state,
        globalWindSpeed: targetWind,
        globalBladeAngle: targetAngle,
        turbines: updatedTurbines,
        totalPower: Math.round(totalPower * 10) / 10,
        gridStability,
      };
    }

    case 'RESET_GRID': {
      return INITIAL_STATE;
    }

    default:
      return state;
  }
};
