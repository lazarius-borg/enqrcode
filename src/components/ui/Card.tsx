import type { ReactNode } from 'react';

type CardProps = {
    children: ReactNode;
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
};

export const Card = ({ children, className = '', padding = 'md' }: CardProps) => {
    const paddingClass = {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    }[padding];

    return (
        <div className={`bg-surface/50 backdrop-blur-md border border-white/5 shadow-xl rounded-3xl ${paddingClass} ${className} transition-all duration-300`}>
            {children}
        </div>
    );
};
