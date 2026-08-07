import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from 'react-router-dom';
import { Sparkles, Command } from 'lucide-react';

const Navbar = () => {
    const { user } = useAuth();
    const location = useLocation();

    const getBreadcrumb = () => {
        switch (location.pathname) {
            case '/': return 'Writing Studio';
            case '/templates': return 'Templates';
            case '/history': return 'History';
            default: return 'Lumina';
        }
    };

    return (
        <header className="h-14 border-b border-white/[0.08] bg-[#171A21] sticky top-0 z-40 flex items-center justify-between px-6 select-none">
            {/* Left: View breadcrumbs */}
            <div className="flex items-center gap-2">
                <span className="text-xs text-[#64748B]">Workspace</span>
                <span className="text-xs text-[#64748B]">/</span>
                <span className="text-xs font-medium text-[#F8FAFC]">
                    {getBreadcrumb()}
                </span>
            </div>

            {/* Right: Keyboard shortcut hint & Credit pill */}
            <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-1 text-[11px] text-[#64748B] px-2 py-0.5 rounded border border-white/[0.06] bg-[#1D212A]">
                    <span>⌘</span>
                    <span>Enter to Draft</span>
                </div>

                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#1D212A] border border-white/[0.08] text-xs">
                    <span className="text-[#94A3B8]">Credits:</span>
                    <span className="font-mono font-medium text-[#4F8EF7]">
                        {user?.credits ?? 0}
                    </span>
                </div>
            </div>
        </header>
    );
};

export { Navbar };
