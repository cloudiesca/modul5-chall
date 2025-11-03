// src/components/common/LazyImage.jsx
import { useState, useEffect, useRef } from 'react';

export default function LazyImage({
    src,
    alt,
    className = '',
    placeholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect fill="%23e2e8f0" width="400" height="300"/%3E%3Ctext fill="%2394a3b8" font-family="sans-serif" font-size="20" dy="10.5" font-weight="bold" x="50%25" y="50%25" text-anchor="middle"%3ELoading...%3C/text%3E%3C/svg%3E'
}) {
    const [imageSrc, setImageSrc] = useState(placeholder);
    const [imageLoaded, setImageLoaded] = useState(false);
    const imgRef = useRef();

    useEffect(() => {
        let observer;

        if (imgRef.current && !imageLoaded) {
            if ('IntersectionObserver' in window) {
                observer = new IntersectionObserver(
                    (entries) => {
                        entries.forEach((entry) => {
                            if (entry.isIntersecting) {
                                const img = new Image();
                                img.src = src;
                                img.onload = () => {
                                    setImageSrc(src);
                                    setImageLoaded(true);
                                };
                                observer.unobserve(entry.target);
                            }
                        });
                    },
                    {
                        threshold: 0.01,
                        rootMargin: '100px',
                    }
                );
                observer.observe(imgRef.current);
            } else {
                setImageSrc(src);
                setImageLoaded(true);
            }
        }

        return () => {
            if (observer && imgRef.current) {
                observer.unobserve(imgRef.current);
            }
        };
    }, [src, imageLoaded]);

    return (
        <img
            ref={imgRef}
            src={imageSrc}
            alt={alt}
            className={`${className} ${!imageLoaded ? 'blur-sm' : 'blur-0'} transition-all duration-300`}
            loading="lazy"
        />
    );
}