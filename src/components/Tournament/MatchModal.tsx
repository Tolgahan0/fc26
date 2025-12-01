import React, { useState } from 'react';
import { type Match } from '../../types';
import { useTournamentStore } from '../../store/tournamentStore';
import { X, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface MatchModalProps {
    match: Match;
    onClose: () => void;
}

export const MatchModal: React.FC<MatchModalProps> = ({ match, onClose }) => {
    const { players, teams, updateMatch } = useTournamentStore();
    const navigate = useNavigate();
    const [score1, setScore1] = useState(match.score1 ?? 0);
    const [score2, setScore2] = useState(match.score2 ?? 0);

    const player1 = players.find((p) => p.id === match.player1Id);
    const player2 = players.find((p) => p.id === match.player2Id);
    const team1 = teams.find((t) => t.id === player1?.assignedTeamId);
    const team2 = teams.find((t) => t.id === player2?.assignedTeamId);

    const handleSave = () => {
        const winnerId =
            score1 === score2
                ? undefined
                : score1 > score2
                    ? match.player1Id
                    : match.player2Id;

        updateMatch(match.id, {
            score1,
            score2,
            winnerId,
            status: 'completed',
        });

        const allCompleted = useTournamentStore
            .getState()
            .matches.filter((m) => !m.isBye && m.player1Id && m.player2Id)
            .every((m) => m.status === 'completed');

        if (allCompleted) {
            navigate('/results');
        }

        onClose();
    };

    if (!player1 || !player2) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-800 w-full max-w-md rounded-2xl border border-slate-700 shadow-2xl overflow-hidden animate-in zoom-in duration-200">
                <div className="flex items-center justify-between p-4 border-b border-slate-700 bg-slate-900/50">
                    <h3 className="font-bold text-lg">Match Result</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Player 1 */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {team1?.badge && <img src={team1.badge} className="w-10 h-10 object-contain" />}
                            <div>
                                <p className="font-bold text-lg">{team1?.name}</p>
                                <p className="text-sm text-slate-400">{player1.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setScore1(Math.max(0, score1 - 1))}
                                className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center font-bold"
                            >-</button>
                            <span className="text-2xl font-bold w-8 text-center">{score1}</span>
                            <button
                                onClick={() => setScore1(score1 + 1)}
                                className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center font-bold"
                            >+</button>
                        </div>
                    </div>

                    <div className="text-center text-slate-500 text-sm font-bold">VS</div>

                    {/* Player 2 */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {team2?.badge && <img src={team2.badge} className="w-10 h-10 object-contain" />}
                            <div>
                                <p className="font-bold text-lg">{team2?.name}</p>
                                <p className="text-sm text-slate-400">{player2.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setScore2(Math.max(0, score2 - 1))}
                                className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center font-bold"
                            >-</button>
                            <span className="text-2xl font-bold w-8 text-center">{score2}</span>
                            <button
                                onClick={() => setScore2(score2 + 1)}
                                className="w-8 h-8 rounded-full bg-slate-700 hover:bg-slate-600 flex items-center justify-center font-bold"
                            >+</button>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-slate-900/50 flex justify-end">
                    <button
                        onClick={handleSave}
                        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold transition-colors"
                    >
                        <Check size={18} />
                        Confirm Result
                    </button>
                </div>
            </div>
        </div>
    );
};
