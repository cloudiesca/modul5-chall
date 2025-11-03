// src/pages/ProfilePage.jsx
import { useState } from 'react';
import { useFavorites } from '../hooks/useFavorites';
import { Camera, User, Edit2, Heart, ChefHat, Clock, Star } from 'lucide-react';
import userService from '../services/userService';

export default function ProfilePage({ onRecipeClick }) {
    const [profile, setProfile] = useState(userService.getUserProfile());
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({
        username: profile.username,
        bio: profile.bio || '',
    });
    const { favorites, loading, error, refetch } = useFavorites();

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 2 * 1024 * 1024) {
            alert('Ukuran file maksimal 2MB');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            const result = userService.updateAvatar(reader.result);
            if (result.success) {
                setProfile(userService.getUserProfile());
                alert('Avatar berhasil diperbarui!');
            }
        };
        reader.readAsDataURL(file);
    };

    const handleSaveProfile = () => {
        if (!editData.username.trim()) {
            alert('Username tidak boleh kosong');
            return;
        }

        userService.updateUsername(editData.username);
        userService.updateBio(editData.bio);
        setProfile(userService.getUserProfile());
        setIsEditing(false);
        alert('Profile berhasil diperbarui!');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pb-20 md:pb-8">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white/40 mb-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <div className="relative">
                            <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg border-4 border-white">
                                {profile.avatar ? (
                                    <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-16 h-16 text-white" />
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
                                <Camera className="w-5 h-5" />
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                            </label>
                        </div>

                        <div className="flex-1 text-center md:text-left">
                            {!isEditing ? (
                                <>
                                    <h1 className="text-3xl font-bold text-slate-800 mb-2">{profile.username}</h1>
                                    <p className="text-slate-600 mb-4">{profile.bio || 'Belum ada bio. Klik edit untuk menambahkan bio.'}</p>
                                    <button
                                        onClick={() => {
                                            setEditData({ username: profile.username, bio: profile.bio || '' });
                                            setIsEditing(true);
                                        }}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors mx-auto md:mx-0"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        Edit Profile
                                    </button>
                                </>
                            ) : (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
                                        <input
                                            type="text"
                                            value={editData.username}
                                            onChange={(e) => setEditData({ ...editData, username: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                                            placeholder="Username"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Bio</label>
                                        <textarea
                                            value={editData.bio}
                                            onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 resize-none"
                                            placeholder="Ceritakan tentang dirimu..."
                                            rows={3}
                                            maxLength={200}
                                        />
                                        <p className="text-xs text-slate-500 mt-1">{editData.bio.length}/200 karakter</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={handleSaveProfile} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium">
                                            Simpan
                                        </button>
                                        <button onClick={() => setIsEditing(false)} className="flex-1 px-4 py-2 bg-slate-200 text-slate-700 rounded-xl hover:bg-slate-300 font-medium">
                                            Batal
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-200">
                        <div className="text-center bg-white/50 rounded-xl p-4">
                            <div className="flex items-center justify-center gap-2 text-red-600 mb-2">
                                <Heart className="w-6 h-6 fill-current" />
                            </div>
                            <p className="text-3xl font-bold text-slate-800">{favorites.length}</p>
                            <p className="text-sm text-slate-600">Resep Favorit</p>
                        </div>
                        <div className="text-center bg-white/50 rounded-xl p-4">
                            <div className="flex items-center justify-center gap-2 text-blue-600 mb-2">
                                <ChefHat className="w-6 h-6" />
                            </div>
                            <p className="text-3xl font-bold text-slate-800">0</p>
                            <p className="text-sm text-slate-600">Resep Dibuat</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border border-white/40">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                            <Heart className="w-6 h-6 text-red-600 fill-current" />
                            Resep Favorit
                        </h2>
                        {favorites.length > 0 && (
                            <button onClick={refetch} className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                Refresh
                            </button>
                        )}
                    </div>

                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="mt-4 text-slate-600">Memuat favorit...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                                <p className="text-red-600 font-semibold mb-2">Terjadi Kesalahan</p>
                                <p className="text-red-500 mb-4">{error}</p>
                                <button onClick={refetch} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">
                                    Coba Lagi
                                </button>
                            </div>
                        </div>
                    ) : favorites.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Heart className="w-12 h-12 text-red-300" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 mb-2">Belum Ada Resep Favorit</h3>
                            <p className="text-slate-600 mb-6">Mulai tambahkan resep kesukaanmu!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {favorites.map((recipe) => (
                                <div
                                    key={recipe.id}
                                    onClick={() => onRecipeClick && onRecipeClick(recipe.id, recipe.category)}
                                    className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all cursor-pointer group hover:scale-105 duration-300"
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={recipe.image_url}
                                            alt={recipe.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                        <div className="absolute top-3 right-3">
                                            <div className="bg-red-500 text-white p-2 rounded-full shadow-lg">
                                                <Heart className="w-4 h-4 fill-current" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <h3 className="font-bold text-slate-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                                            {recipe.name}
                                        </h3>

                                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${recipe.category === 'makanan' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                                            }`}>
                                            {recipe.category === 'makanan' ? 'Makanan' : 'Minuman'}
                                        </span>

                                        <div className="flex items-center justify-between text-xs text-slate-600">
                                            <div className="flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                <span>{recipe.prep_time} min</span>
                                            </div>
                                            {recipe.average_rating > 0 && (
                                                <div className="flex items-center gap-1">
                                                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                                    <span className="font-semibold">{recipe.average_rating.toFixed(1)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}