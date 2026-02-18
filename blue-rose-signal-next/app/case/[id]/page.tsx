'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import CRTMonitor from '@/components/CRTMonitor'
import { CASE_FILES } from '@/lib/mainframe-data'

export default function CaseFilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const caseFile = CASE_FILES.find(c => c.id === id)

  if (!caseFile) {
    notFound()
  }

  const isWarning = caseFile.status === 'ACTIVE'
  const isDormant = caseFile.status === 'DORMANT'

  return (
    <CRTMonitor>
      <div className="font-vt323 text-crt-amber max-w-4xl mx-auto pb-12">

        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm opacity-60 mb-6 border-b border-crt-amber/20 pb-2">
          <Link href="/" className="hover:text-white hover:underline">&lt; RETURN TO MAINFRAME</Link>
          <span>/</span>
          <span>CASE ARCHIVE</span>
          <span>/</span>
          <span className="text-white">{caseFile.id}</span>
        </div>

        {/* Case Header */}
        <div className={`border-l-4 p-6 mb-8 relative overflow-hidden ${
          isWarning ? 'border-red-500 bg-red-900/10' :
          isDormant ? 'border-gray-500 bg-gray-900/10' : 'border-green-500 bg-green-900/10'
        }`}>
          <div className="absolute top-0 right-0 p-2 text-xs font-bold border-b border-l border-crt-amber/20 bg-black/50">
            CLASSIFICATION: THRESHOLD-SENSITIVE
          </div>

          <h1 className="text-3xl md:text-5xl font-bold mb-2 tracking-wider">
            {caseFile.codename}
          </h1>
          <div className="flex flex-wrap gap-4 text-sm md:text-base opacity-90">
            <span className="bg-black/40 px-2 py-1 border border-crt-amber/30">
              ID: {caseFile.anomalyId}
            </span>
            <span className={`px-2 py-1 border font-bold ${
              isWarning ? 'border-red-500 text-red-500' :
              isDormant ? 'border-gray-500 text-gray-400' : 'border-green-500 text-green-500'
            }`}>
              STATUS: {caseFile.status}
            </span>
            <span className="bg-black/40 px-2 py-1 border border-crt-amber/30">
              CLASS: {caseFile.class}
            </span>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Main Content */}
          <div className="md:col-span-2 space-y-8">

            {/* BLUF */}
            <section>
              <h2 className="text-xl border-b border-crt-amber/40 mb-3 pb-1 flex items-center gap-2">
                <span className="text-red-500">🛑</span> BLUF (Bottom Line Up Front)
              </h2>
              <div className="bg-black/30 p-4 border border-crt-amber/20 text-lg leading-relaxed">
                {caseFile.summary}
              </div>
            </section>

             {/* Location Profile (New) */}
             {caseFile.locationProfile && (
              <section>
                <h2 className="text-xl border-b border-crt-amber/40 mb-3 pb-1 flex items-center gap-2">
                  <span>📍</span> LOCATION PROFILE
                </h2>
                <div className="bg-black/20 p-4 border border-crt-amber/20 space-y-3">
                  <div className="font-bold text-lg border-b border-crt-amber/10 pb-1">{caseFile.location}</div>

                  <div className="grid grid-cols-1 gap-2 text-sm opacity-90">
                    <div><span className="text-crt-amber/60">Coordinates:</span> {caseFile.locationProfile.coordinates}</div>
                    <div><span className="text-crt-amber/60">Geology:</span> {caseFile.locationProfile.geology}</div>
                    <div className="italic border-l-2 border-crt-amber/30 pl-2 my-2">
                      Assessment: {caseFile.locationProfile.assessment}
                    </div>
                    <div><span className="text-crt-amber/60">Access:</span> {caseFile.locationProfile.access}</div>
                  </div>

                  {caseFile.locationProfile.characteristics && (
                     <div className="mt-2">
                       <div className="text-xs uppercase tracking-wider text-crt-amber/60 mb-1">Site Characteristics:</div>
                       <ul className="list-disc list-inside space-y-1 opacity-80 text-sm">
                         {caseFile.locationProfile.characteristics.map((char, i) => (
                           <li key={i}>{char}</li>
                         ))}
                       </ul>
                     </div>
                  )}
                </div>
              </section>
            )}


            {/* Incident Log */}
            <section>
              <h2 className="text-xl border-b border-crt-amber/40 mb-4 pb-1 flex items-center gap-2">
                <span>📉</span> INCIDENT LOG
              </h2>
              <div className="space-y-6">
                {caseFile.events.map((event) => (
                  <div key={event.id} className="border-l-2 border-crt-amber/30 pl-4 py-1 hover:border-crt-amber transition-colors group">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2 text-sm opacity-70">
                      <span className="font-mono font-bold bg-crt-amber/10 px-2 py-0.5">EVENT {event.id}</span>
                      <div className="flex flex-col text-right">
                         <span>{event.date}</span>
                         {event.personnel && <span className="text-xs opacity-60">Personnel: {event.personnel}</span>}
                      </div>
                    </div>

                    {event.type && <div className="font-bold text-lg mb-2 text-crt-amber/90">{event.type}</div>}

                    {event.manifestation && (
                      <div className="mb-2 text-sm border border-red-500/20 bg-red-900/5 p-2">
                        <span className="text-red-400 text-xs font-bold block">MANIFESTATION:</span>
                        {event.manifestation}
                      </div>
                    )}

                    <p className="mb-3 opacity-90 whitespace-pre-line leading-relaxed">{event.description}</p>

                    {/* Sub-observations */}
                    {event.observations && (
                      <div className="space-y-3 mb-3 ml-2">
                        {event.observations.map((obs, i) => (
                          <div key={i} className="bg-black/30 p-3 border-l-2 border-crt-amber/10">
                            <div className="font-bold text-sm mb-1 text-crt-amber/80">{obs.title}</div>
                            <div className="text-sm opacity-80">{obs.content}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="text-sm bg-crt-amber/5 p-3 italic border-l-2 border-crt-amber/20">
                      <span className="font-bold not-italic text-xs block mb-1 text-crt-amber/60">ASSESSMENT:</span>
                      {event.assessment}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Mechanics & Hypotheses */}
            <section>
              <h2 className="text-xl border-b border-crt-amber/40 mb-4 pb-1 flex items-center gap-2">
                <span>⚙️</span> MECHANICS & HYPOTHESES
              </h2>
              <div className="grid gap-4">
                {caseFile.theories.map((theory, idx) => (
                  <div key={idx} className="bg-black/20 p-4 border border-crt-amber/20 hover:bg-black/40 transition-colors">
                    <div className="flex flex-wrap items-center gap-2 mb-2 border-b border-crt-amber/10 pb-2">
                      <span className="font-bold text-crt-amber">{theory.name}:</span>
                      <span className="text-xs border border-crt-amber/40 px-1 text-crt-amber/70">{theory.type}</span>
                      {theory.plausibility && (
                        <span className={`ml-auto text-xs font-bold px-2 py-0.5 ${
                          theory.plausibility === 'HIGH' ? 'bg-green-900/30 text-green-400' : 'bg-gray-800 text-gray-400'
                        }`}>
                          PLAUSIBILITY: {theory.plausibility}
                        </span>
                      )}
                    </div>
                    <p className="opacity-90 mb-3 font-bold text-sm">{theory.description}</p>

                    <div className="space-y-1 text-sm opacity-70 font-mono text-xs">
                       {theory.explains && <div><span className="text-crt-amber/50">EXPLAINS:</span> {theory.explains}</div>}
                       {theory.implication && <div><span className="text-crt-amber/50">IMPLICATION:</span> {theory.implication}</div>}
                       {theory.connection && <div><span className="text-crt-amber/50">CONNECTION:</span> {theory.connection}</div>}
                       {theory.question && <div><span className="text-crt-amber/50">QUESTION:</span> {theory.question}</div>}
                    </div>
                  </div>
                ))}
              </div>
            </section>

             {/* After Action Report (New) */}
             {caseFile.afterActionReport && (
              <section>
                <h2 className="text-xl border-b border-crt-amber/40 mb-3 pb-1 flex items-center gap-2">
                  <span>📋</span> AFTER ACTION REPORT
                </h2>
                <div className="bg-black/30 p-4 border border-crt-amber/20 space-y-4">
                  <div className="font-mono text-sm border-l-2 border-crt-amber/50 pl-4 py-1">
                     <div className="font-bold mb-1 text-crt-amber/80">UNIT CONSENSUS:</div>
                     {caseFile.afterActionReport.consensus}
                  </div>
                  <div className="italic opacity-80 bg-crt-amber/5 p-3">
                    {caseFile.afterActionReport.statement}
                  </div>
                </div>
              </section>
            )}

          </div>

          {/* Sidebar */}
          <div className="space-y-8">

            {/* Location Data */}
            <section className="bg-black/30 border border-crt-amber/30 p-4">
              <h3 className="text-sm font-bold opacity-60 mb-3 uppercase tracking-wider">Database Properties</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <div className="text-xs opacity-50">DESIGNATION</div>
                  <div className="font-bold text-lg">{caseFile.anomalyId}</div>
                  <div className="italic opacity-60">"{caseFile.codename}"</div>
                </div>
                <div>
                  <div className="text-xs opacity-50">LOCATION</div>
                  <div>{caseFile.location}</div>
                </div>
                 {caseFile.leadObserver && (
                  <div>
                    <div className="text-xs opacity-50">LEAD OBSERVER</div>
                    <div>{caseFile.leadObserver}</div>
                  </div>
                )}
                 {caseFile.unitDeployed && (
                  <div>
                    <div className="text-xs opacity-50">UNIT DEPLOYED</div>
                    <div>{caseFile.unitDeployed}</div>
                  </div>
                )}
                 {caseFile.relatedEntities && (
                  <div>
                    <div className="text-xs opacity-50">RELATED ENTITIES</div>
                    <div className="opacity-80 text-xs">{caseFile.relatedEntities}</div>
                  </div>
                )}
                <div className="pt-2 border-t border-crt-amber/10">
                  <div className="text-xs opacity-50">LAST AUDIT</div>
                  <div className="font-mono text-green-400">{caseFile.lastAudit}</div>
                </div>
              </div>
            </section>

            {/* Protocols */}
            <section>
              <h3 className="text-sm font-bold opacity-60 mb-3 uppercase tracking-wider border-b border-crt-amber/20 pb-1">
                Active Protocols & Containment
              </h3>
              <div className="space-y-3">
                {caseFile.protocols.map((protocol, idx) => (
                  <div key={idx} className="bg-red-900/10 border border-red-500/30 p-3 hover:bg-red-900/20 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                       <span className="font-bold text-red-400 text-sm">{protocol.id ? `PROTOCOL ${protocol.id}` : protocol.name}</span>
                       {protocol.status && <span className="text-[10px] border border-red-500/50 px-1 text-red-400">{protocol.status}</span>}
                    </div>
                    {protocol.id && <div className="text-xs font-bold opacity-80 mb-2">{protocol.name}</div>}

                    <div className="text-xs mb-2 opacity-80 border-l border-red-500/20 pl-2">
                       <span className="opacity-50 block text-[10px]">MANDATE:</span>
                       {protocol.mandate}
                    </div>

                    {protocol.notes && (
                      <ul className="list-disc list-inside text-[10px] opacity-70 mb-2 space-y-0.5">
                        {protocol.notes.map((note, i) => <li key={i}>{note}</li>)}
                      </ul>
                    )}

                    <div className="text-[10px] uppercase tracking-widest opacity-50 border-t border-red-500/20 pt-1">
                      Purpose: {protocol.purpose}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Actions */}
            <div className="pt-4 border-t border-crt-amber/20">
              <Link
                href="/spectrograph"
                className="block w-full text-center py-3 border border-crt-amber/50 hover:bg-crt-amber hover:text-black transition-all uppercase tracking-wider font-bold mb-2 animate-pulse"
              >
                ▶ Analyze Signal
              </Link>
              <button disabled className="block w-full text-center py-3 border border-dashed border-crt-amber/30 opacity-50 cursor-not-allowed uppercase text-sm">
                Request Edit Access
              </button>
            </div>

            {/* Footer Tag */}
            <div className="text-center opacity-30 text-[10px] font-mono border-t border-crt-amber/10 pt-4">
              [END OF FILE // {caseFile.id}]
            </div>

          </div>
        </div>

      </div>
    </CRTMonitor>
  )
}
