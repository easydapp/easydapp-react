import { parse_param } from '@jellypack/runtime/lib/common/query';
import { ComponentId } from '@jellypack/runtime/lib/model/common/identity';
import { ComponentIdentityValue } from '@jellypack/runtime/lib/model/components/identity';
import { CombinedRuntime } from '@jellypack/runtime/lib/runtime';
import { ApiData, ApiDataAnchor } from '@jellypack/runtime/lib/store/api';
import { CodeData, CodeDataAnchor } from '@jellypack/runtime/lib/store/code';
import { Combined, CombinedAnchor } from '@jellypack/runtime/lib/store/combined';
import { DappMetadata, DappView } from '@jellypack/runtime/lib/store/dapp';
import { DappAccessView, DappVerified } from '@jellypack/runtime/lib/store/dapp/access';
import { Publisher, PublisherAnchor } from '@jellypack/runtime/lib/store/publisher';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { forwardRef, useCallback, useEffect, useImperativeHandle, useState } from 'react';
import { createConfig, http, WagmiProvider } from 'wagmi';
import { bsc, bscTestnet, hashkey, hashkeyTestnet, mainnet, polygon, polygonAmoy, sepolia } from 'wagmi/chains';

import '../assets/css/main.css';
import '../assets/css/main.scss';
import '../assets/css/view.scss';
import '../assets/font/iconfont.js';

import { IncrementCombinedCall, IncrementDappCalledByToken } from '@jellypack/runtime/lib/canisters/storage';
import { ExecuteEvmActionCall } from '@jellypack/runtime/lib/model/components/call/evm/action/call';
import { ExecuteEvmActionDeploy } from '@jellypack/runtime/lib/model/components/call/evm/action/deploy';
import {
    ExecuteEvmActionTransaction,
    ExecuteEvmActionTransactionEstimateGas,
} from '@jellypack/runtime/lib/model/components/call/evm/action/transaction';
import { ExecuteEvmActionTransfer } from '@jellypack/runtime/lib/model/components/call/evm/action/transfer';
import { ExecuteHttpCall } from '@jellypack/runtime/lib/model/components/call/http';
import { ExecuteIcActionCall } from '@jellypack/runtime/lib/model/components/call/ic/action/call';
import { CodeExecutor, ParseFuncCandid, ParseServiceCandid } from '@jellypack/runtime/lib/wasm';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import React from 'react';

import { CombinedView } from '../combined';
import Icon from '../common/icon';
import { LoadingSkeleton } from '../common/loading';
import { cn } from '../common/utils.js';
import { ConnectWalletView } from '../connect';
import { ConnectSpecialWallet, ConnectWallet } from '../connect/wallet';
import { DappStatusView } from '../status';
import { CustomStorage, wrap_storage } from '../storage';
import { fetch_dapp, fetch_dapp_access } from './fetch';

const rainbow_config = getDefaultConfig({
    appName: 'Easydapp',
    projectId: 'd434c265182375eb1fdb058042717a15',
    chains: [mainnet, sepolia, bsc, bscTestnet, hashkey, hashkeyTestnet, polygon, polygonAmoy],
    ssr: true, // If your dApp uses server side rendering (SSR)
});
const config = createConfig({
    chains: [mainnet, sepolia, bsc, bscTestnet, hashkey, hashkeyTestnet, polygon, polygonAmoy],
    transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
        [bsc.id]: http(),
        [bscTestnet.id]: http(),
        [hashkey.id]: http(),
        [hashkeyTestnet.id]: http(),
        [polygon.id]: http(),
        [polygonAmoy.id]: http(),
    },
    ssr: true,
});

const queryClient = new QueryClient();

function WrappedRainbow({
    children,
    is_evm_rainbow_supported,
}: {
    children: React.ReactNode;
    is_evm_rainbow_supported: boolean;
}) {
    if (is_evm_rainbow_supported) {
        return (
            <WagmiProvider config={rainbow_config}>
                <QueryClientProvider client={queryClient}>
                    <RainbowKitProvider>{children}</RainbowKitProvider>
                </QueryClientProvider>
            </WagmiProvider>
        );
    }
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </WagmiProvider>
    );
}

export const LinkDappView = forwardRef(
    (
        {
            id,
            identity,
            storage: upper_storage,
            connect_wallet: upper_connect_wallet,
            special_wallet: upper_special_wallet,
            query_dapp_access: upper_query_dapp_access,
            query_dapp: upper_query_dapp,
            query_publisher: upper_query_publisher,
            query_code: upper_query_code,
            query_api: upper_query_api,
            query_combined: upper_query_combined,
            onDappMetadata,
            onPublisher,
            code_executor,
            parse_service_candid,
            parse_func_candid,
            increment_combined_called,
            increment_dapp_called_by_token,
            execute_http_call,
            execute_ic_action_call,
            execute_evm_action_call,
            execute_evm_action_transaction_estimate_gas,
            execute_evm_action_transaction,
            execute_evm_action_deploy,
            execute_evm_action_transfer,
            is_evm_rainbow_supported = true,
        }: {
            id: string;
            identity?: Record<ComponentId, ComponentIdentityValue>;
            storage?: CustomStorage;
            connect_wallet?: ConnectWallet;
            special_wallet?: ConnectSpecialWallet;
            query_dapp_access?: (id: string) => Promise<DappAccessView | undefined>;
            query_dapp?: (id: string, verified?: DappVerified) => Promise<DappView | undefined>;
            query_publisher?: (anchor: PublisherAnchor) => Promise<Publisher | undefined>;
            query_code?: (anchor: CodeDataAnchor) => Promise<CodeData | undefined>;
            query_api?: (anchor: ApiDataAnchor) => Promise<ApiData | undefined>;
            query_combined?: (anchor: CombinedAnchor) => Promise<Combined | undefined>;
            onDappMetadata?: (metadata: DappMetadata) => void;
            onPublisher?: (publisher: Publisher) => void;
            code_executor?: CodeExecutor;
            parse_service_candid?: ParseServiceCandid;
            parse_func_candid?: ParseFuncCandid;
            increment_combined_called?: IncrementCombinedCall;
            increment_dapp_called_by_token?: IncrementDappCalledByToken;
            execute_http_call?: ExecuteHttpCall;
            execute_ic_action_call?: ExecuteIcActionCall;
            execute_evm_action_call?: ExecuteEvmActionCall;
            execute_evm_action_transaction_estimate_gas?: ExecuteEvmActionTransactionEstimateGas;
            execute_evm_action_transaction?: ExecuteEvmActionTransaction;
            execute_evm_action_deploy?: ExecuteEvmActionDeploy;
            execute_evm_action_transfer?: ExecuteEvmActionTransfer;
            is_evm_rainbow_supported?: boolean;
        },
        ref,
    ) => {
        const [theme, setTheme] = useState<string | null>(document.body.getAttribute('data-theme'));

        const [loading, setLoading] = useState(false);
        // const [showDraw, setShowDraw] = useState(false);

        const [loadingError, setLoadingError] = useState<string>();
        const [error, setError] = useState<string>();

        const [access, setAccess] = useState<DappAccessView>();
        const [verified, setVerified] = useState<DappVerified>();
        const [dapp, setDapp] = useState<DappView>();
        const [param, setParam] = useState<Record<string, string>>();

        const [metadata, setMetadata] = useState<DappMetadata>();

        const [refresh, setRefresh] = useState(0);

        const onRefresh = () => {
            setLoadingError(undefined);

            setRefresh((refresh) => refresh + 1);
        };

        // 1. Analysis parameter
        useEffect(() => setParam(parse_param(id)), [id]);
        // 2. Inquiry access permissions
        useEffect(() => {
            if (param === undefined) return;
            const share_id = id.split('?')[0];
            if (!share_id) return setLoadingError('invalid dapp id');

            const start = new Date().getTime();
            setLoading(true);
            fetch_dapp_access(share_id, upper_query_dapp_access, upper_query_dapp)
                .then((access) => {
                    if (!access) throw new Error('dapp access not found');

                    const end = new Date().getTime();
                    console.debug(`load dapp spend:`, end - start, `ms`);

                    setAccess(access);
                    setLoadingError('');
                })
                .catch((e) => setLoadingError(e.message))
                .finally(() => setLoading(false));
        }, [id, param, upper_query_dapp_access, refresh, upper_query_dapp]);
        // 3. Analytical authority
        useEffect(() => {
            if (param === undefined) return;
            if (access === undefined) return;

            if ('none' === access) return setVerified('none'); // Unrequited
            if ('exclusive' === access) return setVerified('exclusive'); // No authority, you can only access dapp through upper_query_dapp
            if ('required' in access) {
                if (typeof access.required === 'object') {
                    if ('token' in access.required) {
                        // A single token, try to find token from Param
                        const token = param['_t']; // ! Token’s key is _t
                        if (!token) return setLoadingError(`missing token`);
                        return setVerified({ required: { token } });
                    }
                }
            }
            return setLoadingError(`unsupported access: ${JSON.stringify(access)}`);
        }, [param, access]);
        // 4. get dapp
        useEffect(() => {
            if (param === undefined) return;
            if (access === undefined) return;
            if (verified === undefined) return;
            const share_id = id.split('?')[0];
            if (!share_id) return setLoadingError('invalid dapp id');

            const start = new Date().getTime();
            setLoading(true);
            fetch_dapp(share_id, verified, upper_query_dapp)
                .then((dapp) => {
                    if (!dapp) throw new Error('dapp not found');

                    const end = new Date().getTime();
                    console.debug(`load dapp spend:`, end - start, `ms`);

                    if (onDappMetadata) onDappMetadata(dapp);
                    setMetadata(dapp);

                    for (const p of dapp.metadata?.params ?? []) {
                        if (typeof param[p.name] !== 'string') {
                            if (p.default === undefined) return setLoadingError(`missing param: ${p.name}`);
                        }
                    }
                    // ? Whether to provide identity
                    setDapp(dapp);
                    setLoadingError('');
                })
                .catch((e) => setLoadingError(e.message))
                .finally(() => setLoading(false));
        }, [id, param, access, verified, upper_query_dapp, onDappMetadata, refresh]);

        const [storage, setStorage] = useState<CustomStorage>();
        useEffect(() => {
            setStorage(wrap_storage(id, upper_storage));
        }, [id, upper_storage]);

        const [connect_wallet, setConnectWallet] = useState<ConnectWallet>();
        // console.debug(`🚀 ~ connect_wallet:`, connect_wallet);

        const [calling, setCalling] = useState(0);
        const [runtime, setRuntime] = useState<CombinedRuntime>();
        const [reset, setReset] = useState(0);

        const onCalling = useCallback(() => {
            setCalling((calling) => calling + 1);
        }, []);

        const onReset = useCallback(() => {
            setRuntime((old) => old?.stop_timer());
            setReset((reset) => reset + 1);
        }, []);

        useImperativeHandle(ref, () => ({ drop: onReset }));

        useEffect(() => {
            const updateTheme = () => {
                const dataTheme = document.body.getAttribute('data-theme');
                const themeMode = document.body.getAttribute('theme-mode');
                const isHtmlDark = document.documentElement.classList.contains('dark');

                const htmlElement = document.documentElement;
                const htmlColorScheme = htmlElement.style.getPropertyValue('color-scheme');
                const isColorSchemeDark = htmlColorScheme === 'dark';

                const finalTheme =
                    isHtmlDark || dataTheme === 'dark' || themeMode === 'dark' || isColorSchemeDark ? 'dark' : 'light';

                localStorage.setItem('__ez-dapp-theme', finalTheme);
                setTheme(finalTheme);
            };

            const bodyObserver = new MutationObserver(updateTheme);

            bodyObserver.observe(document.body, {
                attributes: true,
                attributeFilter: ['data-theme', 'theme-mode'],
            });

            const htmlObserver = new MutationObserver(updateTheme);

            htmlObserver.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ['class'],
            });

            updateTheme();

            return () => {
                bodyObserver.disconnect();
                htmlObserver.disconnect();
            };
        }, []);

        return (
            <div className="ez-w-full">
                <WrappedRainbow is_evm_rainbow_supported={is_evm_rainbow_supported}>
                    <div
                        className={cn(
                            'ez-flex ez-w-full ez-items-center ez-justify-center',
                            theme === 'dark' && 'ez-dark',
                        )}
                        style={{ scrollbarColor: 'auto' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            className={cn(
                                'easydapp-reset ez-ez-flex ez-relative ez-mx-auto ez-box-border ez-w-full ez-min-w-[320px] ez-max-w-[550px] ez-flex-shrink-0 ez-cursor-default ez-flex-col ez-items-center ez-justify-center ez-overflow-hidden ez-rounded-2xl !ez-border-[1px] ez-border-solid ez-border-transparent ez-bg-light ez-px-[2px] dark:ez-border-[#9bff21] dark:ez-bg-dark dark:!ez-shadow-dark',
                            )}
                        >
                            <DappStatusView
                                id={id}
                                calling={calling}
                                runtime={runtime}
                                metadata={metadata}
                                onReset={onReset}
                                error={error}
                                setError={setError}
                                query_api={upper_query_api}
                            />

                            <div className="easydapp-card-body ez-relative ez-mb-[2px] ez-flex ez-w-full ez-flex-1 ez-cursor-default ez-flex-col ez-rounded-[12px]">
                                {loading && <LoadingSkeleton />}

                                {!loading && (
                                    <>
                                        {loadingError && (
                                            <div className="ez-scrollbar-show ez-flex ez-h-full ez-max-h-[650px] ez-min-h-[400px] ez-flex-1 ez-cursor-default ez-items-center ez-justify-center ez-overflow-y-auto ez-rounded-[12px] ez-bg-light2 dark:ez-bg-dark2">
                                                <div className="ez-flex ez-h-full ez-flex-col ez-items-center ez-justify-center ez-py-8">
                                                    <Icon name="ez-ui-wrong" className="!ez-h-[66px] !ez-w-[66px]" />
                                                    <div className="ez-mt-[15px] ez-text-center ez-font-['JetBrainsMono'] ez-text-base ez-font-normal ez-leading-[18px] ez-text-black dark:ez-text-white">
                                                        {loadingError}
                                                    </div>
                                                    <div
                                                        className="ez-mt-[15px] ez-flex ez-h-11 ez-w-[180px] ez-cursor-pointer ez-items-center ez-justify-center ez-rounded-[9px] ez-bg-black ez-text-center ez-font-['JetBrainsMono'] ez-text-sm ez-font-normal ez-leading-[18px] ez-text-white ez-opacity-100 hover:ez-opacity-80"
                                                        onClick={onRefresh}
                                                    >
                                                        Refresh
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {!loadingError && param && verified && dapp && connect_wallet && (
                                            <div className="ez-scrollbar-show ez-max-h-[650px] ez-min-h-[400px] ez-w-full ez-flex-1 ez-cursor-default ez-overflow-y-auto ez-rounded-[12px] ez-bg-light2 dark:ez-bg-dark2">
                                                <CombinedView
                                                    dapp={dapp}
                                                    verified={verified}
                                                    param={param}
                                                    setError={setError}
                                                    reset={reset}
                                                    identity={identity ?? {}}
                                                    connect_wallet={upper_connect_wallet ?? connect_wallet}
                                                    calling={calling}
                                                    onCalling={onCalling}
                                                    setRuntime={setRuntime}
                                                    query_publisher={upper_query_publisher}
                                                    query_code={upper_query_code}
                                                    query_api={upper_query_api}
                                                    query_combined={upper_query_combined}
                                                    onPublisher={onPublisher}
                                                    code_executor={code_executor}
                                                    parse_service_candid={parse_service_candid}
                                                    parse_func_candid={parse_func_candid}
                                                    increment_combined_called={increment_combined_called}
                                                    increment_dapp_called_by_token={increment_dapp_called_by_token}
                                                    execute_http_call={execute_http_call}
                                                    execute_ic_action_call={execute_ic_action_call}
                                                    execute_evm_action_call={execute_evm_action_call}
                                                    execute_evm_action_transaction_estimate_gas={
                                                        execute_evm_action_transaction_estimate_gas
                                                    }
                                                    execute_evm_action_transaction={execute_evm_action_transaction}
                                                    execute_evm_action_deploy={execute_evm_action_deploy}
                                                    execute_evm_action_transfer={execute_evm_action_transfer}
                                                />
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            {storage && (
                                <ConnectWalletView
                                    storage={storage}
                                    setConnectWallet={setConnectWallet}
                                    special_wallet={upper_special_wallet}
                                    is_evm_rainbow_supported={is_evm_rainbow_supported}
                                />
                            )}
                        </div>
                    </div>
                </WrappedRainbow>
            </div>
        );
    },
);
