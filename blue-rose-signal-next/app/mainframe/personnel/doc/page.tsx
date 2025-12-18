'use client'

import Link from 'next/link'
import CRTMonitor from '@/components/CRTMonitor'

export default function PersonnelDoc() {
  return (
    <CRTMonitor>
      <div className="font-vt323 text-crt-amber max-w-4xl mx-auto pb-12 space-y-8">

        {/* Navigation */}
        <div className="flex items-center gap-2 text-sm opacity-60 border-b border-crt-amber/20 pb-2">
          <Link href="/mainframe" className="hover:text-white hover:underline">&lt; RETURN TO MAINFRAME</Link>
          <span>/</span>
          <span>PERSONNEL</span>
          <span>/</span>
          <span className="text-white">DOC</span>
        </div>

        {/* Header */}
        <div className="border-b-2 border-crt-amber pb-4">
          <div className="w-full bg-crt-amber/10 p-2 text-xs md:text-sm font-bold whitespace-pre-wrap leading-tight hidden md:block select-none opacity-50 mb-2">
{`████████████████████████████████████████████████████████████████
██  PERSONNEL DOSSIER  ██  EYES ONLY  ██  CLEARANCE: LEVEL 7  ██
████████████████████████████████████████████████████████████████`}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-widest uppercase">Personnel File: DOC</h1>
        </div>

        {/* IDENTIFICATION */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold border-b border-crt-amber/40 pb-1">IDENTIFICATION</h2>
          <div className="bg-black/40 border border-crt-amber/30 p-4 font-mono text-sm md:text-base grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
            <div><span className="opacity-50 w-32 inline-block">OPERATIVE ID:</span> <span className="text-white font-bold">BR-OAK-001</span></div>
            <div><span className="opacity-50 w-32 inline-block">LEGAL NAME:</span> <span className="bg-crt-amber text-black px-1">[REDACTED]</span></div>
            <div><span className="opacity-50 w-32 inline-block">CALLSIGN:</span> <span className="text-white font-bold">DOC</span></div>
            <div><span className="opacity-50 w-32 inline-block">DIVISION:</span> Blue Rose - Oak Ridge Field Office</div>
            <div><span className="opacity-50 w-32 inline-block">STATUS:</span> <span className="text-green-400 font-bold animate-pulse">ACTIVE</span></div>
            <div><span className="opacity-50 w-32 inline-block">CLEARANCE:</span> Level 7 (Full Mainframe Access)</div>
          </div>
        </section>

        {/* OPERATIONAL PROFILE */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold border-b border-crt-amber/40 pb-1">OPERATIONAL PROFILE</h2>
          <blockquote className="border-l-4 border-crt-amber pl-4 italic opacity-80 text-lg">
            &quot;Pattern recognition imprinted early. The rest is just applied observation.&quot;
          </blockquote>
          <p className="opacity-90 leading-relaxed">
            Primary architect of the Blue Rose Division&apos;s signal infrastructure. Responsible for threshold monitoring systems, case documentation protocols, and field equipment development.
          </p>
          <p className="opacity-90 leading-relaxed">
            No formal training in computer science. Outputs suggest direct intent-to-implementation translation—anomalous productivity metrics under review.
          </p>
        </section>

        {/* DEPLOYMENT HISTORY */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold border-b border-crt-amber/40 pb-1">DEPLOYMENT HISTORY</h2>

          <div className="grid gap-6">
            {[
              {
                title: "OPERATION: SIGNAL SPECTROGRAPH",
                status: "DEPLOYED (Public Utility)",
                stack: "Next.js 15, TypeScript, Web Audio API, Canvas",
                function: "Stochastic interference visualization instrument",
                notes: "Public-facing tool. Monitors ambient signal patterns. Cover story: \"Audio synthesizer art project.\""
              },
              {
                title: "OPERATION: MAINFRAME INFRASTRUCTURE",
                status: "ACTIVE DEVELOPMENT",
                stack: "Next.js, React, Notion API Integration",
                function: "Division case management and status dashboard",
                notes: "Dual-layer architecture. Public view sanitized. Full access requires Level 7 clearance."
              },
              {
                title: "OPERATION: DOCTOR FEYNMAN",
                status: "ACTIVE",
                stack: "n8n, 13 Sub-Agent Tools, MCP Protocol",
                function: "Personal AI research assistant / automation framework",
                notes: "Handles: Email, Calendar, Tasks, Research, Memory, News, Files, Code, Learning, Health, Content. Named for the physicist. \"What I cannot create, I do not understand.\""
              },
              {
                title: "OPERATION: PROJECT AEON",
                status: "IN DEVELOPMENT",
                stack: "ZK-STARK Proofs, Quantum Computing Framework",
                function: "Trustless verification of AI-generated knowledge",
                notes: "400+ tests implemented. Potential epistemological infrastructure. Codename \"Amelioration\" under review."
              },
              {
                title: "OPERATION: [CLASSIFIED] V2 REFACTOR",
                status: "ARCHIVED (Handover Complete)",
                stack: "Next.js 15, TypeScript, Multi-Tenant Architecture",
                function: "Emergency Systems Architecture Stabilization",
                notes: "33,003 lines refactored in <20 hours. Outcome: Asset secured. SOC2 Compliance achieved. Stable deployment environment established. Method: Claude Code direct integration. 216x productivity multiplier documented."
              }
            ].map((op, i) => (
              <div key={i} className="bg-black/30 border border-crt-amber/20 p-4 hover:border-crt-amber/50 transition-colors">
                <h3 className="font-bold text-lg mb-2 text-white">{op.title}</h3>
                <div className="space-y-1 text-sm font-mono opacity-80">
                  <div className="grid grid-cols-[100px_1fr] gap-2">
                    <span className="opacity-50">STATUS:</span>
                    <span className={op.status.includes("ACTIVE") ? "text-green-400" : op.status.includes("DEPLOYED") ? "text-blue-400" : "text-crt-amber"}>{op.status}</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-2">
                    <span className="opacity-50">TECH STACK:</span>
                    <span>{op.stack}</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-2">
                    <span className="opacity-50">FUNCTION:</span>
                    <span>{op.function}</span>
                  </div>
                  <div className="grid grid-cols-[100px_1fr] gap-2 pt-1 mt-1 border-t border-crt-amber/10">
                    <span className="opacity-50">NOTES:</span>
                    <span>{op.notes}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* KNOWN CAPABILITIES */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold border-b border-crt-amber/40 pb-1">KNOWN CAPABILITIES</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="border border-crt-amber/20 p-4">
              <h3 className="font-bold border-b border-crt-amber/20 mb-2 pb-1 text-sm text-white">TECHNICAL PROFICIENCIES</h3>
              <ul className="text-sm space-y-2 opacity-80">
                <li><span className="opacity-50 block text-xs">LANGUAGES</span>TypeScript, JavaScript, Python, SQL (Raw & ORM)</li>
                <li><span className="opacity-50 block text-xs">FRAMEWORKS</span>Next.js 15, React, Node.js, n8n, Tailwind CSS</li>
                <li><span className="opacity-50 block text-xs">INFRASTRUCTURE</span>GitHub Actions, Vercel Edge, Docker, Nginx, Neon</li>
                <li><span className="opacity-50 block text-xs">SECURITY</span>SOC2 Architecture, OAuth 2.0, NextAuth.js, OSINT</li>
                <li><span className="opacity-50 block text-xs">PROTOCOLS</span>MCP, REST, WebSocket, Web Audio API</li>
              </ul>
            </div>

            <div className="border border-crt-amber/20 p-4">
              <h3 className="font-bold border-b border-crt-amber/20 mb-2 pb-1 text-sm text-white">AI SYSTEMS PROFICIENCY</h3>
              <ul className="text-sm space-y-2 opacity-80">
                <li><span className="opacity-50 block text-xs">ORCHESTRATION</span>Context Window Optimization, Chain-of-Thought</li>
                <li><span className="opacity-50 block text-xs">ARCHITECTURE</span>RAG (Retrieval-Augmented Generation) Systems</li>
                <li><span className="opacity-50 block text-xs">INTEGRATION</span>Claude Code, MCP Server Dev, Multi-Agent Workflows</li>
              </ul>
            </div>

            <div className="border border-crt-amber/20 p-4">
              <h3 className="font-bold border-b border-crt-amber/20 mb-2 pb-1 text-sm text-white">FIELD SKILLS</h3>
              <ul className="text-sm space-y-2 opacity-80">
                <li><span className="opacity-50 block text-xs">SIGNAL ANALYSIS</span>Analog signal flow, DSP, Spectrum Analysis</li>
                <li><span className="opacity-50 block text-xs">PATTERN RECOGNITION</span>Documented sensitivity to high-strangeness</li>
                <li><span className="opacity-50 block text-xs">UNIT COORDINATION</span>Field-tested command experience (Hurricane Helene)</li>
                <li><span className="opacity-50 block text-xs">MEDICAL</span>Combat trauma response, triage protocols</li>
              </ul>
            </div>

            <div className="border border-red-500/30 bg-red-900/10 p-4">
              <h3 className="font-bold border-b border-red-500/30 mb-2 pb-1 text-sm text-red-400">ANOMALOUS METRICS</h3>
              <ul className="text-sm space-y-2 opacity-80">
                <li><span className="opacity-50 block text-xs">CODE OUTPUT</span>1,600 LOC/hour (sustained)</li>
                <li><span className="opacity-50 block text-xs">METHOD</span>Intent → Implementation (no intermediate steps)</li>
                <li><span className="opacity-50 block text-xs">EXPLANATION</span>[UNDER INVESTIGATION]</li>
              </ul>
            </div>
          </div>
        </section>

        {/* STANDARD LOADOUT */}
        <section>
          <h2 className="text-xl font-bold border-b border-crt-amber/40 mb-4 pb-1">STANDARD LOADOUT</h2>
          <div className="bg-black/40 border border-crt-amber/30 p-4 flex gap-4 items-start">
            <div className="text-3xl">👓</div>
            <div>
              <h3 className="font-bold text-white">ARTIFACT: &quot;RAY-BAN&quot;</h3>
              <div className="text-sm opacity-80 mt-1">
                <span className="opacity-50 block text-xs">FUNCTION</span>
                Epistemological Interface / Cognitive Trigger. Filters high-frequency digital noise. Initiates &quot;Deep Work&quot; protocol upon equip.
              </div>
              <div className="text-xs italic mt-2 opacity-60 border-t border-crt-amber/10 pt-2">
                NOTE: Subject refuses to operate on Class-4 anomalies (AI architecture) without this physical interface engaged.
              </div>
            </div>
          </div>
        </section>

        {/* BACKGROUND */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold border-b border-crt-amber/40 pb-1">BACKGROUND</h2>
          <div className="space-y-4 text-sm opacity-90">
            <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-2 border-b border-crt-amber/10 pb-2">
              <span className="font-bold text-crt-amber/60">ORIGIN</span>
              <div>Oak Ridge Proximity, Tennessee. Imprint Event: Age 7 - Resident Evil organizational doctrine exposure.</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-2 border-b border-crt-amber/10 pb-2">
              <span className="font-bold text-crt-amber/60">SIGNAL INTERCEPTION</span>
              <div>Asset: &quot;TheNumber5isAlive!!!&quot; (2005-2006). Early exposure to non-linear sequencing and synthesis. Proficiency in &quot;developing&quot; latent images.</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-2 border-b border-crt-amber/10 pb-2">
              <span className="font-bold text-crt-amber/60">AUDIO TRAINING</span>
              <div>Conservatory of Recording Arts & Sciences (2012). Flying Blanket Recording Internship. Systems thinking foundation: understanding how information decays and corrupts across mediums.</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-2 border-b border-crt-amber/10 pb-2">
              <span className="font-bold text-crt-amber/60">MILITARY SERVICE</span>
              <div>United States Army (2014-2018). Combat Medic (68W). Emergency trauma response, TCCC. Callsign &quot;DOC&quot; originates from this period.</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-2">
              <span className="font-bold text-crt-amber/60">UNIT AFFILIATION</span>
              <div>The Council. Alpha/Bravo/Charlie teams. Deployed during Hurricane Helene. Status: Operational.</div>
            </div>
          </div>
        </section>

        {/* PSYCHOLOGICAL PROFILE */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold border-b border-crt-amber/40 pb-1">PSYCHOLOGICAL PROFILE</h2>
          <div className="bg-black/20 p-4 border border-crt-amber/20 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="opacity-50 block text-xs">COGNITIVE STYLE</span>
              High-density information processing
            </div>
            <div>
              <span className="opacity-50 block text-xs">TETHER STATUS</span>
              STABLE - Maintains &quot;what the fuck&quot; response
            </div>
            <div className="md:col-span-2">
              <span className="opacity-50 block text-xs">CORE DIRECTIVE</span>
              <span className="font-bold text-white">RADICAL INTELLECTUAL HONESTY.</span> Subject displays inability to ignore structural falsehoods. Will refuse execution of orders that violate logical or ethical consistency.
            </div>
          </div>

          <div className="text-sm opacity-80 space-y-2 border-l-2 border-crt-amber/30 pl-4 py-1">
            <p>Subject demonstrates unusual ability to translate abstract intent directly into functional systems. No intermediate &quot;learning&quot; phase observed.</p>
            <p>Maintains strong consensus reality anchoring despite prolonged threshold work. Credits &quot;the Council&quot; as primary tether mechanism.</p>
            <p>Military background provides stress inoculation uncommon in technical operatives.</p>
          </div>
        </section>

        {/* FOOTER */}
        <div className="border-t border-crt-amber/30 pt-8 mt-12 text-center space-y-2 opacity-60">
          <div className="w-full bg-crt-amber/10 p-2 text-xs md:text-sm font-bold whitespace-pre-wrap leading-tight hidden md:block select-none mb-4">
{`████████████████████████████████████████████████████████████████
██  END OF FILE  ██  BR-OAK-001  ██  LAST UPDATE: 2025-12-18  ██
████████████████████████████████████████████████████████████████`}
          </div>
          <div className="text-xs">STATUS: ACTIVE OPERATIVE</div>
          <div className="text-xs italic">&quot;The work doesn&apos;t matter if the operator breaks.&quot; — Protocol 003</div>
        </div>

      </div>
    </CRTMonitor>
  )
}
