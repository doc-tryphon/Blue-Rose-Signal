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
    codename: 'THE SINK',
    anomalyId: 'ANOMALY-K04',
    status: 'ACTIVE',
    class: 'Temporal/Entropic',
    location: 'Sector 01 - Oak Ridge Proximity',
    sector: '01',
    lastAudit: '2024-12-14',
    summary: 'Recurring localized time distortions with 4-hour cycle signature. Area exhibits elevated entropy readings.',
    events: [
      {
        id: '000',
        date: '2024-11-10 03:00',
        type: 'Origin',
        description: 'First detection of temporal shear. Digital clocks desynchronized by 4 minutes within 50m radius.',
        assessment: 'Initial classification as minor temporal anomaly.'
      }
    ],
    theories: [
      {
        name: 'Theory A',
        type: 'Physical',
        description: 'Localized gravitational wave interference pattern causing temporal dilation.'
      }
    ],
    protocols: [
      {
        name: 'Protocol Sync',
        mandate: 'All personnel must perform analog watch checks every 30 minutes.',
        purpose: 'Detect drift onset.'
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
