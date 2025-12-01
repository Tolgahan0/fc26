import React from 'react';
import { Trophy } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const navigation = [
        { to: '/home', label: 'Kurulum' },
        { to: '/draft', label: 'Çark' },
        { to: '/tournament', label: 'Turnuva' },
        { to: '/results', label: 'Sonuçlar' },
    ];

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col font-sans">
            <header className="bg-slate-800 border-b border-slate-700 p-4 sticky top-0 z-10 shadow-md">
                <div className="container mx-auto flex items-center justify-between flex-wrap gap-4">
                    <Link to="/home" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                        <Trophy className="text-emerald-400 w-6 h-6" />
                        <h1 className="text-xl font-bold tracking-tight">
                            <span className="text-emerald-400">FC</span>26 Tournament
                        </h1>
                    </Link>
                    <nav className="flex items-center gap-3 text-sm">
                        {navigation.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className={({ isActive }) =>
                                    `px-3 py-1 rounded-full border transition-colors ${
                                        isActive
                                            ? 'border-emerald-400 text-white'
                                            : 'border-transparent text-slate-400 hover:border-slate-600 hover:text-white'
                                    }`
                                }
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>
                </div>
            </header>
            <main className="flex-1 container mx-auto p-4 md:p-6 max-w-4xl">
                {children}
            </main>
            <footer className="p-4 text-center text-slate-500 text-sm">
                <p>FIFA 2026 Tournament Manager</p>
                <p>Created by Tolgahan Ayaz</p>
            </footer>
        </div>
    );
};
