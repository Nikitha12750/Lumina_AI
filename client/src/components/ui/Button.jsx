import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

const Button = React.forwardRef(({ className, variant = 'primary', size = 'default', isLoading, children, ...props }, ref) => {
    const variants = {
        // Primary: Refined, crisp action button with subtle elevation
        primary: "bg-[#4F8EF7] text-white hover:bg-[#5B8DEF] active:bg-[#3B7AE5] border border-[#4F8EF7]/30 shadow-sm",
        // Dark: Linear-style dark surface button
        dark: "bg-[#171A21] text-[#F8FAFC] hover:bg-[#1D212A] border border-white/10 active:bg-[#242934] shadow-sm",
        // Secondary: Understated outlined button
        secondary: "bg-[#1D212A] text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-[#242934] border border-white/10",
        // Ghost: Zero border, minimal hover
        ghost: "text-[#94A3B8] hover:text-[#F8FAFC] hover:bg-white/[0.04]",
        // Destructive: Subtle red for delete/signout
        destructive: "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20",
        // Outline: Minimal 1px border
        outline: "border border-white/10 text-[#CBD5E1] hover:text-white hover:bg-white/[0.04]",
    };

    const sizes = {
        default: "h-8 px-3 text-xs font-medium",
        sm: "h-7 px-2.5 text-xs font-medium",
        lg: "h-10 px-4 text-sm font-medium",
        icon: "h-8 w-8 p-0",
    };

    return (
        <button
            ref={ref}
            className={cn(
                "inline-flex items-center justify-center rounded-[6px] transition-all duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#4F8EF7] disabled:pointer-events-none disabled:opacity-40 select-none cursor-pointer",
                variants[variant],
                sizes[size],
                className
            )}
            disabled={isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
            {children}
        </button>
    );
});

Button.displayName = "Button";

export { Button };
