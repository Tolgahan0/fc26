import { type Match, type Player, type Team } from '../types';

export interface StandingRow {
    playerId: string;
    playerName: string;
    team?: Team;
    played: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
    goalDifference: number;
    points: number;
}

const isMatchCountable = (match: Match) =>
    !match.isBye && match.player1Id && match.player2Id && match.status === 'completed';

export const computeStandings = (
    players: Player[],
    teams: Team[],
    matches: Match[],
): StandingRow[] => {
    const rows: Record<string, StandingRow> = {};

    players.forEach((player) => {
        rows[player.id] = {
            playerId: player.id,
            playerName: player.name,
            team: teams.find((team) => team.id === player.assignedTeamId),
            played: 0,
            wins: 0,
            draws: 0,
            losses: 0,
            goalsFor: 0,
            goalsAgainst: 0,
            goalDifference: 0,
            points: 0,
        };
    });

    matches.forEach((match) => {
        if (!isMatchCountable(match)) return;

        const playerOne = rows[match.player1Id!];
        const playerTwo = rows[match.player2Id!];
        if (!playerOne || !playerTwo || match.score1 === undefined || match.score2 === undefined) return;

        playerOne.played += 1;
        playerTwo.played += 1;

        playerOne.goalsFor += match.score1;
        playerTwo.goalsFor += match.score2;
        playerOne.goalsAgainst += match.score2;
        playerTwo.goalsAgainst += match.score1;

        playerOne.goalDifference = playerOne.goalsFor - playerOne.goalsAgainst;
        playerTwo.goalDifference = playerTwo.goalsFor - playerTwo.goalsAgainst;

        if (match.score1 > match.score2) {
            playerOne.wins += 1;
            playerTwo.losses += 1;
            playerOne.points += 3;
        } else if (match.score2 > match.score1) {
            playerTwo.wins += 1;
            playerOne.losses += 1;
            playerTwo.points += 3;
        } else {
            playerOne.draws += 1;
            playerTwo.draws += 1;
            playerOne.points += 1;
            playerTwo.points += 1;
        }
    });

    return Object.values(rows).sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
        if (b.goalsFor !== a.goalsFor) return b.goalsFor - a.goalsFor;
        return a.playerName.localeCompare(b.playerName);
    });
};

