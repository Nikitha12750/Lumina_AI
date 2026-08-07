import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { PenTool, Layers, Clock, LogOut, Sparkles, User, FileText, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const { user, logout } = useAuth();

    const navItems = [
        { name: 'Writing Studio', path: '/', icon: PenTool },
        { name: 'Templates', path: '/templates', icon: Layers },
        { name: 'History', path: '/history', icon: Clock },
    ];

    return (
        <aside className="w-[220px] fixed left-0 top-0 bottom-0 bg-[#171A21] border-r border-white/[0.08] z-50 flex flex-col justify-between select-none">
            {/* Header / Brand */}
            <div>
                <div className="h-14 px-4 flex items-center justify-between border-b border-white/[0.08]">
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="w-6 h-6 rounded-[5px] bg-[#4F8EF7] flex items-center justify-center text-white text-xs font-semibold shadow-sm">
                            L
                        </div>
                        <div className="flex items-baseline gap-1.5">
                            <span className="font-semibold text-sm text-[#F8FAFC] tracking-tight">
                                Lumina
                            </span>
                            <span className="text-[10px] text-[#64748B] font-mono">
                                Studio
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Navigation Links */}
                <nav className="p-2 space-y-1 mt-2">
                    <div className="px-2 py-1 text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">
                        Workspace
                    </div>
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link key={item.path} to={item.path}>
                                <div
                                    className={cn(
                                        "flex items-center gap-2.5 px-2.5 py-1.5 rounded-[6px] text-xs font-medium transition-colors duration-100",
                                        isActive
                                            ? "text-[#F8FAFC] bg-[#1D212A] border border-white/[0.08]"
                                            : "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/[0.04]"
                                    )}
                                >
                                    <item.icon className={cn("w-4 h-4", isActive ? "text-[#4F8EF7]" : "text-[#64748B]")} />
                                    <span>{item.name}</span>
                                </div>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Footer / Account & Credits */}
            <div className="p-3 border-t border-white/[0.08] space-y-2.5 bg-[#171A21]">
                {/* Credit balance indicator */}
                <div className="px-2.5 py-2 rounded-[6px] bg-[#1D212A] border border-white/[0.06] flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#4F8EF7]" />
                        <span className="text-[11px] text-[#94A3B8]">Credits</span>
                    </div>
                    <span className="text-xs font-mono font-semibold text-[#F8FAFC]">
                        {user?.credits ?? 0}
                    </span>
                </div>

                {/* User Row & Logout */}
                <div className="flex items-center justify-between px-1">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-6 h-6 rounded-full bg-[#1D212A] border border-white/10 flex items-center justify-center text-[10px] font-medium text-[#94A3B8] shrink-0">
                            {user?.username?.[0]?.toUpperCase() || 'U'}
                        </div>
                        <div className="truncate">
                            <p className="text-[11px] font-medium text-[#F8FAFC] truncate">
                                {user?.username || 'Writer'}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={logout}
                        title="Sign Out"
                        className="text-[#64748B] hover:text-[#F8FAFC] hover:bg-white/[0.06] p-1.5 rounded-[4px] transition-colors"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>
        </aside>
    );
};

export { Sidebar };
