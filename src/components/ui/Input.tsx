import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = ({ label, error, className = '', ...props }: InputProps) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-slate-400 mb-1.5 ml-1">
                    {label}
                </label>
            )}
            <input
                className={`
          w-full bg-surface text-white 
          border border-white/10 
          rounded-xl px-4 py-3
          placeholder:text-slate-600
          outline-none
          focus:border-primary focus:ring-1 focus:ring-primary/50
          transition-all
          ${error ? 'border-red-500 focus:border-red-500' : ''}
          ${className}
        `}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-500 ml-1">{error}</p>
            )}
        </div>
    );
};
