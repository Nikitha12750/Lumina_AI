import React from 'react';
import { cn } from '../../lib/utils';

const Badge = ({ className, variant = 'default', children, ...props }) => {
    const variants = {
        default: "bg-[#1D212A] text-[#94A3B8] border-white/[0.08]",
        accent: "bg-[#4F8EF7]/10 text-[#4F8EF7] border-[#4F8EF7]/20",
        outline: "border-white/[0.08] text-[#94A3B8]",
        success: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    };

    return (
        <span
            className={cn(
                "inline-flex items-center rounded-[4px] border px-2 py-0.5 text-[11px] font-medium tracking-tight select-none",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
};

export { Badge };
