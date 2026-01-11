import React from 'react';
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

const Card = React.forwardRef(({ className, children, hoverEffect = false, ...props }, ref) => (
    <motion.div
        ref={ref}
        initial={hoverEffect ? { opacity: 0, y: 20 } : {}}
        animate={hoverEffect ? { opacity: 1, y: 0 } : {}}
        whileHover={hoverEffect ? { y: -5, boxShadow: "0 20px 40px -15px rgba(0, 243, 255, 0.1)" } : {}}
        className={cn(
            "glass-card rounded-xl p-6 relative overflow-hidden",
            className
        )}
        {...props}
    >
        {children}
        {/* Shine effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
    </motion.div>
));
Card.displayName = "Card";

export { Card };
