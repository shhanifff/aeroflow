import React, { createContext, useContext, useReducer, useCallback, useMemo } from 'react';
import { gridReducer, INITIAL_STATE } from './gridReducer';
import type { GridState, Turbine, TelemetryPoint } from './gridReducer';

interface GridContextType {
  state: GridState;
  setBladeAngle: (id: string, bladeAngle: number) => void;
  toggleMaintenance: (id: string) => void;
  toggleShutdown: (id: string) => void;
  setGlobalWind: (windSpeed: number) => void;
  setPreset: (preset: 'calm' | 'storm' | 'peak') => void;
  resetGrid: () => void;
  dispatch: React.Dispatch<any>;
}

const GridContext = createContext<GridContextType | undefined>(undefined);

export const GridProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gridReducer, INITIAL_STATE);

  const setBladeAngle = useCallback((id: string, bladeAngle: number) => {
    dispatch({ type: 'SET_BLADE_ANGLE', payload: { id, bladeAngle } });
  }, []);

  const toggleMaintenance = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_MAINTENANCE', payload: { id } });
  }, []);

  const toggleShutdown = useCallback((id: string) => {
    dispatch({ type: 'TOGGLE_SHUTDOWN', payload: { id } });
  }, []);

  const setGlobalWind = useCallback((windSpeed: number) => {
    dispatch({ type: 'SET_GLOBAL_WIND', payload: { windSpeed } });
  }, []);

  const setPreset = useCallback((preset: 'calm' | 'storm' | 'peak') => {
    dispatch({ type: 'SET_ENVIRONMENTAL_PRESET', payload: { preset } });
  }, []);

  const resetGrid = useCallback(() => {
    dispatch({ type: 'RESET_GRID' });
  }, []);

  const contextValue = useMemo(() => ({
    state,
    setBladeAngle,
    toggleMaintenance,
    toggleShutdown,
    setGlobalWind,
    setPreset,
    resetGrid,
    dispatch
  }), [
    state,
    setBladeAngle,
    toggleMaintenance,
    toggleShutdown,
    setGlobalWind,
    setPreset,
    resetGrid
  ]);

  return (
    <GridContext.Provider value={contextValue}>
      {children}
    </GridContext.Provider>
  );
};

export const useGrid = () => {
  const context = useContext(GridContext);
  if (!context) {
    throw new Error('useGrid must be used within a GridProvider');
  }
  return context;
};
export type { Turbine, TelemetryPoint, GridState };
