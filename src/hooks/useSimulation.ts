import { useEffect, useRef } from 'react';
import { useGrid } from '../store/GridContext';

export const useSimulation = (isActive: boolean = true) => {
  const { dispatch } = useGrid();
  const tickRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    tickRef.current = () => {
      dispatch({ type: 'TICK' });
    };
  }, [dispatch]);

  useEffect(() => {
    if (!isActive) return;

    const tick = () => {
      if (tickRef.current) {
        tickRef.current();
      }
    };

    const timer = setInterval(tick, 500);

    return () => {
      clearInterval(timer);
    };
  }, [isActive]);
};
export default useSimulation;
