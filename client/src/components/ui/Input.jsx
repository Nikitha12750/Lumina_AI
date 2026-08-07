import React from 'react';
import { cn } from '../../lib/utils';

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
    return (
        <input
            type={type}
            className={cn(
                "flex h-9 w-full rounded-[6px] bg-[#1D212A] border border-white/[0.08] px-3 py-1.5 text-xs text-[#F8FAFC] placeholder-[#64748B] transition-colors focus:border-[#4F8EF7] focus:outline-none disabled:cursor-not-allowed disabled:opacity-40",
                className
            )}
            ref={ref}
            {...props}
        />
    );
});
Input.displayName = "Input";

const Textarea = React.forwardRef(({ className, ...props }, ref) => {
    return (
        <textarea
            className={cn(
                "flex w-full rounded-[6px] bg-[#1D212A] border border-white/[0.08] p-3 text-sm text-[#F8FAFC] placeholder-[#64748B] transition-colors focus:border-[#4F8EF7] focus:outline-none disabled:cursor-not-allowed disabled:opacity-40 resize-none font-sans",
                className
            )}
            ref={ref}
            {...props}
        />
    );
});
Textarea.displayName = "Textarea";

const Label = React.forwardRef(({ className, ...props }, ref) => (
    <label
        ref={ref}
        className={cn(
            "text-xs font-medium text-[#94A3B8] select-none block mb-1.5",
            className
        )}
        {...props}
    />
));
Label.displayName = "Label";

const Select = React.forwardRef(({ className, children, ...props }, ref) => (
    <div className="relative">
        <select
            className={cn(
                "flex h-9 w-full rounded-[6px] bg-[#1D212A] border border-white/[0.08] px-3 py-1.5 text-xs text-[#F8FAFC] appearance-none cursor-pointer focus:border-[#4F8EF7] focus:outline-none pr-8",
                className
            )}
            ref={ref}
            {...props}
        >
            {children}
        </select>
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#64748B] text-[10px]">
            ▼
        </div>
    </div>
));
Select.displayName = "Select";

export { Input, Textarea, Label, Select };
