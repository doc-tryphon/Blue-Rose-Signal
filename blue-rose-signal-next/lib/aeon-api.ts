import { ChatRequest, ChatResponse, DisplayStatus } from './aeon-types';

const API_ENDPOINT = '/api/chat';
const STORAGE_KEY = 'aeon_session_id';

export class AeonClient {
    static getSessionId(): string | undefined {
        if (typeof window === 'undefined') return undefined;
        return localStorage.getItem(STORAGE_KEY) || undefined;
    }

    static setSessionId(id: string): void {
        if (typeof window === 'undefined') return;
        localStorage.setItem(STORAGE_KEY, id);
    }

    static clearSession(): void {
        if (typeof window === 'undefined') return;
        localStorage.removeItem(STORAGE_KEY);
    }

    static async sendMessage(
        message: string,
        mode: "rigorous" | "exploratory" | "hybrid" = "hybrid"
    ): Promise<ChatResponse> {
        const sessionId = this.getSessionId();

        const payload: ChatRequest = {
            message,
            session_id: sessionId,
            mode
        };

        try {
            let res = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            // Handle Stale Session (404)
            if (res.status === 404 && sessionId) {
                console.warn("Session expired or invalid. Creating new session...");
                this.clearSession();
                // Retry without session ID
                payload.session_id = undefined;
                res = await fetch(API_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });
            }

            if (!res.ok) {
                throw new Error(`Protocol Error: ${res.statusText}`);
            }

            const data: ChatResponse = await res.json();

            // Update session ID if returned
            if (data.session_id) {
                this.setSessionId(data.session_id);
            }

            return data;

        } catch (error) {
            console.error("AEON Uplink Failed:", error);
            // Return a fallback "Breach" response so the UI can show the error state
            return {
                response: `**CRITICAL FAILURE**: Connection to AEON core lost. \n\nError trace: _${error instanceof Error ? error.message : 'Unknown'}_`,
                session_id: sessionId || 'ERRORED',
                display_status: DisplayStatus.PROTOCOL_BREACH,
                fidelity: 0.0,
                verified_claims: []
            };
        }
    }
}
