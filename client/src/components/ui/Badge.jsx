import React from 'react';
import { cn } from '../../lib/utils';

const Badge = ({ className, variant = 'default', children, ...props }) => {
    const variants = {
        default: "bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20",
        secondary: "bg-brand-violet/10 text-brand-violet border-brand-violet/20",
        outline: "border-white/20 text-slate-300",
        success: "bg-green-500/10 text-green-400 border-green-500/20"
    };

    return (
        <div className={cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", variants[variant], className)} {...props}>
            {children}
        </div>
    );
};

export { Badge };
