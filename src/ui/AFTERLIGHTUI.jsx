import React, { useState, useEffect } from 'react';
import '../styles/ui.css';

import MainMenu from './screens/MainMenu';
import BriefingScreen from './screens/BriefingScreen';
import GameHUD from './hud/GameHUD';
import RescuePanel from './rescue/RescuePanel';
import PauseScreen from './screens/PauseScreen';
import ResultsScreen from './screens/ResultsScreen';
import SettingsScreen from './screens/SettingsScreen';

// Default safe fallback data
const DEFAULT_GAME_DATA = {
  health: 100,
  stamina: 100,
  survivors: 0,
  totalSurvivors: 3,
  medicalSupplies: { medkits: 3, oxygen: 2, toolkits: 2 },
  elapsedTime: 0,
  timer: 300,
  objective: 'Locate 3 survivors in devastated Sector 4-B.',
  paused: false,
  rescueAvailable: false,
  activeSurvivor: null,
  score: {
    totalPoints: 0,
    rank: 'S',
    success: true
  }
};

/**
 * AFTERLIGHTUI — Master Game UI Integration API
 * Clean interface decoupled from 3D world and physics.
 * Supports external game state or internal self-managed UI flow.
 */
export default function AFTERLIGHTUI({
  gameData = {},
  onStartGame = null,
  onResume = null,
  onRestart = null,
  onMainMenu = null,
  onRescue = null,
  onDeploy = null,
  onPause = null,
  currentScreen = null // 'menu' | 'briefing' | 'gameplay' | 'pause' | 'results' | 'rescue' | 'settings'
}) {
  // Merge gameData with safe defaults
  const state = {
    ...DEFAULT_GAME_DATA,
    ...gameData,
    medicalSupplies: typeof gameData?.medicalSupplies === 'number'
      ? { medkits: gameData.medicalSupplies, oxygen: 2, toolkits: 2 }
      : (gameData?.medicalSupplies || DEFAULT_GAME_DATA.medicalSupplies)
  };

  // Internal screen navigation when currentScreen is not externally locked
  const [internalScreen, setInternalScreen] = useState('menu');
  const [isRescueOpen, setIsRescueOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const activeScreen = currentScreen || internalScreen;
  const isPaused = state.paused || activeScreen === 'pause';

  // Keyboard Escape listener to toggle pause safely
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isSettingsOpen) {
          setIsSettingsOpen(false);
          return;
        }
        if (isRescueOpen) {
          setIsRescueOpen(false);
          return;
        }
        if (activeScreen === 'gameplay' || activeScreen === 'game') {
          if (isPaused) {
            handleResume();
          } else {
            handlePause();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeScreen, isPaused, isSettingsOpen, isRescueOpen]);

  // Handlers
  const handleStartGame = () => {
    if (typeof onStartGame === 'function') {
      onStartGame();
    }
    setInternalScreen('gameplay');
  };

  const handleOpenBriefing = () => {
    setInternalScreen('briefing');
  };

  const handleDeploy = () => {
    if (typeof onDeploy === 'function') {
      onDeploy();
    }
    handleStartGame();
  };

  const handlePause = () => {
    if (typeof onPause === 'function') {
      onPause();
    }
    setInternalScreen('pause');
  };

  const handleResume = () => {
    if (typeof onResume === 'function') {
      onResume();
    }
    setInternalScreen('gameplay');
  };

  const handleRestart = () => {
    if (typeof onRestart === 'function') {
      onRestart();
    }
    setInternalScreen('briefing');
  };

  const handleMainMenu = () => {
    if (typeof onMainMenu === 'function') {
      onMainMenu();
    }
    setIsSettingsOpen(false);
    setIsRescueOpen(false);
    setInternalScreen('menu');
  };

  const handleRescueConfirm = (decision) => {
    if (typeof onRescue === 'function') {
      onRescue(decision);
    }
    setIsRescueOpen(false);
  };

  return (
    <div className="al-screen-overlay al-interactive" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
      {/* 1. Settings Overlay */}
      {isSettingsOpen && (
        <SettingsScreen onBack={() => setIsSettingsOpen(false)} />
      )}

      {/* 2. Main Menu Screen */}
      {!isSettingsOpen && activeScreen === 'menu' && (
        <MainMenu
          onStart={handleStartGame}
          onBriefing={handleOpenBriefing}
          onSettings={() => setIsSettingsOpen(true)}
        />
      )}

      {/* 3. Mission Briefing Screen */}
      {!isSettingsOpen && activeScreen === 'briefing' && (
        <BriefingScreen
          onDeploy={handleDeploy}
          onBack={handleMainMenu}
        />
      )}

      {/* 4. Active Gameplay HUD */}
      {!isSettingsOpen && (activeScreen === 'gameplay' || activeScreen === 'game' || activeScreen === 'pause') && (
        <>
          <GameHUD
            gameData={{
              health: state.health,
              stamina: state.stamina,
              survivors: state.survivors,
              totalSurvivors: state.totalSurvivors,
              supplies: state.medicalSupplies,
              timer: state.timer,
              objective: state.objective,
              interaction: {
                active: state.rescueAvailable,
                promptText: state.activeSurvivor
                  ? `[E] STABILIZE ${state.activeSurvivor.name.toUpperCase()}`
                  : '[E] TRIAGE CASUALTY',
                distance: 1.8
              }
            }}
            onPause={handlePause}
            onInteract={() => setIsRescueOpen(true)}
          />

          {/* Pause Screen Overlay */}
          {isPaused && (
            <PauseScreen
              onResume={handleResume}
              onRestart={handleRestart}
              onSettings={() => setIsSettingsOpen(true)}
              onMainMenu={handleMainMenu}
              missionStats={{
                survivors: state.survivors,
                totalSurvivors: state.totalSurvivors,
                elapsedTime: state.elapsedTime
              }}
            />
          )}

          {/* Rescue Panel Modal */}
          {(isRescueOpen || state.rescueAvailable && state.activeSurvivor) && (
            <RescuePanel
              survivor={state.activeSurvivor}
              supplies={state.medicalSupplies}
              onClose={() => setIsRescueOpen(false)}
              onConfirmRescue={handleRescueConfirm}
            />
          )}
        </>
      )}

      {/* 5. Results Screen */}
      {!isSettingsOpen && activeScreen === 'results' && (
        <ResultsScreen
          scoreData={state.score}
          onReplay={handleRestart}
          onMainMenu={handleMainMenu}
        />
      )}
    </div>
  );
}
