// src/components/common/FavoriteButton.jsx
import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useToggleFavorite, useIsFavorited } from '../../hooks/useFavorites';

export default function FavoriteButton({ recipeId, size = 'md', showCount = false, initialCount = 0 }) {
    const { isFavorited, loading, toggleFavorite } = useIsFavorited(recipeId);
    const [isAnimating, setIsAnimating] = useState(false);

    const sizes = {
        sm: 'w-8 h-8',
        md: 'w-10 h-10',
        lg: 'w-12 h-12'
    };

    const iconSizes = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6'
    };

    const handleToggle = async (e) => {
        e.stopPropagation(); // Prevent card click

        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 300);

        await toggleFavorite();
    };

    return (
        <button
            onClick={handleToggle}
            disabled={loading}
            className={`
        ${sizes[size]} rounded-full flex items-center justify-center gap-1.5
        transition-all duration-200
        ${isFavorited
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-white/90 hover:bg-white text-slate-700 hover:text-red-500'
                }
        backdrop-blur-sm shadow-md hover:shadow-lg
        ${isAnimating ? 'scale-125' : 'scale-100'}
        ${loading ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
        group
      `}
            title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
        >
            <Heart
                className={`
          ${iconSizes[size]}
          transition-all duration-200
          ${isFavorited ? 'fill-current' : ''}
          ${isAnimating ? 'animate-pulse' : ''}
        `}
            />
            {showCount && initialCount > 0 && (
                <span className="text-xs font-semibold">
                    {initialCount > 999 ? '999+' : initialCount}
                </span>
            )}
        </button>
    );
}