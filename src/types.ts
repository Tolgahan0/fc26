export interface Team {
    id: string;
    name: string;
    league: string;
    badge?: string;
    rating?: number; // Optional rating for sorting or display
}

export interface Player {
    id: string;
    name: string;
    avatar?: string;
    assignedTeamId?: string;
}

export type MatchStatus = 'scheduled' | 'in_progress' | 'completed';

export interface Match {
    id: string;
    round: number; // 1 = Final, 2 = Semis, 4 = Quarters, etc. (or 0=Final, 1=Semis...)
    // Let's use: 0 = Final, 1 = Semis, 2 = Quarters, etc.
    matchIndex: number; // Index within the round
    player1Id?: string;
    player2Id?: string;
    score1?: number;
    score2?: number;
    winnerId?: string;
    status: MatchStatus;
    nextMatchId?: string; // ID of the match the winner advances to
    isBye?: boolean;
}

export interface TournamentState {
    teams: Team[];
    availableTeamIds: string[];
    players: Player[];
    matches: Match[];
    history: Match[]; // For undo functionality or history log
}
