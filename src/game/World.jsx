import React from 'react';
import Lighting from './Lighting';
import Environment from './Environment';
import Hazards from './Hazards';
import Player from './Player';
import CameraController from './CameraController';
import Survivors from './Survivors';
import RescueZone from './RescueZone';
import Interactions from './Interactions';
import GameLoop from './GameLoop';

/**
 * World: Central composition of 3D scene elements.
 * Integrates Player, Camera, Lighting, Environment, Hazards, Survivors, Rescue Zone, and Interactions.
 */
export default function World() {
  return (
    <group>
      {/* Lighting and Atmosphere */}
      <Lighting />

      {/* Urban Disaster City Environment */}
      <Environment />

      {/* Environmental Hazards (Toxic Smoke, Infernos, Arcs) */}
      <Hazards />

      {/* Survivor NPCs & Markers */}
      <Survivors />

      {/* Evacuation / Extraction Helipad */}
      <RescueZone />

      {/* Controllable Third-Person Player */}
      <Player />

      {/* Orbital Third-Person Camera Follow */}
      <CameraController />

      {/* Interactive Distance Sensor */}
      <Interactions />

      {/* Master Game Loop */}
      <GameLoop />
    </group>
  );
}

