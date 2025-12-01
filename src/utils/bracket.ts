import { type Player, type Match } from '../types';

type Participant = string | 'BYE';

const createMatchId = (round: number, index: number) => `R${round}-M${index}`;

const pairParticipants = (participants: Participant[]): [Participant, Participant][] => {
    const pairings: [Participant, Participant][] = [];
    const half = participants.length / 2;

    for (let i = 0; i < half; i++) {
        pairings.push([participants[i], participants[participants.length - 1 - i]]);
    }

    return pairings;
};

export const generateRoundRobinSchedule = (players: Player[]): Match[] => {
    const playerIds: Participant[] = players.map((player) => player.id);
    if (playerIds.length < 2) return [];

    if (playerIds.length % 2 !== 0) {
        playerIds.push('BYE');
    }

    const roundsPerLeg = playerIds.length - 1;
    let rotation = [...playerIds];
    const firstLegPairings: [Participant, Participant][][] = [];

    for (let round = 0; round < roundsPerLeg; round++) {
        firstLegPairings.push(pairParticipants(rotation));
        rotation = [
            rotation[0],
            rotation[rotation.length - 1],
            ...rotation.slice(1, -1),
        ];
    }

    const matches: Match[] = [];

    const addRoundMatches = (
        roundNumber: number,
        pairings: [Participant, Participant][],
        reverse: boolean,
    ) => {
        pairings.forEach(([home, away], index) => {
            const host = reverse ? away : home;
            const guest = reverse ? home : away;
            const matchId = createMatchId(roundNumber, index);

            if (host === 'BYE' || guest === 'BYE') {
                const realPlayerId = host === 'BYE' ? (guest === 'BYE' ? undefined : guest) : host;
                if (!realPlayerId) return;

                matches.push({
                    id: matchId,
                    round: roundNumber,
                    matchIndex: index,
                    player1Id: realPlayerId === 'BYE' ? undefined : realPlayerId,
                    status: 'completed',
                    isBye: true,
                });
                return;
            }

            matches.push({
                id: matchId,
                round: roundNumber,
                matchIndex: index,
                player1Id: host,
                player2Id: guest,
                status: 'scheduled',
            });
        });
    };

    firstLegPairings.forEach((pairings, index) => {
        addRoundMatches(index + 1, pairings, false);
    });

    firstLegPairings.forEach((pairings, index) => {
        addRoundMatches(roundsPerLeg + index + 1, pairings, true);
    });

    return matches;
};

