'use client'

import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkMath from 'remark-math'
import rehypeKatex from 'rehype-katex'
import 'katex/dist/katex.min.css'
import { AeonClient } from '@/lib/aeon-api'
import { ChatResponse, DisplayStatus } from '@/lib/aeon-types'

interface Message {
    id: string
    role: 'user' | 'system'
    content: string
    status?: DisplayStatus
    timestamp: string
    claims?: ChatResponse['verified_claims']
}

interface ChatInterfaceProps {
    mode: "rigorous" | "exploratory" | "hybrid"
    onResponse: (data: ChatResponse) => void
}

export default function ChatInterface({ mode, onResponse }: ChatInterfaceProps) {
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 'init',
            role: 'system',
            content: 'NEURAL LINK ESTABLISHED. AEON PROTOCOL V4.5 ACTIVE.',
            timestamp: new Date().toLocaleTimeString(),
            status: DisplayStatus.UNVERIFIED
        }
    ])
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages, isLoading])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!input.trim() || isLoading) return

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input,
            timestamp: new Date().toLocaleTimeString()
        }

        setMessages(prev => [...prev, userMsg])
        setInput('')
        setIsLoading(true)

        // Call API
        const data = await AeonClient.sendMessage(userMsg.content, mode)

        // Notify parent to update meters
        onResponse(data)

        const systemMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: 'system',
            content: data.response,
            timestamp: new Date().toLocaleTimeString(),
            status: data.display_status,
            claims: data.verified_claims
        }

        setMessages(prev => [...prev, systemMsg])
        setIsLoading(false)
    }

    // Helper to determine message color based on status
    const getStatusColor = (status?: DisplayStatus, role?: 'user' | 'system') => {
        if (role === 'user') return 'text-crt-amber/70'
        switch (status) {
            case DisplayStatus.VERIFIED: return 'text-green-400'
            case DisplayStatus.PROTOCOL_BREACH: return 'text-red-500'
            default: return 'text-crt-amber'
        }
    }

    const getBorderColor = (status?: DisplayStatus, role?: 'user' | 'system') => {
        if (role === 'user') return 'border-crt-amber/20'
        switch (status) {
            case DisplayStatus.VERIFIED: return 'border-green-500/50'
            case DisplayStatus.PROTOCOL_BREACH: return 'border-red-500/50'
            default: return 'border-crt-amber/50'
        }
    }

    return (
        <div className="flex flex-col h-full border border-crt-amber/30 bg-black/40 relative overflow-hidden">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-crt-amber/20 scrollbar-track-transparent">
                {messages.map((msg) => (
                    <div key={msg.id} className={`group ${getStatusColor(msg.status, msg.role)}`}>
                        {/* Header */}
                        <div className="flex gap-2 text-xs opacity-50 mb-1 font-mono">
                            <span>[{msg.timestamp}]</span>
                            <span className="uppercase font-bold">{msg.role === 'user' ? 'OPERATOR' : 'AEON'}</span>
                            {msg.status === DisplayStatus.VERIFIED && <span className="text-green-400">[VERIFIED]</span>}
                            {msg.status === DisplayStatus.PROTOCOL_BREACH && <span className="text-red-500 animate-pulse">[BREACH]</span>}
                        </div>

                        {/* Content Body */}
                        <div className={`pl-4 border-l-2 py-1 ${getBorderColor(msg.status, msg.role)}`}>
                            <div className="prose prose-invert prose-p:mb-2 prose-pre:bg-gray-900/50 prose-pre:border prose-pre:border-gray-700 max-w-none">
                                <ReactMarkdown
                                    remarkPlugins={[remarkMath]}
                                    rehypePlugins={[rehypeKatex]}
                                    components={{
                                        // Override strict color classes to inherit from parent div (allows green/red shifts)
                                        p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed inherit-color">{children}</p>,
                                        strong: ({ children }) => <strong className="font-bold opacity-100">{children}</strong>,
                                        code: ({ children }) => <code className="bg-white/10 px-1 rounded font-normal">{children}</code>
                                    }}
                                >
                                    {msg.content}
                                </ReactMarkdown>
                            </div>

                            {/* Claims / Proof Badges */}
                            {msg.claims && msg.claims.length > 0 && (
                                <div className="mt-4 space-y-2">
                                    <div className="text-[10px] uppercase opacity-70 border-b border-current inline-block mb-1">Citations & Proofs</div>
                                    {msg.claims.map((claim, idx) => (
                                        <div key={idx} className={`text-xs p-2 border ${claim.verified ? 'border-green-500/30 bg-green-900/10' : 'border-red-500/30 bg-red-900/10'}`}>
                                            <div className="flex justify-between font-bold mb-1">
                                                <span>CLAIM: {claim.claim}</span>
                                                <span>{claim.verified ? '[VALID]' : '[INVALID]'}</span>
                                            </div>
                                            <div className="font-mono opacity-80 pl-2 border-l border-current">
                                                {claim.proof}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}

                {/* Loading Indicator */}
                {isLoading && (
                    <div className="animate-pulse text-crt-amber/50 pl-4 border-l-2 border-crt-amber/20">
                        <span className="inline-block w-2 h-4 bg-crt-amber/50 mr-1" />
                        PROCESSING QUANTUM STATES...
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-crt-amber/30 p-4 bg-black/60">
                <form onSubmit={handleSubmit} className="flex gap-2 items-center">
                    <span className="animate-pulse text-crt-amber">&gt;</span>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isLoading}
                        className={`flex-1 bg-transparent border-none outline-none font-mono text-crt-amber placeholder-crt-amber/30 focus:ring-0 ${isLoading ? 'opacity-50 cursor-wait' : ''}`}
                        placeholder={isLoading ? "WAITING FOR RESPONSE..." : "ENTER COMMAND..."}
                        autoFocus
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-1 border border-crt-amber/30 hover:bg-crt-amber hover:text-black transition-colors text-xs uppercase disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:text-crt-amber"
                    >
                        EXECUTE
                    </button>
                </form>
            </div>
        </div>
    )
}
