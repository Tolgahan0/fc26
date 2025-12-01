import React, { useMemo, useState } from 'react';
import { useTournamentStore } from '../../store/tournamentStore';
import { motion, useAnimation } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { generateRoundRobinSchedule } from '../../utils/bracket';
import { type Team } from '../../types';
import { useNavigate } from 'react-router-dom';
import { generateContrastingColors } from '../../utils/palette';



export const WheelScreen: React.FC = () => {
    const {
        players,
        teams,
        availableTeamIds,
        assignTeamToPlayer,
        consumeTeam,
        setMatches,
    } = useTournamentStore();
    const navigate = useNavigate();

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isSpinning, setIsSpinning] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
    const controls = useAnimation();

    const currentPlayer = players[currentIndex];
    const remainingTeams = useMemo(
        () => teams.filter((team) => availableTeamIds.includes(team.id)),
        [teams, availableTeamIds],
    );
    const wheelSegments = remainingTeams;
    const segmentAngle = wheelSegments.length ? 360 / wheelSegments.length : 0;

    const palette = useMemo(() => generateContrastingColors(wheelSegments.length), [wheelSegments.length]);

    const wheelGradient =
        wheelSegments.length > 0
            ? `conic-gradient(${wheelSegments
                  .map((team, index) => {
                      const start = index * segmentAngle;
                      const end = (index + 1) * segmentAngle;
                      const base = palette[index];
                      return `${base} ${start}deg ${end}deg`;
                  })
                  .join(', ')})`
            : 'radial-gradient(circle at center, rgba(16,185,129,0.4), rgba(15,23,42,0.9))';

    const handleSpin = async () => {
        if (isSpinning || !currentPlayer || wheelSegments.length === 0) return;
        setIsSpinning(true);
        setShowResult(false);

        const randomIndex = Math.floor(Math.random() * wheelSegments.length);
        const targetAngle = segmentAngle * randomIndex + segmentAngle / 2;
        const extraSpins = 6 * 360;

        await controls.start({
            rotate: extraSpins + (360 - targetAngle),
            transition: { duration: 4, ease: [0.19, 1, 0.22, 1] },
        });

        setSelectedTeam(wheelSegments[randomIndex]);
        setShowResult(true);
        setIsSpinning(false);
    };

    const handleNext = () => {
        if (!selectedTeam || !currentPlayer) return;

        assignTeamToPlayer(currentPlayer.id, selectedTeam.id);
        consumeTeam(selectedTeam.id);
        setSelectedTeam(null);
        setShowResult(false);
        controls.set({ rotate: 0 });

        if (currentIndex < players.length - 1) {
            setCurrentIndex(currentIndex + 1);
            return;
        }

        const schedule = generateRoundRobinSchedule(useTournamentStore.getState().players);
        setMatches(schedule);
        navigate('/tournament');
    };

    if (!players.length || !teams.length) {
        return (
            <div className="text-center space-y-4 pt-16">
                <p className="text-slate-300">Eksik veri var. Lütfen kuruluma geri dön.</p>
                <button onClick={() => navigate('/home')} className="text-blue-400 underline">
                    Setup ekranına dön
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-10">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-white">Takım Çarkı</h2>
                <p className="text-slate-400">
                    <span className="text-emerald-400 font-bold">{currentPlayer?.name}</span> için çarkı çevir.
                </p>
            </div>

            <div className="relative flex flex-col items-center gap-6">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                    <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[24px] border-t-emerald-500 drop-shadow-lg" />
                </div>

                <motion.div
                    animate={controls}
                    className="w-[22rem] h-[22rem] md:w-[26rem] md:h-[26rem] rounded-full border-[10px] border-slate-900 bg-slate-900 relative overflow-hidden shadow-[0_0_70px_rgba(16,185,129,0.45)]"
                    style={{ backgroundImage: wheelGradient }}
                >
                    <div className="absolute inset-[6.2rem] md:inset-[6.6rem] rounded-full bg-slate-900/98 backdrop-blur-md flex items-center justify-center border border-slate-800 shadow-[0_0_40px_rgba(15,23,42,0.9)]">
                        <span className="text-slate-400 text-xs uppercase tracking-[0.55em]">FC 26</span>
                    </div>
                </motion.div>

                <div className="text-center space-y-3 w-full max-w-2xl">
                    <p className="text-slate-400 text-sm">
                        Kalan Takımlar: <span className="font-semibold text-white">{wheelSegments.length}</span>
                    </p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {wheelSegments.map((team, index) => {
                            const color = palette[index];
                            return (
                            <span
                                key={team.id}
                                className="px-3 py-1 rounded-full text-xs font-semibold text-slate-900 shadow-[0_0_18px_rgba(15,23,42,0.9)]"
                                style={{ backgroundColor: color }}
                            >
                                {team.name}
                            </span>
                        );
                        })}
                        {wheelSegments.length === 0 && (
                            <span className="text-slate-500 text-sm">Tüm takımlar dağıtıldı.</span>
                        )}
                    </div>
                </div>
            </div>

            {!showResult ? (
                <button
                    onClick={handleSpin}
                    disabled={isSpinning || wheelSegments.length === 0}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-10 py-3 rounded-2xl font-bold text-lg shadow-[0_20px_35px_rgba(16,185,129,0.3)] disabled:opacity-50 transition-all active:scale-95"
                >
                    {isSpinning ? 'Çark dönüyor...' : 'Çarkı Çevir'}
                </button>
            ) : (
                <div className="text-center space-y-4 animate-in zoom-in duration-300 w-full max-w-sm">
                    <div className="bg-slate-800 p-6 rounded-2xl border border-emerald-500/50 shadow-lg shadow-emerald-500/10">
                        <p className="text-slate-400 text-sm uppercase tracking-wider mb-2">Kazanan takım</p>
                        <div className="flex flex-col items-center gap-2">
                            {selectedTeam?.badge && (
                                <img src={selectedTeam.badge} alt={selectedTeam.name} className="w-20 h-20 object-contain" />
                            )}
                            <h3 className="text-2xl font-bold text-white">{selectedTeam?.name}</h3>
                            <span className="text-slate-400 text-sm">{selectedTeam?.league}</span>
                        </div>
                    </div>

                    <button
                        onClick={handleNext}
                        className="flex items-center gap-2 mx-auto bg-blue-500 hover:bg-blue-600 text-white px-8 py-2.5 rounded-xl font-medium transition-colors"
                    >
                        {currentIndex < players.length - 1 ? 'Sonraki Oyuncu' : 'Fikstürü Oluştur'}
                        <ArrowRight size={18} />
                    </button>
                </div>
            )}
        </div>
    );
};
