import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white flex">
            {/* Background elements */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-violet/20 rounded-full blur-[120px] opacity-30 animate-pulse-slow" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-cyan/20 rounded-full blur-[120px] opacity-30 animate-pulse-slow" style={{ animationDelay: '1.5s' }} />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150" />
            </div>

            <Sidebar />

            <main className="flex-1 ml-64 relative z-10 flex flex-col min-h-screen">
                <Navbar />
                <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export { Layout };
