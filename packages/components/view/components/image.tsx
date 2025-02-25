import { parse_custom_style } from '@jellypack/runtime/lib/model/common/custom';
import { InnerViewImageMetadataStyle } from '@jellypack/runtime/lib/model/components/view/inner/image';
import { useEffect, useRef, useState } from 'react';
import ContentLoader from 'react-content-loader';
import { parseStyleWithImportant } from '../../../common/utils';
import { proxy_image_src } from '../common';

export function InnerImageView({
    value,
    href,
    customStyle,
}: {
    value: string | number[];
    href?: string;
    customStyle?: string;
}) {
    const [error, setError] = useState<string>();
    const [src, setSrc] = useState<string>();

    useEffect(() => {
        const src = proxy_image_src(value, 800);
        if (src) setSrc(src);
        else setError(`Unsupported image source: ${value}`);
    }, [value]);

    // * custom style
    const custom = parse_custom_style<InnerViewImageMetadataStyle>(customStyle);

    return (
        <>
            {error ? (
                <div className="ez-flex ez-w-full ez-items-center ez-justify-center ez-text-left ez-font-['JetBrainsMono'] ez-text-base ez-text-[#ff5b5b]">
                    {error}
                </div>
            ) : (
                <>
                    {href && (
                        <a href={href} target="_blank" className="ez-w-full">
                            {src && <InnerImage src={src} custom={custom} />}
                        </a>
                    )}
                    {!href && <>{src && <InnerImage src={src} custom={custom} />}</>}
                </>
            )}
        </>
    );
}

const InnerImage = ({ src, custom }: { src: string; custom?: InnerViewImageMetadataStyle }) => {
    const imageElementRef = useRef<HTMLImageElement | null>(null);

    useEffect(() => {
        if (custom?.style && imageElementRef.current) {
            const styleWithImportant = parseStyleWithImportant(custom.style);

            Object.entries(styleWithImportant).forEach(([key, value]) => {
                if (imageElementRef.current) {
                    imageElementRef.current.style.setProperty(key, value, 'important');
                }
            });
        }
    }, [custom?.style]);

    const [hidden, setHidden] = useState(true);
    return (
        <div className={`ez-relative ez-flex ez-h-full ez-w-full ${hidden ? 'ez-h-[300px]' : ''}`}>
            <img
                className={`ez-aspect-auto ez-w-full ez-rounded-xl ez-object-cover ez-object-center ${hidden ? 'ez-hidden' : ''}`}
                style={{ ...custom?.style }}
                src={src}
                ref={imageElementRef}
                onLoad={() => setHidden(false)}
                onError={() => setHidden(false)}
            />
            {hidden && (
                <div className="ez-absolute ez-bottom-0 ez-left-0 ez-right-0 ez-top-0">
                    <ContentLoader speed={2} width="100%" height="100%">
                        <rect x="0" y="0" rx="10" ry="10" width="100%" height="100%" />
                    </ContentLoader>
                </div>
            )}
        </div>
    );
};
