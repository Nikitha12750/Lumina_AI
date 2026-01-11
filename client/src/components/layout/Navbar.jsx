import { useAuth } from '../../context/AuthContext';
import { Badge } from '../ui/Badge';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
    const { user } = useAuth();
    const location = useLocation();

    // Mapping path to title
    const getTitle = () => {
        switch (location.pathname) {
            case '/': return 'Dashboard';
            case '/templates': return 'Templates';
            case '/history': return 'History';
            default: return 'Lumina AI';
        }
    }

    return (
        <header className="h-16 border-b border-white/10 bg-black/20 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-8">
            <h1 className="font-heading text-xl font-semibold text-white tracking-wide">
                {getTitle()}
            </h1>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                    <span className="text-sm text-slate-400">Credits:</span>
                    <Badge variant="default" className="shadow-[0_0_10px_rgba(0,243,255,0.3)]">
                        {user?.credits ?? 0}
                    </Badge>
                </div>

                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-brand-violet to-brand-cyan flex items-center justify-center text-xs font-bold ring-2 ring-white/20">
                    {user?.username?.[0]?.toUpperCase() || 'U'}
                </div>
            </div>
        </header>
    );
};

export { Navbar };
