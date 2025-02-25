import { EvmWallet } from '@jellypack/runtime/lib/model/common/wallet/evm';
import { IdentityEvmMetadata } from '@jellypack/runtime/lib/model/components/identity/evm';

export interface EvmConnectedMetadata {
    metadata: IdentityEvmMetadata;
    wallets: EvmWallet[];
    size: any;
    key: number;
}
