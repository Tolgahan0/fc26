import { type Team } from '../types';

export const SUPER_LIG: Team[] = [
    { id: 'gs', name: 'Galatasaray', league: 'Süper Lig', badge: 'https://upload.wikimedia.org/wikipedia/commons/f/f6/Galatasaray_Sports_Club_Logo.png' },
    { id: 'fb', name: 'Fenerbahçe', league: 'Süper Lig', badge: 'https://upload.wikimedia.org/wikipedia/tr/8/86/Fenerbah%C3%A7e_SK.png' },
    { id: 'bjk', name: 'Beşiktaş', league: 'Süper Lig', badge: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Besiktas_jk.png' },
    { id: 'ts', name: 'Trabzonspor', league: 'Süper Lig', badge: 'https://upload.wikimedia.org/wikipedia/tr/a/ab/Trabzonspor_Amblemi.png' },
    { id: 'ads', name: 'Adana Demirspor', league: 'Süper Lig' },
    { id: 'basaksehir', name: 'Başakşehir', league: 'Süper Lig' },
    { id: 'kasimpasa', name: 'Kasımpaşa', league: 'Süper Lig' },
    { id: 'sivasspor', name: 'Sivasspor', league: 'Süper Lig' },
];

export const PREMIER_LEAGUE: Team[] = [
    { id: 'mci', name: 'Manchester City', league: 'Premier League' },
    { id: 'ars', name: 'Arsenal', league: 'Premier League' },
    { id: 'liv', name: 'Liverpool', league: 'Premier League' },
    { id: 'av', name: 'Aston Villa', league: 'Premier League' },
    { id: 'tot', name: 'Tottenham', league: 'Premier League' },
    { id: 'che', name: 'Chelsea', league: 'Premier League' },
    { id: 'mun', name: 'Manchester United', league: 'Premier League' },
    { id: 'new', name: 'Newcastle', league: 'Premier League' },
];

export const LALIGA: Team[] = [
    { id: 'rma', name: 'Real Madrid', league: 'LaLiga' },
    { id: 'bar', name: 'Barcelona', league: 'LaLiga' },
    { id: 'atm', name: 'Atlético Madrid', league: 'LaLiga' },
    { id: 'sev', name: 'Sevilla', league: 'LaLiga' },
    { id: 'rso', name: 'Real Sociedad', league: 'LaLiga' },
    { id: 'bet', name: 'Real Betis', league: 'LaLiga' },
    { id: 'vil', name: 'Villarreal', league: 'LaLiga' },
    { id: 'val', name: 'Valencia', league: 'LaLiga' },
];

export const SERIE_A: Team[] = [
    { id: 'int', name: 'Inter Milan', league: 'Serie A' },
    { id: 'mil', name: 'AC Milan', league: 'Serie A' },
    { id: 'juv', name: 'Juventus', league: 'Serie A' },
    { id: 'nap', name: 'Napoli', league: 'Serie A' },
    { id: 'rom', name: 'Roma', league: 'Serie A' },
    { id: 'laz', name: 'Lazio', league: 'Serie A' },
    { id: 'ata', name: 'Atalanta', league: 'Serie A' },
    { id: 'fio', name: 'Fiorentina', league: 'Serie A' },
];

export const BUNDESLIGA: Team[] = [
    { id: 'bay', name: 'Bayern Munich', league: 'Bundesliga' },
    { id: 'dor', name: 'Borussia Dortmund', league: 'Bundesliga' },
    { id: 'lev', name: 'Bayer Leverkusen', league: 'Bundesliga' },
    { id: 'rbl', name: 'RB Leipzig', league: 'Bundesliga' },
    { id: 'stu', name: 'Stuttgart', league: 'Bundesliga' },
    { id: 'fra', name: 'Eintracht Frankfurt', league: 'Bundesliga' },
    { id: 'wolf', name: 'Wolfsburg', league: 'Bundesliga' },
    { id: 'bm', name: 'Borussia Mönchengladbach', league: 'Bundesliga' },
];

export const ALL_LEAGUES = {
    'Süper Lig': SUPER_LIG,
    'Premier League': PREMIER_LEAGUE,
    'LaLiga': LALIGA,
    'Serie A': SERIE_A,
    'Bundesliga': BUNDESLIGA,
};
