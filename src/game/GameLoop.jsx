import React from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store/gameStore';
import { GAME_PHASES } from '../utils/constants';

/**
 * GameLoop provides the master frame update for time-based systems,
 * timers, and phase transitions.
 */
export default function GameLoop() {
  const phase = useGameStore((state) => state.phase);
  const updateTimer = useGameStore((state) => state.updateTimer);

  useFrame((state, delta) => {
    if (phase === GAME_PHASES.PLAYING || phase === GAME_PHASES.EXTRACTION) {
      updateTimer(delta);
    }
  });

  return null;
}

