import React from 'react';
import CityGround from './environment/CityGround';
import Buildings from './environment/Buildings';
import DebrisPiles from './environment/DebrisPiles';
import Atmosphere from './environment/Atmosphere';

/**
 * Environment composition component.
 * Fallback world or integrated environment authored for AFTERLIGHT.
 */
export default function Environment() {
  return (
    <group>
      <CityGround />
      <Buildings />
      <DebrisPiles />
      <Atmosphere />
    </group>
  );
}

