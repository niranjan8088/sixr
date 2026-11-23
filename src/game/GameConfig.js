// AFTERLIGHT — Core Game Configuration
export const GameConfig = {
  title: 'AFTERLIGHT',
  subtitle: 'Sector 4-B Rescue Protocol',
  version: '1.0.0',
  
  player: {
    spawnPosition: [0, 0, 18],
    walkSpeed: 5.5,
    sprintSpeed: 9.8,
    rotationSpeed: 10.0,
    radius: 0.5,
    height: 1.85,
    maxStamina: 100,
    staminaDrainRate: 20, // per sec
    staminaRecoveryRate: 15
  },

  camera: {
    distance: 4.8,
    minDistance: 2.5,
    maxDistance: 7.0,
    height: 2.1,
    shoulderOffset: 0.35,
    lookAtHeightOffset: 1.3,
    minPitch: -0.55,
    maxPitch: 0.95,
    mouseSensitivity: 0.0022,
    smoothing: 0.12
  },

  mission: {
    id: 'mission-01',
    title: 'AFTER THE COLLAPSE',
    codename: 'OP: CITADEL EMBERS',
    briefing: 'Catastrophic structural failure in Sector 4-B following ground tremors. 3 civilian signals detected within the ruin perimeter. Locate and stabilize all personnel. Atmospheric dust and toxic particulates are rising. Complete rescue operations and extract at the designated Helipad Landing Zone.',
    initialTimer: 300, // 5 minutes
    totalSurvivors: 3,
    extractionZone: {
      position: [0, 0, -42],
      radius: 4.8
    }
  },

  initialSupplies: {
    medkits: 3,
    oxygen: 2,
    toolkits: 2
  },

  survivors: [
    {
      id: 'survivor-1',
      name: 'Elena Vance',
      role: 'Structural Engineer',
      position: [-16, 0, -10],
      injury: 'Trapped beneath heavy collapsed reinforced concrete girder.',
      condition: 'Crush syndrome risk. Conscious, severe pain.',
      requiredSupply: 'toolkits',
      supplyLabel: 'Hydraulic Spreader Toolkit',
      status: 'TRAPPED',
      dialogue: 'Help! My leg is pinned under this beam... the hydraulics won\'t budge without tools!',
      rescuedDialogue: 'Thank God! The pressure is off. I can limp to extraction.'
    },
    {
      id: 'survivor-2',
      name: 'Marcus Chen',
      role: 'Metro Transit Tech',
      position: [20, 0, -22],
      injury: 'Critical smoke and toxic particulate inhalation in subway access shaft.',
      condition: 'Acute respiratory distress. Pulse erratic.',
      requiredSupply: 'oxygen',
      supplyLabel: 'Emergency O2 Canister',
      status: 'TRAPPED',
      dialogue: '*Coughing violently* Can\'t... breathe... smoke vents failed...',
      rescuedDialogue: 'Air... clear air. O2 seal locked. I am stable now, responder.'
    },
    {
      id: 'survivor-3',
      name: 'Dr. Sarah Al-Jamil',
      role: 'Emergency Physician',
      position: [-6, 0, -50],
      injury: 'Severe lacerations and arterial bleeding from shattered glass canopy.',
      condition: 'Hypovolemic shock imminent. Immediate tourniquet & trauma dressing required.',
      requiredSupply: 'medkits',
      supplyLabel: 'Trauma Medkit',
      status: 'TRAPPED',
      dialogue: 'I\'ve lost too much blood... apply pressure dressing... quick!',
      rescuedDialogue: 'Bleeding controlled. Splendid work. Let\'s get to the evac chopper.'
    }
  ],

  scoring: {
    survivorSavedPoints: 300,
    timeRemainingMultiplier: 1.5,
    unusedSupplyPoints: 50,
    cleanRescueBonus: 100
  }
};
