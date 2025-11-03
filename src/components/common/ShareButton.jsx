import { useState } from 'react';
import { Share2, X, Copy, Check, Facebook, Twitter, MessageCircle } from 'lucide-react';

export default function ShareButton({ recipeId, recipeName, recipeImage }) {
    const [showModal, setShowModal] = useState(false);
    const [copied, setCopied] = useState(false);

    // Ambil URL dari browser (otomatis menyesuaikan di Vercel)
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/recipe/${recipeId}`;
    const shareText = `Cek resep ${recipeName} di Resep Nusantara!`;

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            // Fallback untuk browser lama
            const textArea = document.createElement('textarea');
            textArea.value = shareUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: recipeName,
                    text: shareText,
                    url: shareUrl,
                });
            } catch (err) {
                console.log('Share dibatalkan atau gagal:', err);
            }
        } else {
            setShowModal(true);
        }
    };

    const shareOptions = [
        {
            name: 'WhatsApp',
            icon: MessageCircle,
            color: 'bg-green-500 hover:bg-green-600',
            url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
        },
        {
            name: 'Facebook',
            icon: Facebook,
            color: 'bg-blue-600 hover:bg-blue-700',
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
        },
        {
            name: 'Twitter',
            icon: Twitter,
            color: 'bg-sky-500 hover:bg-sky-600',
            url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
        },
    ];

    return (
        <>
            {/* Tombol utama Share */}
            <button
                onClick={handleNativeShare}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
            >
                <Share2 className="w-5 h-5" />
                <span className="hidden md:inline">Share</span>
            </button>

            {/* Modal Share */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full animate-slideUp">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-slate-200">
                            <h3 className="text-xl font-bold text-slate-800">Share Resep</h3>
                            <button
                                onClick={() => setShowModal(false)}
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                            {/* Preview resep */}
                            <div className="flex items-center gap-4 mb-6 p-4 bg-slate-50 rounded-xl">
                                {recipeImage && (
                                    <img
                                        src={recipeImage}
                                        alt={recipeName}
                                        className="w-16 h-16 object-cover rounded-lg"
                                    />
                                )}
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-800 line-clamp-2">{recipeName}</h4>
                                </div>
                            </div>

                            {/* Copy link */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">Link</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={shareUrl}
                                        readOnly
                                        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg bg-slate-50 text-slate-600 text-sm"
                                    />
                                    <button
                                        onClick={handleCopyLink}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all ${copied
                                            ? 'bg-green-500 text-white'
                                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                            }`}
                                    >
                                        {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                    </button>
                                </div>
                                {copied && (
                                    <p className="text-xs text-green-600 mt-2">✓ Link berhasil disalin!</p>
                                )}
                            </div>

                            {/* Share Options */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-3">
                                    Bagikan via
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {shareOptions.map((option) => (
                                        <a
                                            key={option.name}
                                            href={option.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={`flex flex-col items-center gap-2 p-4 ${option.color} text-white rounded-xl transition-all hover:scale-105`}
                                        >
                                            <option.icon className="w-6 h-6" />
                                            <span className="text-xs font-medium">{option.name}</span>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
