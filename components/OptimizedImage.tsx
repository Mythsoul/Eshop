import React from 'react';
import Image from 'next/image';
import { assets } from '@/assets/assets';

interface OptimizedImageProps {
    src: string;
    alt: string;
    className?: string;
    width?: number;
    height?: number;
    priority?: boolean;
    fill?: boolean;
    sizes?: string;
    fallbackSrc?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
    src,
    alt,
    className = '',
    width,
    height,
    priority = false,
    fill = false,
    sizes = '100vw',
    fallbackSrc = assets.product_image1
}) => {
    const [error, setError] = React.useState(false);

    return (
        <Image
            src={error ? fallbackSrc : src}
            alt={alt}
            className={`${className} ${error ? 'opacity-50' : ''}`}
            width={width}
            height={height}
            priority={priority}
            fill={fill}
            sizes={sizes}
            onError={() => setError(true)}
            loading={priority ? 'eager' : 'lazy'}
            quality={80}
        />
    );
};

export default OptimizedImage;
