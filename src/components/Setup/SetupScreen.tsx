import React, { useMemo, useState } from 'react';
import { useTournamentStore } from '../../store/tournamentStore';
import { Plus, Trash2, Users, Shield, Play } from 'lucide-react';
import { type Team } from '../../types';
import { useNavigate } from 'react-router-dom';

const TEAM_COLORS = ['#22c55e', '#3b82f6', '#f97316', '#ec4899', '#eab308', '#06b6d4'];

export const SetupScreen: React.FC = () => {
    const {
        teams,
        players,
        setTeams,
        setAvailableTeamIds,
        addPlayer,
        removePlayer,
        setPlayers,
        setMatches,
    } = useTournamentStore();
    const navigate = useNavigate();

    const [newPlayerName, setNewPlayerName] = useState('');
    const [newTeamName, setNewTeamName] = useState('');

    const handleAddPlayer = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newPlayerName.trim()) return;

        addPlayer({
            id: crypto.randomUUID(),
            name: newPlayerName.trim(),
        });
        setNewPlayerName('');
    };

    const handleAddTeam = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTeamName.trim()) return;

        const normalized = newTeamName.trim();
        const alreadyExists = teams.some(
            (team) => team.name.trim().toLowerCase() === normalized.toLowerCase(),
        );

        if (alreadyExists) {
            alert('Bu takım zaten listede.');
            return;
        }

        const nextTeam: Team = {
            id: crypto.randomUUID(),
            name: normalized,
            league: 'Özel Lig',
            color: TEAM_COLORS[teams.length % TEAM_COLORS.length],
        };

        setTeams([...teams, nextTeam]);
        setNewTeamName('');
    };

    const handleRemoveTeam = (teamId: string) => {
        setTeams(teams.filter((team) => team.id !== teamId));
    };

    const availableTeamsCount = useMemo(() => teams.length, [teams]);

    const handleStartTournament = () => {
        if (players.length < 2) {
            alert('En az iki oyuncu ekleyin.');
            return;
        }
        if (availableTeamsCount < players.length) {
            alert('Oyuncu sayısı kadar takım ekleyin.');
            return;
        }

        const clearedPlayers = players.map((player) => ({
            ...player,
            assignedTeamId: undefined,
        }));

        setPlayers(clearedPlayers);
        setMatches([]);
        setAvailableTeamIds(teams.map((team) => team.id));
        navigate('/draft');
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-white">Turnuva Kurulumu</h2>
                <p className="text-slate-400">Oyuncuları ekleyin ve çarkta çıkacak takımları yazın.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                    <div className="flex items-center gap-2 mb-4">
                        <Users className="text-emerald-400" />
                        <h3 className="text-xl font-semibold">Oyuncular ({players.length})</h3>
                    </div>

                    <form onSubmit={handleAddPlayer} className="flex gap-2 mb-4">
                        <input
                            type="text"
                            value={newPlayerName}
                            onChange={(e) => setNewPlayerName(e.target.value)}
                            placeholder="Oyuncu adı yaz..."
                            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500 transition-colors"
                        />
                        <button
                            type="submit"
                            disabled={!newPlayerName.trim()}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Plus size={24} />
                        </button>
                    </form>

                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                        {players.map((player) => (
                            <div
                                key={player.id}
                                className="flex items-center justify-between bg-slate-700/50 p-3 rounded-lg group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 font-bold">
                                        {player.name.charAt(0).toUpperCase()}
                                    </div>
                                    <span>{player.name}</span>
                                </div>
                                <button
                                    onClick={() => removePlayer(player.id)}
                                    className="text-slate-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                        {players.length === 0 && (
                            <p className="text-center text-slate-500 py-4">Henüz oyuncu eklenmedi.</p>
                        )}
                    </div>
                </div>

                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 space-y-4">
                    <div className="flex items-center gap-2">
                        <Shield className="text-blue-400" />
                        <h3 className="text-xl font-semibold">Takımlar ({teams.length})</h3>
                    </div>

                    <form
                        onSubmit={handleAddTeam}
                        className="space-y-3 bg-slate-900/40 border border-slate-700 rounded-xl p-4"
                    >
                        <p className="text-sm text-slate-400">
                            Takım adını yazın ve ekleyin. Aynı isim (büyük/küçük harf fark etmeksizin)
                            tekrar eklenemez.
                        </p>
                        <input
                            type="text"
                            value={newTeamName}
                            onChange={(e) => setNewTeamName(e.target.value)}
                            placeholder="Takım adı"
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-emerald-500"
                        />
                        <button
                            type="submit"
                            disabled={!newTeamName.trim()}
                            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg font-semibold disabled:opacity-50"
                        >
                            Takımı Ekle
                        </button>
                    </form>

                    <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {teams.map((team) => (
                            <div
                                key={team.id}
                                className="flex items-center justify-between bg-slate-700/50 p-2 rounded-lg text-sm group"
                            >
                                <span>{team.name}</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveTeam(team.id)}
                                    className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                        {teams.length === 0 && (
                            <p className="text-center text-slate-500 py-4">Henüz takım eklenmedi.</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-center pt-4">
                <button
                    onClick={handleStartTournament}
                    disabled={players.length < 2 || availableTeamsCount < players.length}
                    className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                >
                    <Play fill="currentColor" />
                    Çarkı Başlat
                </button>
            </div>
        </div>
    );
};

