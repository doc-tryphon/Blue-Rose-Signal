export enum DisplayStatus {
    VERIFIED = "VERIFIED",
    UNVERIFIED = "UNVERIFIED",
    PROTOCOL_BREACH = "PROTOCOL_BREACH"
}

export interface VerifiedClaim {
    claim: string;
    verified: boolean;
    proof: string;
}

export interface ChatRequest {
    message: string;
    session_id?: string;
    mode?: "rigorous" | "exploratory" | "hybrid";
}

export interface ChatResponse {
    response: string;
    session_id: string;
    display_status: DisplayStatus;
    fidelity: number;
    verified_claims: VerifiedClaim[];
}
