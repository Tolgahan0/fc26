import { type Team, type Player } from '../types';

export const shuffleArray = <T>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

export const assignTeamsRandomly = (players: Player[], teams: Team[]): Player[] => {
    const shuffledTeams = shuffleArray(teams);
    return players.map((player, index) => ({
        ...player,
        assignedTeamId: shuffledTeams[index % shuffledTeams.length].id,
    }));
};

export const getRandomTeam = (teams: Team[], excludeIds: string[] = []): Team | null => {
    const availableTeams = teams.filter((t) => !excludeIds.includes(t.id));
    if (availableTeams.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * availableTeams.length);
    return availableTeams[randomIndex];
};
