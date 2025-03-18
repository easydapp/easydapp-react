import { CombinedRuntime } from '@jellypack/runtime/lib/runtime';
import { ApiData, ApiDataAnchor } from '@jellypack/runtime/lib/store/api';
import { DappMetadata } from '@jellypack/runtime/lib/store/dapp';
import React, { useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import Icon from '../common/icon';
import { cn } from '../common/utils';
import { CallItem, count_call_item } from './call';
import { DappStatusContractView } from './item';

// Share button
export function DappShareButton({ id }: { id: string }) {
    const [isOpenHovered, setIsOpenHovered] = React.useState(false);

    return (
        <div
            className={cn(
                'ez-flex ez-h-[24px] ez-w-[24px] ez-flex-shrink-0 ez-cursor-pointer ez-items-center ez-justify-center ez-rounded-full ez-duration-150',
                isOpenHovered ? 'ez-bg-white dark:ez-bg-[#9BFF21]' : 'ez-bg-black dark:ez-bg-black',
            )}
            onMouseEnter={() => {
                setIsOpenHovered(true);
            }}
            onMouseLeave={() => {
                setIsOpenHovered(false);
            }}
        >
            <a href={`https://easydapp.ai/run/${id}`} target="_blank">
                <Icon
                    name="ez-open"
                    className={cn(
                        '!ez-h-[12px] !ez-w-[12px] ez-duration-150',
                        isOpenHovered ? 'ez-text-black dark:ez-text-black' : 'ez-text-white dark:ez-text-white',
                    )}
                />
            </a>
        </div>
    );
}

// Refresh button
export function DappRefreshButton({ onResetInner }: { onResetInner: () => void }) {
    const [isResetHovered, setIsResetHovered] = useState(false);

    return (
        <div
            onClick={onResetInner}
            onMouseEnter={() => {
                setIsResetHovered(true);
            }}
            onMouseLeave={() => {
                setIsResetHovered(false);
            }}
            className={cn(
                'ez-flex ez-h-[24px] ez-w-[24px] ez-flex-shrink-0 ez-cursor-pointer ez-items-center ez-justify-center ez-rounded-full ez-duration-150',
                isResetHovered ? 'ez-bg-white dark:ez-bg-[#9BFF21]' : 'ez-bg-black dark:ez-bg-black',
            )}
        >
            <Icon
                name="ez-refresh"
                className={cn(
                    '!ez-h-[14px] !ez-w-[14px] ez-duration-150',
                    isResetHovered ? 'ez-text-black dark:ez-text-black' : 'ez-text-white dark:ez-text-white',
                )}
            />
        </div>
    );
}

// Set button
export function DappStatusView({
    id,
    calling,
    runtime,
    metadata,
    onReset,
    error,
    setError,
    query_api: upper_query_api,
}: {
    id: string;
    calling: number;
    runtime?: CombinedRuntime;
    metadata?: DappMetadata;
    onReset: () => void;
    error?: string;
    setError: (error?: string) => void;
    query_api?: (anchor: ApiDataAnchor) => Promise<ApiData | undefined>;
}) {
    return (
        <div className="ez-relative ez-flex ez-h-[38px] ez-w-full">
            <div className="ez-flex ez-w-full ez-items-center ez-justify-between ez-px-2">
                {!runtime && <InnerDappStatusLoadingView id={id} metadata={metadata} onReset={onReset} />}

                {runtime && (
                    <InnerDappStatusView
                        id={id}
                        calling={calling}
                        metadata={metadata}
                        runtime={runtime}
                        onReset={onReset}
                        query_api={upper_query_api}
                    />
                )}
            </div>

            {error && (
                <div className="easydapp-error-slide-in-animation ez-absolute ez-left-0 ez-right-0 ez-top-[50px] ez-z-50 ez-mx-3 ez-rounded-md ez-bg-[#f4f4f4] ez-p-2 dark:ez-bg-black">
                    <div className="ez-flex ez-w-full ez-items-center ez-justify-center ez-gap-2">
                        <Icon
                            name="ez-ui-wrong"
                            className="!ez-h-[16px] !ez-w-[16px] ez-cursor-pointer ez-text-black"
                        ></Icon>

                        <div className="ez-flex-1 ez-truncate ez-text-left ez-font-['JetBrainsMono'] ez-text-base ez-font-medium ez-text-black dark:ez-text-white">
                            {error}
                        </div>

                        <CopyToClipboard text={JSON.stringify(error)}>
                            <div>
                                <Icon
                                    name="ez-copy"
                                    className="!ez-h-[13px] !ez-w-[13px] ez-cursor-pointer ez-text-black"
                                ></Icon>
                            </div>
                        </CopyToClipboard>

                        <div onClick={() => setError('')}>
                            <div>
                                <Icon
                                    name="ez-close2"
                                    className="!ez-h-[13px] !ez-w-[13px] ez-cursor-pointer ez-text-black"
                                ></Icon>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function InnerDappStatusView({
    id,
    calling,
    runtime,
    onReset,
    query_api: upper_query_api,
}: {
    id: string;
    calling: number;
    runtime: CombinedRuntime;
    metadata?: DappMetadata;
    onReset: () => void;
    query_api?: (anchor: ApiDataAnchor) => Promise<ApiData | undefined>;
}) {
    const [showReset, setShowReset] = useState(true);
    const [emptyHover, setEmptyHover] = useState(false);
    const [items, setItems] = useState<CallItem[]>([]);

    const onResetInner = () => {
        setShowReset(false);
        setTimeout(() => setShowReset(true), 1000);
        onReset();
    };

    useEffect(() => {
        const items = count_call_item(runtime);
        console.debug(`🚀 ~ useEffect ~ items:`, items);
        setItems(items);
    }, [runtime, calling]);

    return (
        <>
            {/* Head left Contracts list */}
            <div className="ez-flex ez-w-full ez-flex-row ez-items-center ez-justify-start">
                {items.length === 0 && (
                    <div
                        className={cn(
                            'ez-flex ez-h-[28px] ez-w-[28px] ez-flex-shrink-0 ez-cursor-pointer ez-items-center ez-justify-center ez-rounded-full !ez-border-[2px] ez-border-[#e8e8e8] ez-duration-150 dark:ez-border-[#1f4000]',
                            emptyHover ? 'ez-bg-white dark:ez-bg-[#9BFF21]' : 'ez-bg-black dark:ez-bg-black',
                        )}
                        onMouseEnter={() => {
                            setEmptyHover(true);
                        }}
                        onMouseLeave={() => {
                            setEmptyHover(false);
                        }}
                    >
                        {emptyHover && (
                            <div className="ez-absolute ez-left-[3px] ez-top-[39px] ez-z-50 ez-flex ez-w-[calc(100%-10px)] ez-flex-col ez-rounded-lg ez-bg-white ez-px-3 ez-py-[10px] !ez-shadow dark:ez-bg-[#222]">
                                <p className="ez-font-['JetBrainsMono'] ez-text-xs ez-font-normal ez-leading-snug ez-text-[#999999]">
                                    No Contracts
                                </p>
                            </div>
                        )}

                        <Icon
                            name="ez-contracts"
                            className={cn(
                                '!ez-h-[12px] !ez-w-[12px] ez-duration-150',
                                emptyHover ? 'ez-text-black dark:ez-text-black' : 'ez-text-white dark:ez-text-white',
                            )}
                        />
                    </div>
                )}

                {items.length !== 0 && (
                    <>
                        {items
                            .filter((item) => {
                                if ('http' in item) {
                                    if (!item.http.list.find((item) => !!item.data.length)) return false;
                                }
                                return true;
                            })
                            .map((item) => (
                                <DappStatusContractView
                                    key={item.key}
                                    calling={calling}
                                    item={item}
                                    query_api={upper_query_api}
                                />
                            ))}
                    </>
                )}
            </div>

            {/* The right side of the head */}
            <div className="ez-flex ez-h-[28px] ez-w-full ez-select-none ez-flex-row ez-items-center ez-justify-end ez-gap-x-[5px] ez-pl-2">
                {showReset && <DappRefreshButton onResetInner={onResetInner} />}

                {/* Share button */}
                <DappShareButton id={id} />
            </div>
        </>
    );
}

function InnerDappStatusLoadingView({
    id,
    runtime,
    onReset,
}: {
    id: string;
    runtime?: CombinedRuntime;
    metadata?: DappMetadata;
    onReset: () => void;
}) {
    const [showReset, setShowReset] = useState(true);

    const onResetInner = () => {
        setShowReset(false);
        setTimeout(() => setShowReset(true), 1000);
        onReset();
    };

    return (
        <>
            <div className="ez-flex ez-h-[28px] ez-w-full ez-select-none ez-flex-row ez-items-end ez-justify-end ez-gap-x-[5px] ez-pl-2">
                {/* Refresh button */}
                {showReset && !runtime && <DappRefreshButton onResetInner={onResetInner} />}

                {/* Share button */}
                <DappShareButton id={id} />
            </div>
        </>
    );
}
