import React, { type ButtonHTMLAttributes } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export type MD3ButtonVariant = 'filled' | 'tonal' | 'outlined' | 'text';

interface MD3ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: MD3ButtonVariant;
    icon?: React.ReactNode;
}

export const MD3Button = ({
    children,
    className,
    variant = 'filled',
    icon,
    ...props
}: MD3ButtonProps) => {
    const baseStyles = "relative flex items-center justify-center gap-2 px-6 h-10 rounded-md-full font-medium transition-all duration-200 overflow-hidden text-sm disabled:opacity-38 disabled:cursor-not-allowed";

    const variants = {
        filled: "bg-md-primary text-md-on-primary hover:shadow-md hover:after:absolute hover:after:inset-0 hover:after:bg-md-on-primary/8 active:after:bg-md-on-primary/12",
        tonal: "bg-md-secondary-container text-md-on-secondary-container hover:shadow-sm hover:after:absolute hover:after:inset-0 hover:after:bg-md-on-secondary-container/8 active:after:bg-md-on-secondary-container/12",
        outlined: "border border-md-outline text-md-primary bg-transparent hover:bg-md-primary/8 active:bg-md-primary/12 focus:border-md-primary",
        text: "bg-transparent text-md-primary hover:bg-md-primary/8 active:bg-md-primary/12 min-w-[64px] px-3"
    };

    return (
        <button
            className={cn(baseStyles, variants[variant], className)}
            {...props}
        >
            {/* State Layer (simulated via after pseudo-element in variants or direct utilities) */}
            {icon && <span className="mr-1">{icon}</span>}
            {children}
        </button>
    );
};
