export interface CaseFile {
  id: string
  codename: string
  anomalyId: string
  status: 'ACTIVE' | 'DORMANT' | 'MONITORING'
  class: string
  location: string
  sector: string
  summary: string
  events: CaseEvent[]
  theories: CaseTheory[]
  protocols: CaseProtocol[]
  lastAudit: string
}

export interface CaseEvent {
  id: string
  date: string
  type: string
  description: string
  assessment: string
  personnel?: string
  location?: string
}

export interface CaseTheory {
  name: string
  type: 'Physical' | 'Metaphysical' | 'Ontological' | 'Entity'
  description: string
}

export interface CaseProtocol {
  name: string
  mandate: string
  purpose: string
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
    class: 'Entity/Temporal',
    location: 'Red Rocks - Colorado',
    sector: '04',
    lastAudit: '2023-08-15',
    summary: 'Fresno Nightcrawler contact events. Site abandoned due to high-strangeness saturation. Do not return.',
    events: [
      {
        id: '000',
        date: '2023-06-01 23:45',
        type: 'Contact',
        description: 'Video evidence of bipedal entities moving through park area.',
        assessment: 'Confirmed visual contact. Non-hostile but ontologically disruptive.'
      }
    ],
    theories: [
      {
        name: 'Theory A',
        type: 'Entity',
        description: 'Interdimensional travellers utilizing geometry not visible to human eye.'
      }
    ],
    protocols: [
      {
        name: 'Exclusion Zone',
        mandate: '1km perimeter enforcement.',
        purpose: 'Prevent civilian contact.'
      }
    ]
  }
]
