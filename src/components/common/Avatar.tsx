import React, { HTMLAttributes } from 'react';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  src?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  name,
  size = 'md',
  src,
  className = '',
  ...props
}) => {
  const sizeMap = {
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-9 h-9 text-xs',
    lg: 'w-11 h-11 text-sm',
  };

  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div
      className={`rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-mono font-bold text-white shrink-0 overflow-hidden ${sizeMap[size]} ${className}`}
      {...props}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span>{initials || 'U'}</span>
      )}
    </div>
  );
};

export interface CoinAvatarProps {
  symbol: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CoinAvatar: React.FC<CoinAvatarProps> = ({
  symbol,
  size = 'md',
  className = '',
}) => {
  const sizeMap = {
    sm: 'w-7 h-7 text-[10px]',
    md: 'w-9 h-9 text-xs',
    lg: 'w-11 h-11 text-sm',
  };

  const glyph = symbol.slice(0, 3).toUpperCase();

  return (
    <div
      className={`rounded-lg bg-slate-800 border border-slate-700/80 flex items-center justify-center font-mono font-bold text-white shadow-inner shrink-0 ${sizeMap[size]} ${className}`}
      title={symbol}
    >
      {glyph}
    </div>
  );
};
