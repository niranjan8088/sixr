import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store/gameStore';
import { GameConfig } from './GameConfig';
import { getDistance2D } from '../utils/helpers';
import { INTERACTION_DISTANCES, SURVIVOR_STATUS, GAME_PHASES } from '../utils/constants';

/**
 * Interactions component:
 * Continuously evaluates proximity between player and survivors or extraction zone.
 * Updates Zustand interaction state to inform UI and allow input triggers.
 */
export default function Interactions() {
  const phase = useGameStore((state) => state.phase);
  const playerPosition = useGameStore((state) => state.player.position);
  const survivors = useGameStore((state) => state.survivors);
  const isExtractionReady = useGameStore((state) => state.mission.isExtractionReady);
  const setInteraction = useGameStore((state) => state.setInteraction);

  const prevActiveRef = useRef(false);
  const prevTargetIdRef = useRef(null);
  const prevPromptRef = useRef('');

  useFrame(() => {
    if (phase !== GAME_PHASES.PLAYING && phase !== GAME_PHASES.EXTRACTION) {
      if (prevActiveRef.current) {
        setInteraction({
          active: false,
          targetId: null,
          targetType: null,
          promptText: '',
          targetName: '',
          distance: 999
        });
        prevActiveRef.current = false;
        prevTargetIdRef.current = null;
        prevPromptRef.current = '';
      }
      return;
    }

    let closestDistance = 999;
    let closestTarget = null;
    let targetType = null;
    let promptText = '';
    let targetName = '';

    // Check survivors proximity
    for (let i = 0; i < survivors.length; i++) {
      const s = survivors[i];
      const dist = getDistance2D(playerPosition, s.position);

      if (dist < INTERACTION_DISTANCES.SURVIVOR && dist < closestDistance) {
        closestDistance = dist;
        closestTarget = s.id;
        targetType = 'SURVIVOR';
        targetName = s.name;

        if (s.status === SURVIVOR_STATUS.STABILIZED || s.status === SURVIVOR_STATUS.EVACUATED) {
          promptText = `${s.name.toUpperCase()} (STABILIZED) — AWAITING EVAC CHOPPER`;
        } else if (s.status === SURVIVOR_STATUS.ASSESSMENT) {
          promptText = `[E] RESUME TRIAGE: ${s.name.toUpperCase()} (${s.triageTag || 'URGENT'})`;
        } else {
          promptText = `[E] TRIAGE CASUALTY: ${s.name.toUpperCase()} (${s.role})`;
        }
      }
    }

    // Check extraction zone proximity
    const evacPos = GameConfig.mission.extractionZone.position;
    const evacDist = getDistance2D(playerPosition, evacPos);

    if (evacDist < INTERACTION_DISTANCES.EXTRACTION && evacDist < closestDistance) {
      closestDistance = evacDist;
      closestTarget = 'EXTRACTION_ZONE';
      targetType = 'EXTRACTION';
      targetName = 'Evac Helipad';

      if (isExtractionReady) {
        promptText = '[E] BOARD EVAC HELICOPTER & COMPLETE MISSION';
      } else {
        promptText = 'EXTRACTION LOCKED: Stabilize all 3 civilian casualties first';
      }
    }

    const isActive = closestTarget !== null;

    // Only update store when state changes to avoid unnecessary re-renders
    if (
      isActive !== prevActiveRef.current ||
      closestTarget !== prevTargetIdRef.current ||
      promptText !== prevPromptRef.current
    ) {
      setInteraction({
        active: isActive,
        targetId: closestTarget,
        targetType,
        promptText,
        targetName,
        distance: closestDistance
      });
      prevActiveRef.current = isActive;
      prevTargetIdRef.current = closestTarget;
      prevPromptRef.current = promptText;
    }
  });

  return null;
}

