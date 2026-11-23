import React, { useState } from 'react';
import { useGameStore } from '../../store/gameStore';
import PauseScreen from './PauseScreen';
import SettingsScreen from './SettingsScreen';

/**
 * PauseMenu — Connects PauseScreen with game store and settings
 */
export default function PauseMenu() {
  const resumeGame = useGameStore((state) => state.resumeGame);
  const restartMission = useGameStore((state) => state.restartMission);
  const setPhase = useGameStore((state) => state.setPhase);
  const mission = useGameStore((state) => state.mission);

  const [showSettings, setShowSettings] = useState(false);

  if (showSettings) {
    return <SettingsScreen onBack={() => setShowSettings(false)} />;
  }

  return (
    <PauseScreen
      onResume={resumeGame}
      onRestart={restartMission}
      onSettings={() => setShowSettings(true)}
      onMainMenu={() => setPhase('MENU')}
      missionStats={{
        survivors: mission.survivorsRescued,
        totalSurvivors: mission.totalSurvivors,
        elapsedTime: mission.elapsed
      }}
    />
  );
}

export { PauseScreen };
