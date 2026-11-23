import React from 'react';
import CityGround from './environment/CityGround';
import Buildings from './environment/Buildings';
import DebrisPiles from './environment/DebrisPiles';
import Vehicles from './environment/Vehicles';
import StreetProps from './environment/StreetProps';
import Atmosphere from './environment/Atmosphere';

/**
 * Environment composition component.
 * AAA Open-World Disaster City Sector 4-B.
 */
export default function Environment() {
  return (
    <group>
      <CityGround />
      <Buildings />
      <DebrisPiles />
      <Vehicles />
      <StreetProps />
      <Atmosphere />
    </group>
  );
}
