import React from 'react';
import { cn } from '../../lib/utils';

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
    return (
        <input
            type={type}
            className={cn(
                "glass-input flex h-10 w-full rounded-md px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            ref={ref}
            {...props}
        />
    );
});
Input.displayName = "Input";

const Label = React.forwardRef(({ className, ...props }, ref) => (
    <label
        ref={ref}
        className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-300",
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
                "glass-input flex h-10 w-full rounded-md px-3 py-2 text-sm appearance-none cursor-pointer",
                className
            )}
            ref={ref}
            {...props}
        >
            {children}
        </select>
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/50">
            ▼
        </div>
    </div>
));
Select.displayName = "Select";


export { Input, Label, Select };
