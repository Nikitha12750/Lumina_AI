import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ className }) => {
    return (
        <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
            <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-2 border-brand-cyan/20"></div>
                <motion.div
                    className="absolute inset-0 rounded-full border-t-2 border-brand-cyan"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute inset-2 rounded-full border-2 border-brand-violet/20"></div>
                <motion.div
                    className="absolute inset-2 rounded-full border-b-2 border-brand-violet"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
            </div>
            <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-brand-cyan font-mono text-sm tracking-widest"
            >
                PROCESSING...
            </motion.p>
        </div>
    );
};

export { Loader };
