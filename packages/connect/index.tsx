import { useEffect, useState } from 'react';
import { CustomStorage } from '../storage';
import { Connect2EvmModal } from './evm';
import { Connect2IcModal } from './ic';
import {
    ConnectSpecialWallet,
    ConnectWallet,
    GetIdentityEvmValue,
    GetIdentityIcValue,
} from './wallet';

export function ConnectWalletView({
    storage,
    setConnectWallet,
    special_wallet,
    is_evm_rainbow_supported,
}: {
    storage: CustomStorage;
    setConnectWallet: (connect_wallet: ConnectWallet) => void;
    special_wallet?: ConnectSpecialWallet;
    is_evm_rainbow_supported: boolean;
}) {
    const [ic, setIc] = useState<{ value: GetIdentityIcValue }>();
    const [evm, setEvm] = useState<{ value: GetIdentityEvmValue }>();

    useEffect(() => {
        if (!ic) return;
        if (!evm) return;

        setConnectWallet({
            ic: ic.value,
            evm: evm.value,
        });
    }, [setConnectWallet, ic, evm]);

    return (
        <>
            <Connect2IcModal storage={storage} setIc={setIc} special_wallet={special_wallet} />
            <Connect2EvmModal
                storage={storage}
                setEvm={setEvm}
                special_wallet={special_wallet}
                is_evm_rainbow_supported={is_evm_rainbow_supported}
            />
        </>
    );
}
