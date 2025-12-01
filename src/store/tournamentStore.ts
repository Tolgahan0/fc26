import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { type Team, type Player, type Match, type TournamentState } from '../types';

interface TournamentStore extends TournamentState {
    setTeams: (teams: Team[]) => void;
    setAvailableTeamIds: (teamIds: string[]) => void;
    consumeTeam: (teamId: string) => void;
    assignTeamToPlayer: (playerId: string, teamId: string) => void;
    addTeam: (team: Team) => void;
    removeTeam: (teamId: string) => void;
    setPlayers: (players: Player[]) => void;
    addPlayer: (player: Player) => void;
    removePlayer: (playerId: string) => void;
    updatePlayer: (playerId: string, updates: Partial<Player>) => void;
    setMatches: (matches: Match[]) => void;
    updateMatch: (matchId: string, updates: Partial<Match>) => void;
    resetTournament: () => void;
}

const initialState: TournamentState = {
    teams: [],
    availableTeamIds: [],
    players: [],
    matches: [],
    history: [],
};

export const useTournamentStore = create<TournamentStore>()(
    persist(
        (set) => ({
            ...initialState,
            setTeams: (teams) => set({ teams, availableTeamIds: teams.map((team) => team.id) }),
            setAvailableTeamIds: (teamIds) => set({ availableTeamIds: teamIds }),
            consumeTeam: (teamId) =>
                set((state) => ({
                    availableTeamIds: state.availableTeamIds.filter((id) => id !== teamId),
                })),
            assignTeamToPlayer: (playerId, teamId) =>
                set((state) => ({
                    players: state.players.map((player) =>
                        player.id === playerId ? { ...player, assignedTeamId: teamId } : player
                    ),
                })),
            addTeam: (team) =>
                set((state) => ({
                    teams: [...state.teams, team],
                    availableTeamIds: [...state.availableTeamIds, team.id],
                })),
            removeTeam: (teamId) =>
                set((state) => ({
                    teams: state.teams.filter((t) => t.id !== teamId),
                    availableTeamIds: state.availableTeamIds.filter((id) => id !== teamId),
                })),
            setPlayers: (players) => set({ players }),
            addPlayer: (player) => set((state) => ({ players: [...state.players, player] })),
            removePlayer: (playerId) =>
                set((state) => ({ players: state.players.filter((p) => p.id !== playerId) })),
            updatePlayer: (playerId, updates) =>
                set((state) => ({
                    players: state.players.map((p) =>
                        p.id === playerId ? { ...p, ...updates } : p
                    ),
                })),
            setMatches: (matches) => set({ matches }),
            updateMatch: (matchId, updates) =>
                set((state) => ({
                    matches: state.matches.map((m) =>
                        m.id === matchId ? { ...m, ...updates } : m
                    ),
                })),
            resetTournament: () => set(initialState),
        }),
        {
            name: 'tournament-storage',
        }
    )
);
