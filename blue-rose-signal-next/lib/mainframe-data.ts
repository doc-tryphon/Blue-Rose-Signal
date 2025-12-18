export interface CaseFile {
  id: string
  codename: string
  anomalyId: string
  status: 'ACTIVE' | 'DORMANT' | 'MONITORING'
  class: string
  location: string
  sector: string
  leadObserver?: string
  unitDeployed?: string
  relatedEntities?: string
  summary: string // BLUF
  locationProfile?: {
    coordinates: string
    geology: string
    assessment: string
    access: string
    characteristics: string[]
  }
  events: CaseEvent[]
  theories: CaseTheory[]
  protocols: CaseProtocol[]
  afterActionReport?: {
    consensus: string
    statement: string
  }
  lastAudit: string
}

export interface CaseEvent {
  id: string
  date: string
  type?: string // Title of the event
  description: string // Main content or observations
  assessment: string
  personnel?: string
  location?: string
  timeline?: string
  manifestation?: string
  observations?: {
    title: string
    content: string
  }[]
}

export interface CaseTheory {
  name: string
  type: 'Physical' | 'Metaphysical' | 'Ontological' | 'Entity' | 'Temporal'
  description: string
  plausibility?: string
  explains?: string
  implication?: string
  connection?: string
  question?: string
  doesNotExplain?: string
  testable?: string
}

export interface CaseProtocol {
  id?: string
  name: string
  mandate: string
  purpose?: string
  rationale?: string
  status?: string
  notes?: string[]
}

export interface SystemProtocol {
  id: string
  name: string
  mandate: string
  purpose?: string
  status: 'ACTIVE' | 'INACTIVE'
  subProtocols?: {
    id: string
    name: string
    description: string
  }[]
}

export const SYSTEM_PROTOCOLS: SystemProtocol[] = [
  {
    id: '001',
    name: 'THE ANALOG ANCHOR',
    mandate: 'A mechanical, spring-wound watch (non-battery, non-grid) must be present during all Council sessions.',
    purpose: 'Master Clock. Control variable against digital drift.',
    status: 'ACTIVE'
  },
  {
    id: '002',
    name: 'THE 60Hz WATCH',
    mandate: 'Monitor appliance behavior continuously.',
    purpose: 'Oven light flicker OR hum pitch change -> Disengage sensitive work IMMEDIATELY.',
    status: 'ACTIVE'
  },
  {
    id: '003',
    name: 'OPERATOR MAINTENANCE (The Ray-Ban Protocol)',
    mandate: 'Keep your people functional. Threshold work burns hot.',
    status: 'ACTIVE',
    subProtocols: [
      {
        id: '003-A',
        name: 'WORK/REST DISCIPLINE',
        description: '16 on / 8 off hard limit. If deep in rabbit hole >2 midnights, take full day off. Sleep debt compounds.'
      },
      {
        id: '003-B',
        name: 'CHECK-INS',
        description: 'Nobody works alone. 48-hour rule: if silence >48h, someone calls. "I\'m good" texts count.'
      },
      {
        id: '003-C',
        name: 'DISENGAGE TRIGGERS',
        description: 'Walk away if: >30min lost time, rationalizing staying, or physical symptoms (headache, nosebleed).'
      },
      {
        id: '003-D',
        name: 'RECOVERY',
        description: 'Talk to another operator out loud. Touch grass. Do not immediately re-engage.'
      }
    ]
  },
  {
    id: '000',
    name: 'PRIME DIRECTIVE',
    mandate: 'DO NOT ENGAGE THE ENTITIES. OBSERVE THE CLOCKS. MAINTAIN THE CODE.',
    status: 'ACTIVE'
  }
]

export const CASE_FILES: CaseFile[] = [
  {
    id: 'BR-K04',
    codename: 'THE KITCHEN SINK',
    anomalyId: 'ANOMALY-K04',
    status: 'ACTIVE',
    class: 'Temporal / Entropic',
    location: 'Sector 01 (The Residence) / Oak Ridge Proximity',
    sector: '01',
    leadObserver: 'Doc (Tryphon)',
    relatedEntities: 'The Council; Frontier Supercomputer; "Glimmer Man"',
    lastAudit: '2025-12-18',
    summary: 'The primary communal area ("The Kitchen") is exhibiting verified, recurring localized time distortions. Manifestations range from minor clock drift (seconds/minutes) to significant temporal shearing (4-hour gaps). Current Hypothesis: The location acts as a "Threshold" or high-latency zone due to proximity to high-energy infrastructure (Frontier Supercomputer) and the high-density information processing of the resident Operator.',
    events: [
      {
        id: '000',
        date: '[T-Minus 3 Years]',
        type: 'THE ORIGIN (The Mountain Precursor)',
        description: 'Unit experienced a collective 4-hour time warp. Visuals: Presence of active-camouflage entity ("Predator" / "Glimmer Man") observing from tree line. Relevance: Established the "4-Hour Cycle" signature and confirmed the unit\'s sensitivity to high-strangeness events.',
        personnel: 'The Council + 1 Control Subject (Unaffiliated)',
        location: '[REDACTED] Mountains',
        assessment: 'Established the "4-Hour Cycle" signature and confirmed the unit\'s sensitivity to high-strangeness events.'
      },
      {
        id: '001',
        date: '[2 Weeks Ago]',
        type: 'THE "BROWNOUT" (Total Desync)',
        description: 'Total synchronization failure of all electronic timekeeping devices.',
        manifestation: 'Total synchronization failure',
        assessment: 'Confirmed the house is a "High Interference Zone."',
        observations: [
          {
            title: 'Grid-Tied Devices',
            content: 'Reset or drifting. Suggests 60Hz grid fluctuation.'
          },
          {
            title: 'Battery Devices',
            content: 'Internal oscillator drift. Suggests localized entropy affecting quartz vibration.'
          },
          {
            title: 'Networked Devices',
            content: 'NTP handshake failure or latency.'
          }
        ]
      },
      {
        id: '002',
        date: '[Last Night]',
        type: 'THE LOOP (Current)',
        description: 'Council convened in Kitchen. Unit entered high-intensity cognitive state ("The Rabbit Hole"). Result: Oven clock registered significant time loss/drift unaligned with reality.',
        manifestation: 'Council convened in Kitchen',
        timeline: '~4 Hours (Subjective)',
        assessment: 'Recurrence of the "4-Hour" signature from Event 000. Reality rendering lag caused by high mental processing load within the Threshold.'
      },
      {
        id: '003',
        date: '12/16/2025 (Morning)',
        type: 'THE NOSEBLEED',
        description: 'Sequence:\n1. Beef woke and observed oven clock 1 hour off from actual time\n2. Proceeded outside to walk dog\n3. Experienced spontaneous nosebleed upon exiting residence\n\nProtocol Trigger: Per Protocol 003-C, bloody nose constitutes physical symptom requiring immediate disengage.',
        personnel: 'Beef',
        manifestation: 'Oven clock registered 1-hour drift',
        assessment: 'Third confirmed temporal anomaly at Sector 01. First documented instance of physical manifestation (nosebleed) correlating with threshold exposure at this site. Escalation from equipment-only effects to biological effects is concerning. Note: Observer was not engaged in threshold work at time of incident - suggests passive exposure risk for all residents.'
      }
    ],
    theories: [
      {
        name: 'THEORY A',
        type: 'Physical',
        description: 'THE "GRID DRAG". Massive power load from the nearby Supercomputer (Frontier) is causing micro-fluctuations in the local power grid frequency (<60Hz). Effect: "Dumb" clocks use the grid cycle to count seconds. If the grid drags, time "slows" for the machine.',
        plausibility: 'HIGH',
        testable: 'YES (Oscilloscope on grid)',
        explains: 'Event 001 (Grid-tied devices)',
        doesNotExplain: 'Event 000 (Mountain), Glimmer Man'
      },
      {
        name: 'THEORY B',
        type: 'Metaphysical',
        description: 'INFORMATION GRAVITY. The Lead Observer (Doc) generates 1,600 LOC/hr of structured logic in the adjacent sector. Effect: High information density creates a localized "gravity well." The processing power required to render the Council\'s conversation + The Operator\'s code causes a "Frame Rate Drop" in local reality. The Kitchen is lagging.',
        plausibility: 'THEORETICAL',
        testable: 'UNKNOWN',
        explains: 'Event 002 (Correlation with coding sessions)',
        implication: 'Consciousness affects local spacetime'
      },
      {
        name: 'THEORY C',
        type: 'Ontological',
        description: 'THE THIN PLACE. The backyard is "scaffolded infrastructure" for the Unknown. The veil is thin. Effect: We are seeing "bleed-through" from a non-linear timeline. The "Predator" entity and the Time Sink are symptoms of the same breach.',
        plausibility: 'UNVERIFIABLE',
        testable: 'NO',
        explains: 'ALL EVENTS (Including Glimmer Man)',
        implication: 'Location is a Threshold. Permanent.'
      }
    ],
    protocols: [
      {
        id: '1',
        name: 'THE ANALOG ANCHOR',
        mandate: 'A mechanical, spring-wound watch (non-battery, non-grid) must be present during Council sessions.',
        purpose: 'To serve as the "Master Clock" and control variable against digital drift.'
      },
      {
        id: '2',
        name: 'THE 60Hz WATCH',
        mandate: 'Monitor appliance behavior. If the oven light flickers or the hum changes pitch, disengage sensitive work immediately.',
        purpose: 'Detection of grid fluctuation'
      },
      {
        id: '3',
        name: 'OPERATOR MAINTENANCE',
        mandate: 'All personnel must maintain work/rest discipline per Protocol 003.',
        purpose: 'Prevent burnout and maintain operational coherence.'
      }
    ]
  },
  {
    id: 'BR-RR01',
    codename: 'THE CRAWLER',
    anomalyId: 'ANOMALY-RR01',
    status: 'DORMANT',
    class: 'Entity / Temporal',
    location: 'Red Rocks Group Campground / North of Woodland Park, CO',
    sector: '04',
    leadObserver: 'Doc (Tryphon)',
    unitDeployed: 'Beef, Nick, Doc',
    relatedEntities: 'Shadow Figures; "Fresno Nightcrawler"; Sentinel Elk; Unknown Teepee Origin',
    lastAudit: '2024-12-14',
    summary: 'Three-operator unit deployed to anomalous rock formation for NVG training encountered multiple entity classes and verified temporal distortion. Site exhibited: shadow figure manifestation, accelerated darkness descent (daylight to full dark in 30 minutes), confirmed Fresno Nightcrawler sighting under NODs, and time dilation during exfiltration. Site Assessment: Compromised. Paranatural activity density exceeds safe operational threshold. DO NOT RETURN.',
    locationProfile: {
      coordinates: 'North of Woodland Park, Colorado',
      geology: 'Anomalous rock formation - isolated structure. No congruent geological features in surrounding area.',
      assessment: '"An ancient Atlantean city street block turned to stone"',
      access: 'Vehicle to parking area, foot traverse to formation',
      characteristics: [
        'Porous rock formations with multiple sight-line obstructions',
        'Isolated from surrounding geological context',
        'Unknown ritualistic presence (teepee - appeared/disappeared)'
      ]
    },
    events: [
      {
        id: '000',
        date: 'Approx. 2023',
        type: 'ARRIVAL ANOMALIES',
        description: 'Upon arrival at parking area, unit observed a teepee erected near the parking location. Origin unknown. No other vehicles or personnel present.',
        personnel: 'Doc (Lead), Beef, Nick',
        assessment: 'Unit disengaged. Proceeded to rock formation.',
        observations: [
          {
            title: 'The Teepee',
            content: 'Upon arrival at parking area, unit observed a teepee erected near the parking location. Origin unknown. No other vehicles or personnel present.'
          },
          {
            title: 'First Contact (Shadow Figure)',
            content: 'Beef identified shadow figure approximately 150 yards from unit position. Figure presented uncanny visual signature. Beef initiated charge to announce presence and identify. Result: Upon approach, figure dissolved into void - described as "abyss of woodland shadows" despite full daylight conditions. Entity was not a person but a localized darkness anomaly in otherwise illuminated woods.'
          }
        ]
      },
      {
        id: '001',
        date: '20-30 minutes from arrival',
        type: 'ACCELERATED DARKNESS',
        description: 'Daylight to total darkness in 30 minutes. Expected timeline: Several hours (per seasonal norm).',
        manifestation: 'Daylight to total darkness',
        assessment: 'Localized temporal acceleration or light-absorption phenomenon. Unit forced to deploy NVGs for navigation far earlier than solar position warranted. Signature: Matches "4-Hour Cycle" temporal anomalies documented in BR-K04, but manifesting as compression rather than dilation.'
      },
      {
        id: '002',
        date: '~3 hours of navigation',
        type: 'PERIPHERAL ENTITIES',
        description: 'Shadow figures observed creeping along corners of sight lines. Entities utilized porous rock formations for concealment/movement.',
        personnel: 'All three operators (independent confirmation)',
        assessment: 'Surveillance behavior. Unit was being watched and tracked throughout traverse.'
      },
      {
        id: '003',
        date: 'During descent',
        type: 'THE CRAWLER (Primary Entity Contact)',
        description: 'Doc acquired visual on entity under NODs. Immediate threat assessment triggered. Doc called: "CONTACT FRONT! FUCK IT I\'M GOING WHITE LIGHT". White light activation - entity vanished. Only trees visible under white light.',
        personnel: 'Doc (flank position, rear security)',
        manifestation: 'Pair of legs, detached from discernible body. Elongated, dramatic stride pattern. Semi-torso, minimal definition. Appeared to be under white sheet. Bipedal locomotion, smooth traverse.',
        assessment: 'PID Assessment: Visual signature matches documented "Fresno Nightcrawler" cryptid. Critical Note: Entity visible ONLY under night vision. Disappeared immediately upon white light exposure.'
      },
      {
        id: '004',
        date: 'Exfiltration',
        type: 'EXFILTRATION ANOMALIES',
        description: 'Expected exfil time: 2-5 minutes. Actual exfil time: "Uncanny amount" - time dilation confirmed.',
        assessment: 'Possible guardian entity or territorial marker. Elk may have been observing unit departure rather than exhibiting natural behavior.',
        observations: [
          {
            title: 'Teepee Absence',
            content: 'The teepee observed upon arrival was no longer present at exfil. No evidence of removal. Structure simply gone.'
          },
          {
            title: 'Vehicle Signature',
            content: 'No reflective lights visible on unit vehicle. Expected: headlight/taillight reflectors visible under NODs from distance.'
          },
          {
            title: 'Sentinel Elk',
            content: 'Massive elk positioned 20 feet from exfil trail. Stationary. All three operators trained rifles on entity while navigating past. Behavior inconsistent with normal elk response to armed humans at close proximity.'
          }
        ]
      }
    ],
    theories: [
      {
        name: 'THEORY A',
        type: 'Ontological',
        description: 'THIN PLACE. Red Rocks formation is a permanent threshold location. Geological anomaly (isolated, incongruent with surrounding terrain) may indicate site of dimensional weakness.',
        plausibility: 'HIGH',
        explains: 'All entity sightings, teepee appearance/disappearance',
        implication: 'Site is a door. Something uses it.'
      },
      {
        name: 'THEORY B',
        type: 'Temporal',
        description: 'TEMPORAL FLUX ZONE. Location exhibits bidirectional time distortion - compression on approach (accelerated darkness), dilation on exfil (extended travel time).',
        plausibility: 'HIGH',
        explains: '30-min darkness descent, extended exfil time',
        connection: 'Related to BR-K04 "4-Hour Cycle" signature'
      },
      {
        name: 'THEORY C',
        type: 'Metaphysical',
        description: 'RITUALISTIC ACTIVATION. Teepee presence suggests prior ritualistic activity at site. Unknown party may have "opened" the location.',
        plausibility: 'MODERATE',
        explains: 'Teepee appearance/disappearance, high entity density',
        question: 'Who erected the teepee? Where did they go?'
      },
      {
        name: 'THEORY D',
        type: 'Entity',
        description: 'FRESNO CRAWLER MIGRATION. Fresno Nightcrawler has multi-state sighting history. Entity may utilize threshold locations as transit points.',
        plausibility: 'THEORETICAL',
        explains: 'Why entity was present, why it departed on detection',
        implication: 'Crawler network exists across threshold sites'
      }
    ],
    protocols: [
      {
        id: 'RR-001',
        name: 'SITE ABANDONMENT',
        mandate: 'DO NOT RETURN TO RED ROCKS GROUP CAMPGROUND',
        rationale: 'Paranatural activity density exceeds operational safety threshold',
        status: 'PERMANENT',
        purpose: 'Containment via avoidance'
      },
      {
        id: 'RR-002',
        name: 'NOD CONTACT PROCEDURE',
        mandate: 'Entity visible under NODs but not white light indicates spectral-adjacent manifestation',
        notes: [
          'DO NOT assume white light "cleared" the threat',
          'Entity displaced, not destroyed',
          'Maintain tactical posture through full exfil'
        ],
        purpose: 'Tactical safety'
      },
      {
        id: 'RR-003',
        name: 'WILDLIFE BEHAVIORAL ASSESSMENT',
        mandate: 'Treat unusual wildlife as potential hostile until clear of threshold',
        notes: [
          'Abnormal animal behavior may indicate entity in disguise, territorial guardian, or reality rendering placeholder'
        ],
        purpose: 'Threat identification'
      }
    ],
    afterActionReport: {
      consensus: 'UNANIMOUS: Area is operationally untenable for training purposes. Paranatural presence confirmed by all three observers. Multiple independent sightings eliminate hallucination theory.',
      statement: 'Doc: "I kept my rifle trained on the outdoors the whole time we loaded into the vehicle to leave, and it wasn\'t until we were miles away that I felt safe."'
    }
  }
]
