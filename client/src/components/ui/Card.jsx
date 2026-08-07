import React from 'react';
import { cn } from '../../lib/utils';

const Card = React.forwardRef(({ className, children, hoverable = false, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "bg-[#171A21] border border-white/[0.08] rounded-[8px] p-5 relative",
            hoverable && "transition-colors duration-150 hover:bg-[#1D212A] hover:border-white/[0.14]",
            className
        )}
        {...props}
    >
        {children}
    </div>
));
Card.displayName = "Card";

export { Card };
