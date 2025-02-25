import {
    ComponentIdentityEvmValue,
    IdentityEvmMetadata,
} from '@jellypack/runtime/lib/model/components/identity/evm';
import {
    ComponentIdentityIcValue,
    IdentityIcMetadata,
} from '@jellypack/runtime/lib/model/components/identity/ic';
import { EvmChain } from '@jellypack/runtime/lib/model/types/evm';
import { JsonRpcProvider, JsonRpcSigner } from 'ethers';
import { Connector } from 'wagmi';
import { ConnectType as EvmConnectType } from './evm/connect-evm';
import { ConnectType as IcConnectType } from './ic/connect-ic';

export type GetIdentityIcValue = (
    metadata: IdentityIcMetadata,
) => Promise<ComponentIdentityIcValue | undefined>;

export type GetIdentityEvmValue = (
    metadata: IdentityEvmMetadata,
) => Promise<ComponentIdentityEvmValue | undefined>;

export type ConnectWallet = {
    ic: GetIdentityIcValue;
    evm: GetIdentityEvmValue;
};

export type ConnectSpecialWallet = {
    ic?: {
        actions?: Record<
            IcConnectType,
            (
                metadata: IdentityIcMetadata,
                type: IcConnectType,
            ) => Promise<ComponentIdentityIcValue | undefined>
        >;
        default?: (
            metadata: IdentityIcMetadata,
            type: IcConnectType,
        ) => Promise<ComponentIdentityIcValue | undefined>;
    };
    evm?: Record<
        EvmChain,
        {
            actions?: Record<
                EvmConnectType,
                (
                    metadata: IdentityEvmMetadata,
                    type: EvmConnectType,
                    chain: EvmChain,
                ) => Promise<ComponentIdentityEvmValue | undefined>
            >;
            default?: (
                metadata: IdentityEvmMetadata,
                type: EvmConnectType,
                chain: EvmChain,
            ) => Promise<ComponentIdentityEvmValue | undefined>;
        }
    >;
};

export type RainbowMetadata = {
    address: string | undefined;
    connector: Connector | undefined;
    provider: (evm_chain: EvmChain) => JsonRpcProvider;
    signer: (evm_chain: EvmChain) => JsonRpcSigner;
    switchChain: ({ chainId }: { chainId: number }) => void;
};
