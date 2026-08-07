import React from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <div className="min-h-screen bg-[#0F1115] text-[#F8FAFC] flex">
            {/* Slim Linear-style Sidebar */}
            <Sidebar />

            {/* Main Application Canvas */}
            <main className="flex-1 ml-[220px] relative z-10 flex flex-col min-h-screen">
                <Navbar />
                <div className="flex-1 p-6 md:p-8 overflow-y-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export { Layout };
