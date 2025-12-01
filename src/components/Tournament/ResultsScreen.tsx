import React from 'react';
import { useTournamentStore } from '../../store/tournamentStore';
import { motion } from 'framer-motion';
import { Trophy, RefreshCw, Share2 } from 'lucide-react';
import { computeStandings } from '../../utils/standings';
import { useNavigate } from 'react-router-dom';

export const ResultsScreen: React.FC = () => {
    const { matches, players, teams, resetTournament } = useTournamentStore();
    const navigate = useNavigate();
    const standings = computeStandings(players, teams, matches);
    const champion = standings[0];

    const handleNewTournament = () => {
        if (confirm('Yeni turnuvaya başlamak istediğine emin misin?')) {
            resetTournament();
            navigate('/home', { replace: true });
        }
    };

    const handleShare = () => {
        if (navigator.share && champion?.team && champion.playerName) {
            navigator
                .share({
                    title: 'FC26 Turnuva Şampiyonu',
                    text: `${champion.playerName} (${champion.team.name}) turnuvayı kazandı!`,
                    url: window.location.href,
                })
                .catch(console.error);
        } else {
            alert('Bu cihazda paylaşım desteklenmiyor.');
        }
    };

    if (!champion) {
        return (
            <div className="text-center space-y-4 pt-20">
                <p className="text-slate-300">Henüz tüm maçlar tamamlanmadı.</p>
                <button onClick={() => navigate('/tournament')} className="text-blue-400 underline">
                    Fikstüre dön
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 text-center animate-in fade-in duration-1000">
            <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', bounce: 0.5, duration: 1 }}
                className="relative"
            >
                <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full animate-pulse" />
                <Trophy className="w-32 h-32 text-yellow-400 drop-shadow-lg relative z-10" />
            </motion.div>

            <div className="space-y-4 w-full max-w-3xl">
                <h2 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-amber-600 bg-clip-text text-transparent">
                    Lig Şampiyonu
                </h2>

                <div className="bg-slate-800/80 p-8 rounded-2xl border border-yellow-500/30 shadow-2xl backdrop-blur-sm flex flex-col items-center gap-4">
                    {champion.team?.badge && (
                        <img src={champion.team.badge} alt={champion.team.name} className="w-24 h-24 object-contain" />
                    )}
                    <div>
                        <h3 className="text-3xl font-bold text-white">{champion.playerName}</h3>
                        <p className="text-xl text-emerald-400">{champion.team?.name}</p>
                        <p className="text-sm text-slate-400">
                            {champion.points} puan · {champion.wins}G {champion.draws}B {champion.losses}M · AV {champion.goalDifference}
                        </p>
                    </div>
                </div>

                <div className="bg-slate-900/60 border border-slate-700 rounded-2xl p-6 space-y-3">
                    <h3 className="text-lg font-semibold text-white mb-2">Tam Puan Durumu</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-slate-400">
                                <tr>
                                    <th className="py-2">#</th>
                                    <th>Oyuncu</th>
                                    <th>Takım</th>
                                    <th>P</th>
                                    <th>G</th>
                                    <th>B</th>
                                    <th>M</th>
                                    <th>AV</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {standings.map((row, index) => (
                                    <tr key={row.playerId} className={index === 0 ? 'text-amber-200' : 'text-slate-200'}>
                                        <td className="py-2 font-semibold">{index + 1}</td>
                                        <td>{row.playerName}</td>
                                        <td>{row.team?.name ?? 'Takım Yok'}</td>
                                        <td>{row.points}</td>
                                        <td>{row.wins}</td>
                                        <td>{row.draws}</td>
                                        <td>{row.losses}</td>
                                        <td>{row.goalDifference}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="flex gap-4">
                <button
                    onClick={handleShare}
                    className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-white px-6 py-3 rounded-xl font-bold transition-colors"
                >
                    <Share2 size={20} />
                    Paylaş
                </button>
                <button
                    onClick={handleNewTournament}
                    className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-emerald-500/20"
                >
                    <RefreshCw size={20} />
                    Yeni Turnuva
                </button>
            </div>
        </div>
    );
};
