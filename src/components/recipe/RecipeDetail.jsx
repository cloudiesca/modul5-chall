import React, { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRecipe, useReviews, useCreateReview, useIsFavorited } from '../../hooks/useRecipes';
import LoadingSpinner from '../common/LoadingSpinner';

export default function RecipeDetail({ recipeId, onBack, onEdit, category = 'makanan' }) {
    const queryClient = useQueryClient();

    // === Hooks untuk ambil data ===
    const { recipe, loading: recipeLoading, error: recipeError } = useRecipe(recipeId);
    const { reviews, loading: reviewsLoading, refetch: refetchReviews } = useReviews(recipeId);
    const { createReview, loading: createLoading } = useCreateReview();
    const { isFavorited, loading: favLoading, toggleFavorite } = useIsFavorited(recipeId);

    const [fallbackRecipe, setFallbackRecipe] = useState(null);

    // === Fallback: cari resep di cache lokal kalau useRecipe gagal ===
    useEffect(() => {
        if (!recipe) {
            const makanan = queryClient.getQueryData(['recipes', 'makanan']) || [];
            const minuman = queryClient.getQueryData(['recipes', 'minuman']) || [];
            const profile = queryClient.getQueryData(['recipes', 'profile']) || [];

            const found =
                makanan.find((r) => r.id === recipeId) ||
                minuman.find((r) => r.id === recipeId) ||
                profile.find((r) => r.id === recipeId);

            if (found) setFallbackRecipe(found);
        }
    }, [recipe, recipeId, queryClient]);

    const currentRecipe = recipe || fallbackRecipe;

    // === Loading State ===
    if (recipeLoading || (!currentRecipe && !recipeError)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    // === Error State ===
    if (recipeError && !currentRecipe) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center bg-red-50 p-6 rounded-lg shadow-md border border-red-300">
                    <p className="text-red-600 font-bold text-lg mb-2">Terjadi Kesalahan</p>
                    <p className="text-red-500 mb-4">Gagal memuat data resep</p>
                    <button
                        onClick={onBack}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Kembali
                    </button>
                </div>
            </div>
        );
    }

    // === Tidak ditemukan ===
    if (!currentRecipe) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="text-center">
                    <p className="text-slate-600">Resep tidak ditemukan</p>
                    <button
                        onClick={onBack}
                        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Kembali
                    </button>
                </div>
            </div>
        );
    }

    // === Fungsi Review ===
    const handleAddReview = async (text) => {
        if (!text.trim()) return alert('Isi ulasan dulu ya!');
        await createReview({ recipeId, text });
        await refetchReviews();
    };

    // === Fungsi Share ===
    const handleShare = async () => {
        const shareUrl = `${window.location.origin}/recipe/${recipeId}`;
        const shareData = {
            title: currentRecipe.name,
            text: `Cek resep ${currentRecipe.name} ini!`,
            url: shareUrl
        };

        try {
            if (navigator.share) {
                // Jika device support Web Share API (mobile/modern browser)
                await navigator.share(shareData);
                console.log('Share berhasil!');
            } else {
                // Fallback: copy to clipboard untuk desktop
                await navigator.clipboard.writeText(shareUrl);
                alert('Link berhasil disalin ke clipboard!');
            }
        } catch (err) {
            // Jika user cancel atau error
            if (err.name !== 'AbortError') {
                console.error('Error sharing:', err);
                // Fallback manual copy
                try {
                    await navigator.clipboard.writeText(shareUrl);
                    alert('Link berhasil disalin!');
                } catch (clipboardErr) {
                    alert('Gagal membagikan link');
                }
            }
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-4 mt-4">
            {/* Tombol kembali */}
            <button
                onClick={onBack}
                className="text-blue-600 mb-4 hover:underline"
            >
                ← Kembali
            </button>

            {/* Gambar */}
            {currentRecipe.image_url && (
                <img
                    src={currentRecipe.image_url}
                    alt={currentRecipe.name}
                    className="w-full h-64 object-cover rounded-xl shadow-sm"
                />
            )}

            {/* Nama dan tombol */}
            <div className="flex justify-between items-center mt-4">
                <h1 className="text-2xl font-bold text-gray-800">{currentRecipe.name}</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => onEdit(currentRecipe.id)}
                        className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                    >
                        Edit
                    </button>
                    <button
                        onClick={toggleFavorite}
                        disabled={favLoading}
                        className={`px-3 py-1 rounded-md transition-colors ${isFavorited ? 'bg-red-500 text-white' : 'bg-gray-300 text-gray-800'
                            }`}
                    >
                        {isFavorited ? '❤️ Favorit' : '🤍 Simpan'}
                    </button>
                    {/* 🟢 Tombol Share - BARU! */}
                    <button
                        onClick={handleShare}
                        className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors flex items-center gap-1"
                    >
                        🔗 Share
                    </button>
                </div>
            </div>

            {/* Deskripsi */}
            <p className="text-gray-600 mt-3 whitespace-pre-line">{currentRecipe.description}</p>

            {/* Bahan */}
            <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2">Bahan-bahan</h2>
                <ul className="list-disc ml-6 text-gray-700">
                    {currentRecipe.ingredients?.map((item, idx) => (
                        <li key={idx}>{item}</li>
                    ))}
                </ul>
            </div>

            {/* Langkah */}
            <div className="mt-6">
                <h2 className="text-lg font-semibold mb-2">Langkah-langkah</h2>
                <ol className="list-decimal ml-6 text-gray-700">
                    {currentRecipe.steps?.map((step, idx) => (
                        <li key={idx}>{step}</li>
                    ))}
                </ol>
            </div>

            {/* Review */}
            <div className="mt-8">
                <h2 className="text-lg font-semibold mb-2">Ulasan Pengguna</h2>
                {reviewsLoading ? (
                    <p className="text-gray-500">Memuat ulasan...</p>
                ) : (
                    <ul className="space-y-2">
                        {reviews?.length > 0 ? (
                            reviews.map((rev) => (
                                <li
                                    key={rev.id}
                                    className="p-3 bg-gray-100 rounded-lg shadow-sm"
                                >
                                    <p className="text-gray-700">{rev.text}</p>
                                </li>
                            ))
                        ) : (
                            <p className="text-gray-500">Belum ada ulasan</p>
                        )}
                    </ul>
                )}

                {/* Tambah review */}
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        const input = e.target.review;
                        handleAddReview(input.value);
                        input.value = '';
                    }}
                    className="mt-4 flex gap-2"
                >
                    <input
                        name="review"
                        placeholder="Tulis ulasanmu..."
                        className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    />
                    <button
                        type="submit"
                        disabled={createLoading}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Kirim
                    </button>
                </form>
            </div>
        </div>
    );
}