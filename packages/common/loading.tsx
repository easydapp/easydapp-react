import ContentLoader from 'react-content-loader';

export function LoadingSkeleton() {
    return (
        <>
            <div className="ez-flex ez-h-full ez-w-full ez-flex-col ez-items-center ez-justify-center ez-gap-y-2 ez-rounded-[12px] ez-bg-white ez-py-2 dark:ez-bg-black">
                <div className="ez-flex ez-w-full ez-flex-col ez-gap-1.5 ez-px-2 dark:ez-opacity-60">
                    <ContentLoader speed={2} width="100%" height="300">
                        <rect x="0" y="0" rx="10" ry="10" width="100%" height="100%" />
                    </ContentLoader>
                    <ContentLoader speed={2} width="100%" height={'50'} animate>
                        <rect x="0" y="0" rx="10" ry="10" width="100%" height="100%" />
                    </ContentLoader>
                    <ContentLoader speed={2} width="100%" height={'80'}>
                        <rect x="0" y="0" rx="10" ry="10" width="100%" height="100%" />
                    </ContentLoader>
                    <ContentLoader speed={2} width="100%" height={'30'}>
                        <rect x="0" y="0" rx="5" ry="5" width="100%" height="100%" />
                    </ContentLoader>
                    <ContentLoader speed={2} width="100%" height={'40'}>
                        <rect x="0" y="0" rx="5" ry="5" width="100%" height="100%" />
                    </ContentLoader>
                    <ContentLoader speed={2} width="100%" height={'50'}>
                        <rect x="0" y="0" rx="5" ry="5" width="100%" height="100%" />
                    </ContentLoader>
                </div>
            </div>
        </>
    );
}
