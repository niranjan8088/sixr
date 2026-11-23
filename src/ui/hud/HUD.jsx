import React from 'react';
import GameHUD from './GameHUD';

/**
 * Standard HUD Wrapper for AFTERLIGHT
 * Re-exports and integrates GameHUD.
 */
export default function HUD(props) {
  return <GameHUD {...props} />;
}

export { GameHUD };
