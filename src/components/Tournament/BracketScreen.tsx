import React, { useMemo, useState } from 'react';
import { useTournamentStore } from '../../store/tournamentStore';
import { type Match } from '../../types';
import { MatchModal } from './MatchModal';
import { clsx } from 'clsx';
import { Trophy } from 'lucide-react';
import { computeStandings } from '../../utils/standings';

export const BracketScreen: React.FC = () => {
    const { matches, players, teams } = useTournamentStore();
    const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

    const rounds = useMemo(() => {
        const grouped = new Map<number, Match[]>();
        matches.forEach((match) => {
            const list = grouped.get(match.round) ?? [];
            list.push(match);
            grouped.set(match.round, list);
        });
        return Array.from(grouped.entries())
            .sort((a, b) => a[0] - b[0])
            .map(([roundNumber, roundMatches]) => ({
                roundNumber,
                matches: roundMatches.sort((a, b) => a.matchIndex - b.matchIndex),
            }));
    }, [matches]);

    const standings = computeStandings(players, teams, matches);

    const getPlayerAndTeam = (playerId?: string) => {
        if (!playerId) return null;
        const player = players.find((p) => p.id === playerId);
        const team = teams.find((t) => t.id === player?.assignedTeamId);
        return { player, team };
    };

    return (
        <div className="grid lg:grid-cols-[2fr,1fr] gap-8">
            <div className="space-y-6">
                {rounds.map((round) => (
                    <div key={round.roundNumber} className="bg-slate-800/40 border border-slate-700 rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold text-white">Round {round.roundNumber}</h3>
                            <span className="text-xs uppercase tracking-wider text-slate-500">
                                {round.matches.length} maç
                            </span>
                        </div>
                        <div className="space-y-3">
                            {round.matches.map((match) => {
                                const p1Data = getPlayerAndTeam(match.player1Id);
                                const p2Data = getPlayerAndTeam(match.player2Id);
                                const canEdit = !match.isBye && match.player1Id && match.player2Id;

                                return (
                                    <div
                                        key={match.id}
                                        onClick={() => canEdit && setSelectedMatch(match)}
                                        className={clsx(
                                            "bg-slate-900/60 border rounded-xl p-4 shadow-lg transition-all",
                                            canEdit ? "cursor-pointer hover:border-emerald-500/60" : "cursor-not-allowed opacity-80",
                                            match.status === 'completed' ? "border-emerald-500/30" : "border-slate-700"
                                        )}
                                    >
                                        {match.isBye ? (
                                            <div className="text-sm text-slate-400">
                                                {p1Data?.player?.name} bu turu bay geçti.
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex-1 space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        {p1Data?.team?.badge && (
                                                            <img src={p1Data.team.badge} className="w-6 h-6 object-contain" />
                                                        )}
                                                        <div>
                                                            <p className="text-sm font-semibold text-white">{p1Data?.team?.name ?? 'TBD'}</p>
                                                            <p className="text-xs text-slate-400">{p1Data?.player?.name}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {p2Data?.team?.badge && (
                                                            <img src={p2Data.team.badge} className="w-6 h-6 object-contain" />
                                                        )}
                                                        <div>
                                                            <p className="text-sm font-semibold text-white">{p2Data?.team?.name ?? 'TBD'}</p>
                                                            <p className="text-xs text-slate-400">{p2Data?.player?.name}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-center gap-1 text-white font-bold text-xl min-w-[48px]">
                                                    <span>{match.score1 ?? '-'}</span>
                                                    <span>{match.score2 ?? '-'}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>

    <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-5 h-fit">
                <div className="flex items-center gap-2 mb-4">
                    <Trophy className="text-amber-400" />
                    <h3 className="text-lg font-semibold text-white">Lig Durumu</h3>
                </div>
                <div className="space-y-3">
                    {standings.map((row, index) => (
                        <div
                            key={row.playerId}
                            className={clsx(
                                "flex items-center justify-between bg-slate-900/60 border rounded-xl px-3 py-2 text-sm",
                                index === 0 && "border-amber-500/60"
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300 text-xs font-bold">
                                    {index + 1}
                                </div>
                                <div>
                                    <p className="font-semibold text-white">{row.team?.name ?? 'Takım Yok'}</p>
                                    <p className="text-xs text-slate-400">{row.playerName}</p>
                                </div>
                            </div>
                            <div className="text-right text-xs text-slate-400 space-y-1">
                                <p>
                                    Puan: <span className="text-white font-semibold">{row.points}</span>
                                </p>
                                <p>
                                    {row.wins}G {row.draws}B {row.losses}M
                                </p>
                                <p>
                                    AV: <span className="text-white font-semibold">{row.goalDifference}</span>
                                </p>
                            </div>
                        </div>
                    ))}
                    {standings.length === 0 && (
                        <p className="text-center text-slate-500 text-sm py-4">Henüz maç sonucu girilmedi.</p>
                    )}
                </div>
            </div>

            {selectedMatch && (
                <MatchModal
                    match={selectedMatch}
                    onClose={() => setSelectedMatch(null)}
                />
            )}
        </div>
    );
};
