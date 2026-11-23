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

  initialObjectives: [
    {
      id: 'obj-locate',
      title: 'Locate 3 missing civilians in Sector 4-B',
      current: 0,
      target: 3,
      completed: false,
      isBonus: false
    },
    {
      id: 'obj-stabilize',
      title: 'Stabilize all civilian trauma casualties',
      current: 0,
      target: 3,
      completed: false,
      isBonus: false
    },
    {
      id: 'obj-conserve',
      title: 'Maintain supply reserves (Conserve ≥ 1 Medkit & 1 Tool)',
      current: 0,
      target: 2,
      completed: false,
      isBonus: true
    },
    {
      id: 'obj-extract',
      title: 'Rendezvous at Helipad LZ for helicopter extraction',
      completed: false,
      isBonus: false
    }
  ],

  survivors: [
    {
      id: 'survivor-1',
      name: 'Elena Vance',
      role: 'Structural Engineer',
      triageTag: 'DELAYED',
      triageColor: '#10b981',
      difficulty: 'Moderate',
      urgency: 'Medium',
      position: [-16, 0, -10],
      situation: 'Trapped beneath collapsed reinforced concrete girder outside First Bank.',
      injury: 'Lower limb entrapment under pre-stressed I-beam. High risk of crush syndrome.',
      condition: 'Crush syndrome risk. Conscious, severe pain in lower extremity.',
      vitals: { hr: 94, spo2: 97, bp: '124/82', stability: 65 },
      requiredSupply: 'toolkits',
      supplyLabel: 'Hydraulic Spreader Toolkit',
      actionLabel: 'Deploy Hydraulic Spreaders',
      status: 'MISSING',
      dialogue: "Help! My leg is pinned under this concrete beam... the hydraulics won't budge without heavy spreaders!",
      locatedDialogue: "Over here! Watch the dangling high-voltage cables near the wall!",
      rescuedDialogue: "Thank God! The pressure is off my leg. I can limp to extraction with your assistance.",
      evacuatedDialogue: "Aboard the evac bird! Excellent field work, operative.",
      aiRecommendation: "Structural displacement required. Deploy heavy hydraulic spreaders to release pinned extremity without causing arterial crush rupture."
    },
    {
      id: 'survivor-2',
      name: 'Marcus Chen',
      role: 'Metro Transit Tech',
      triageTag: 'URGENT',
      triageColor: '#f59e0b',
      difficulty: 'High',
      urgency: 'High',
      position: [20, 0, -22],
      situation: 'Trapped near subway ventilation shaft grate following electrical fire.',
      injury: 'Severe toxic particulate inhalation & thermal airway edema. Respiratory failure imminent.',
      condition: 'Acute respiratory distress. SpO2 critically dropping.',
      vitals: { hr: 114, spo2: 79, bp: '110/70', stability: 42 },
      requiredSupply: 'oxygen',
      supplyLabel: 'Emergency O2 Canister',
      actionLabel: 'Administer High-Flow O2 Seal',
      status: 'MISSING',
      dialogue: "*Coughing violently* Can't... breathe... smoke dampers failed... air is toxic...",
      locatedDialogue: "*Coughs* Down here... by the ventilation shaft...",
      rescuedDialogue: "Air... clear oxygen flowing. Lungs clearing up. Thank you, responder.",
      evacuatedDialogue: "Evac secured. O2 saturation back to 98%. You saved my life.",
      aiRecommendation: "Acute hypoxia detected. Administer pressurized O2 canister immediately to halt hypoxic brain injury."
    },
    {
      id: 'survivor-3',
      name: 'Dr. Sarah Al-Jamil',
      role: 'Emergency Physician',
      triageTag: 'IMMEDIATE',
      triageColor: '#ef4444',
      difficulty: 'Critical',
      urgency: 'Extreme',
      position: [-6, 0, -50],
      situation: 'Pinned near shattered medical transport bus canopy.',
      injury: 'Deep arterial laceration from falling tempered plate glass. Class III hypovolemic shock imminent.',
      condition: 'Hypovolemic shock imminent. Immediate tourniquet & trauma dressing required.',
      vitals: { hr: 138, spo2: 91, bp: '82/50', stability: 25 },
      requiredSupply: 'medkits',
      supplyLabel: 'Trauma Medkit',
      actionLabel: 'Apply Arterial Pressure Dressing',
      status: 'MISSING',
      dialogue: "I've lost too much blood... apply the trauma tourniquet & hemostatic dressing... quickly!",
      locatedDialogue: "Responder... over here... losing consciousness rapidly...",
      rescuedDialogue: "Bleeding controlled. Tourniquet pressure holding. Outstanding clinical technique.",
      evacuatedDialogue: "Evac complete. I will coordinate trauma reception at base hospital.",
      aiRecommendation: "Critical blood volume loss. Immediate deployment of trauma medkit with hemostatic pressure dressing mandatory."
    }
  ],

  scoring: {
    survivorSavedPoints: 300,
    timeRemainingMultiplier: 1.5,
    unusedSupplyPoints: 50,
    cleanRescueBonus: 100,
    objectiveBonus: 100
  }
};

