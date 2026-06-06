export const MAX_TURBINE_CAPACITY = 5.0;
export const CUT_IN_WIND_SPEED = 10;
export const CUT_OUT_WIND_SPEED = 90;
export const RATED_WIND_SPEED = 50;

export const calculateTurbinePower = (
  windSpeed: number,
  bladeAngle: number,
  offlineStatus: boolean,
  maintenanceMode: boolean
): number => {
  if (offlineStatus || maintenanceMode) {
    return 0;
  }

  if (windSpeed < CUT_IN_WIND_SPEED || windSpeed > CUT_OUT_WIND_SPEED) {
    return 0;
  }

  const radians = (bladeAngle * Math.PI) / 180;
  const pitchFactor = Math.cos(radians);

  let basePower = 0;
  if (windSpeed >= RATED_WIND_SPEED) {
    basePower = MAX_TURBINE_CAPACITY;
  } else {
    const ratio = (windSpeed - CUT_IN_WIND_SPEED) / (RATED_WIND_SPEED - CUT_IN_WIND_SPEED);
    basePower = MAX_TURBINE_CAPACITY * Math.pow(ratio, 2.2);
  }

  const finalPower = basePower * pitchFactor;
  return Math.max(0, Math.min(MAX_TURBINE_CAPACITY, finalPower));
};

export const calculateTurbineStress = (
  windSpeed: number,
  bladeAngle: number,
  offlineStatus: boolean,
  maintenanceMode: boolean
): number => {
  if (offlineStatus || maintenanceMode) {
    return 0;
  }

  const radians = (bladeAngle * Math.PI) / 180;
  const exposureFactor = Math.cos(radians);

  const windFactor = Math.pow(windSpeed / 100, 1.5);
  const stressPercentage = windFactor * exposureFactor * 100;

  return Math.max(0, Math.min(100, stressPercentage));
};

export const calculateTurbineHealth = (
  currentHealth: number,
  stress: number,
  maintenanceMode: boolean
): number => {
  if (maintenanceMode) {
    return Math.max(0, currentHealth - 2.5);
  }

  if (stress > 70) {
    const degradationRate = (stress - 70) * 0.15;
    return currentHealth + degradationRate;
  }

  if (stress < 30 && currentHealth > 0) {
    return Math.max(0, currentHealth - 0.2);
  }

  return currentHealth;
};

export const calculateGridStability = (
  turbines: { offlineStatus: boolean; maintenanceMode: boolean; healthStatus: number; mechanicalStress: number }[],
  windSpeed: number
): number => {
  let offlineCount = 0;
  let maintenanceCount = 0;
  let criticalCount = 0;
  let totalStress = 0;

  turbines.forEach((t) => {
    if (t.offlineStatus) offlineCount++;
    else if (t.maintenanceMode) maintenanceCount++;
    else {
      totalStress += t.mechanicalStress;
      if (t.healthStatus >= 70 && t.healthStatus < 100) {
        criticalCount++;
      }
    }
  });

  const activeCount = turbines.length - offlineCount - maintenanceCount;
  
  if (activeCount === 0) {
    return 10;
  }

  const avgStress = totalStress / activeCount;

  const offlinePenalty = offlineCount * 12;
  const maintenancePenalty = maintenanceCount * 6;
  const criticalPenalty = criticalCount * 8;
  const windVolatilityPenalty = windSpeed > 75 ? (windSpeed - 75) * 0.6 : 0;
  const stressPenalty = avgStress > 65 ? (avgStress - 65) * 0.4 : 0;

  const stability = 100 - offlinePenalty - maintenancePenalty - criticalPenalty - windVolatilityPenalty - stressPenalty;
  
  return Math.max(10, Math.min(100, Math.round(stability)));
};
