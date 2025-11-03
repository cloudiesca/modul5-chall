import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecipes } from '../hooks/useRecipes';
import { useFavorites } from '../hooks/useFavorites';
import { useReviews } from '../hooks/useReviews';
import { Heart, Clock, Users, ChefHat, Share2 } from 'lucide-react';

const RecipeDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { recipes, loading: recipeLoading } = useRecipes();
    const { favorites, toggleFavorite, loading: favLoading } = useFavorites();
    const { reviews } = useReviews();

    const recipe = recipes.find((r) => r.id === parseInt(id));
    const isFavorited = favorites.some((f) => f.id === parseInt(id));

    const handleToggleFavorite = () => {
        toggleFavorite(recipe);
    };

    const handleShare = async () => {
        const shareUrl = window.location.href;
        const shareData = {
            title: recipe.name,
            text: `Coba deh resep "${recipe.name}" dari Resep Nusantara! 🍽️`,
            url: shareUrl,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(shareUrl);
                alert('Link resep disalin ke clipboard!');
            }
        } catch (err) {
            console.error('Gagal membagikan:', err);
        }
    };

    if (recipeLoading) {
        return <div className="text-center py-20 text-gray-500">Memuat resep...</div>;
    }

    if (!recipe) {
        return <div className="text-center py-20 text-gray-500">Resep tidak ditemukan.</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="text-indigo-600 hover:text-indigo-700 font-medium"
                >
                    ← Kembali
                </button>

                <div className="flex items-center gap-3">
                    <button
                        onClick={handleShare}
                        className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-indigo-100 hover:text-indigo-700 transition"
                        title="Bagikan resep ini"
                    >
                        <Share2 className="w-5 h-5" />
                    </button>

                    <button
                        onClick={handleToggleFavorite}
                        disabled={favLoading}
                        className={`p-2 rounded-full transition-colors ${isFavorited
                                ? 'bg-red-100 text-red-600'
                                : 'bg-gray-100 text-gray-400'
                            }`}
                        title="Tambah ke favorit"
                    >
                        <Heart className={isFavorited ? 'fill-current' : ''} />
                    </button>
                </div>
            </div>

            {/* Gambar Resep */}
            <div className="max-w-5xl mx-auto px-4">
                <div className="rounded-2xl overflow-hidden shadow-lg">
                    <img
                        src={recipe.image}
                        alt={recipe.name}
                        className="w-full h-72 object-cover"
                    />
                </div>

                {/* Detail Resep */}
                <div className="mt-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-3">{recipe.name}</h1>
                    <div className="flex flex-wrap items-center gap-4 text-gray-500 mb-6">
                        <span className="flex items-center gap-1">
                            <Clock size={18} /> {recipe.time}
                        </span>
                        <span className="flex items-center gap-1">
                            <Users size={18} /> {recipe.servings}
                        </span>
                        <span className="flex items-center gap-1">
                            <ChefHat size={18} /> {recipe.category}
                        </span>
                    </div>

                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Bahan-bahan</h2>
                    <ul className="list-disc list-inside text-gray-600 mb-6 space-y-1">
                        {recipe.ingredients.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>

                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Langkah-langkah</h2>
                    <ol className="list-decimal list-inside text-gray-600 space-y-1">
                        {recipe.instructions.map((step, index) => (
                            <li key={index}>{step}</li>
                        ))}
                    </ol>

                    {/* Ulasan */}
                    <div className="mt-10 border-t pt-6">
                        <h2 className="text-xl font-semibold text-gray-700 mb-3">Ulasan</h2>
                        {reviews
                            .filter((review) => review.recipeId === recipe.id)
                            .map((review, index) => (
                                <div key={index} className="mb-4 p-3 bg-gray-50 rounded-lg">
                                    <p className="font-medium text-gray-800">{review.user}</p>
                                    <p className="text-gray-600 text-sm">{review.comment}</p>
                                </div>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetailPage;
